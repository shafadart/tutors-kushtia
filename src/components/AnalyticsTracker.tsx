"use client";

import { useEffect, useRef } from "react";
import { doc, setDoc, serverTimestamp, increment, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AnalyticsTracker() {
  const isInitialized = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Only run on the client and only run once in strict mode
    if (typeof window === "undefined" || isInitialized.current) return;
    isInitialized.current = true;

    // 1. Manage Session ID for Heartbeat
    let sessionId = sessionStorage.getItem("tutors_kushtia_session_id");
    if (!sessionId) {
      sessionId = `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
      sessionStorage.setItem("tutors_kushtia_session_id", sessionId);
    }
    sessionIdRef.current = sessionId;

    // 2. Track Total & Daily Visits (Runs once per session)
    const trackVisit = async () => {
      try {
        const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const lastVisitDate = localStorage.getItem("last_visit_date");

        if (lastVisitDate !== todayStr) {
          // New visit today!
          localStorage.setItem("last_visit_date", todayStr);

          // Increment Total Stats
          await setDoc(
            doc(db, "analytics", "stats_total"),
            { total_visits: increment(1) },
            { merge: true }
          );

          // Increment Daily Stats
          await setDoc(
            doc(db, "analytics", `stats_daily_${todayStr}`),
            { visits_today: increment(1), date: todayStr },
            { merge: true }
          );
        }
      } catch (error) {
        console.error("Failed to track visit:", error);
      }
    };

    trackVisit();

    // 3. Heartbeat for Active Visitors
    const pingHeartbeat = async () => {
      try {
        if (!sessionIdRef.current) return;
        await setDoc(
          doc(db, "analytics_live", sessionIdRef.current),
          { lastActive: serverTimestamp() },
          { merge: true }
        );
      } catch (error) {
        // Silently fail if offline or permission denied
      }
    };

    // Initial ping
    pingHeartbeat();

    // Ping every 60 seconds
    const heartbeatInterval = setInterval(pingHeartbeat, 60000);

    // 4. Cleanup on tab close
    const cleanup = () => {
      if (sessionIdRef.current) {
        // We use navigator.sendBeacon ideally, but firestore doesn't support beacon out of the box.
        // We will try standard deleteDoc (might not always fire if browser kills it too fast)
        try {
          deleteDoc(doc(db, "analytics_live", sessionIdRef.current));
        } catch (e) {
          // ignore
        }
      }
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  return null; // Invisible component
}
