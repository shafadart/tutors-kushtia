"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, onSnapshot, doc, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function AnalyticsDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [liveVisitors, setLiveVisitors] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [todayRequests, setTodayRequests] = useState(0);

  // Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/admin/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    // 1. Live Visitors Subscription
    const unsubscribeLive = onSnapshot(collection(db, "analytics_live"), (snapshot) => {
      const now = Date.now();
      let activeCount = 0;
      snapshot.forEach((d) => {
        const data = d.data();
        if (data.lastActive) {
          const lastActiveTime = data.lastActive.toMillis();
          // Consider active if pinged within the last 2 minutes (120,000 ms)
          if (now - lastActiveTime < 120000) {
            activeCount++;
          }
        }
      });
      setLiveVisitors(activeCount);
    });

    // 2. Total Visits Subscription
    const unsubscribeTotal = onSnapshot(doc(db, "analytics", "stats_total"), (d) => {
      if (d.exists()) {
        setTotalVisits(d.data().total_visits || 0);
      }
    });

    // 3. Today's Visits Subscription
    const todayStr = new Date().toISOString().split("T")[0];
    const unsubscribeToday = onSnapshot(doc(db, "analytics", `stats_daily_${todayStr}`), (d) => {
      if (d.exists()) {
        setTodayVisits(d.data().visits_today || 0);
      }
    });

    // 4. Today's Tuition Requests
    // Calculate start of today in Firestore Timestamp
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startTimestamp = Timestamp.fromDate(startOfToday);

    const requestsQuery = query(
      collection(db, "tuition_requests"),
      where("createdAt", ">=", startTimestamp)
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      setTodayRequests(snapshot.size);
    });

    return () => {
      unsubscribeLive();
      unsubscribeTotal();
      unsubscribeToday();
      unsubscribeRequests();
    };
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <span className="text-xl">👁️</span>
            </div>
            <div>
              <h1 className="font-bold text-lg font-['Outfit'] tracking-wide text-gray-100">CCTV Monitor</h1>
              <p className="text-gray-400 text-xs font-['Hind_Siliguri'] uppercase tracking-wider">Live Operations</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition-all font-['Hind_Siliguri']"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 mb-2">
              Command Center
            </h2>
            <p className="text-gray-400 font-['Hind_Siliguri']">Real-time surveillance of platform activity.</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Live Visitors */}
            <motion.div
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="relative overflow-hidden bg-gradient-to-br from-[#1A0B1E] to-[#0A0A0A] p-6 rounded-3xl border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.15)] group"
            >
              <div className="absolute top-0 right-0 p-4">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"></span>
                </span>
              </div>
              <p className="text-gray-400 text-sm font-semibold font-['Hind_Siliguri'] uppercase tracking-wider mb-2 group-hover:text-red-400 transition-colors">
                বর্তমান ভিজিটর
              </p>
              <div className="flex items-end gap-3">
                <h3 className="text-6xl font-black font-['Outfit'] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {liveVisitors}
                </h3>
                <span className="text-red-400 font-bold mb-2 animate-pulse">LIVE</span>
              </div>
            </motion.div>

            {/* Card 2: Today's Visitors */}
            <motion.div
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="bg-white/[0.02] backdrop-blur-xl p-6 rounded-3xl border border-white/[0.05] shadow-xl hover:bg-white/[0.04] transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-500/30">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm font-semibold font-['Hind_Siliguri'] uppercase tracking-wider mb-1">
                আজকের মোট ভিজিটর
              </p>
              <h3 className="text-4xl font-bold font-['Outfit'] text-blue-100">
                {todayVisits}
              </h3>
            </motion.div>

            {/* Card 3: Total Visitors */}
            <motion.div
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="bg-white/[0.02] backdrop-blur-xl p-6 rounded-3xl border border-white/[0.05] shadow-xl hover:bg-white/[0.04] transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 border border-purple-500/30">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm font-semibold font-['Hind_Siliguri'] uppercase tracking-wider mb-1">
                সর্বমোট ভিজিটর
              </p>
              <h3 className="text-4xl font-bold font-['Outfit'] text-purple-100">
                {totalVisits}
              </h3>
            </motion.div>

            {/* Card 4: Today's Requests */}
            <motion.div
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="bg-white/[0.02] backdrop-blur-xl p-6 rounded-3xl border border-white/[0.05] shadow-xl hover:bg-white/[0.04] transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/30">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm font-semibold font-['Hind_Siliguri'] uppercase tracking-wider mb-1">
                নতুন অভিভাবক রিকোয়েস্ট
              </p>
              <h3 className="text-4xl font-bold font-['Outfit'] text-emerald-100">
                {todayRequests}
              </h3>
            </motion.div>

          </div>
        </motion.div>

        {/* Optional: Grid pattern overlay */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
    </main>
  );
}
