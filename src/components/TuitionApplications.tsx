"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  onSnapshot,
  doc,
  writeBatch,
  increment,
  Timestamp,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ── Types ── */
interface TuitionApplication {
  id: string;
  tuitionId: string;
  tutorId: string;
  appliedAt: Timestamp | null;
  status?: string; // 'pending' | 'assigned' | 'rejected'
}

interface Tutor {
  id: string;
  name: string;
  phone: string;
  gender?: string;
  university?: string;
}

interface TuitionRequest {
  id: string;
  class: string;
  subject: string;
  area: string;
  salary: string;
  status: string;
}

interface JoinedApplication extends TuitionApplication {
  tutor?: Tutor;
  tuition?: TuitionRequest;
}

/* ── Toast Notification ── */
function Toast({ message, onClose, type = "success" }: { message: string; onClose: () => void; type?: "success" | "error" }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === "success" ? "bg-[#10B981] shadow-[#10B981]/30" : "bg-red-500 shadow-red-500/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 text-white rounded-xl shadow-2xl ${bg}`}
    >
      {type === "success" ? (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className="text-sm font-semibold font-['Hind_Siliguri']">{message}</span>
    </motion.div>
  );
}

/* ── Status Badge ── */
function StatusBadge({ status }: { status?: string }) {
  if (status === "assigned") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#10B981]/10 text-[#059669] border border-[#10B981]/20 rounded-full text-xs font-semibold">
        ✅ প্রদান করা হয়েছে
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 text-red-700 border border-red-500/20 rounded-full text-xs font-semibold">
        ❌ বাতিল
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#4F46E5]/10 text-[#4338CA] border border-[#4F46E5]/20 rounded-full text-xs font-semibold">
      ⏳ অপেক্ষমান
    </span>
  );
}

export default function TuitionApplications() {
  const [applications, setApplications] = useState<TuitionApplication[]>([]);
  const [tutors, setTutors] = useState<Record<string, Tutor>>({});
  const [tuitions, setTuitions] = useState<Record<string, TuitionRequest>>({});
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [subTab, setSubTab] = useState<"pending" | "assigned">("pending");

  /* ── Listeners ── */
  useEffect(() => {
    // 1. Listen to tuition_applications
    const unsubApps = onSnapshot(collection(db, "tuition_applications"), (snapshot) => {
      const apps = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TuitionApplication));
      // Sort newest first
      apps.sort((a, b) => {
        const ta = a.appliedAt?.toMillis?.() || 0;
        const tb = b.appliedAt?.toMillis?.() || 0;
        return tb - ta;
      });
      setApplications(apps);
      setLoading(false);
    });

    // 2. Listen to tutors
    const unsubTutors = onSnapshot(collection(db, "tutors"), (snapshot) => {
      const tutorMap: Record<string, Tutor> = {};
      snapshot.forEach((d) => {
        tutorMap[d.id] = { id: d.id, ...d.data() } as Tutor;
      });
      setTutors(tutorMap);
    });

    // 3. Listen to tuition_requests (to get the job details)
    const unsubTuitions = onSnapshot(collection(db, "tuition_requests"), (snapshot) => {
      const tuitionMap: Record<string, TuitionRequest> = {};
      snapshot.forEach((d) => {
        tuitionMap[d.id] = { id: d.id, ...d.data() } as TuitionRequest;
      });
      setTuitions(tuitionMap);
    });

    return () => {
      unsubApps();
      unsubTutors();
      unsubTuitions();
    };
  }, []);

  /* ── Business Logic: Assign Tuition ── */
  const handleAssign = async (app: JoinedApplication) => {
    if (!app.tutor || !app.tuition) {
      setToast({ message: "তথ্য অসম্পূর্ণ! টিউটর বা টিউশন পাওয়া যায়নি।", type: "error" });
      return;
    }

    if (!confirm(`আপনি কি সত্যিই ${app.tutor.name} কে এই টিউশনটি প্রদান করতে চান?`)) return;

    setActionLoading(app.id);

    try {
      // 1. Calculate the 55% Success Fee
      // Example salary string: "3000 Tk", "২৫০০", "Negotiable"
      let fee = 0;
      if (app.tuition.salary) {
        // Extract digits (both English and Bengali)
        const str = app.tuition.salary.toString();
        
        // Convert Bengali digits to English digits for parsing
        const bengaliToEnglish = (bStr: string) => {
          const numbers: Record<string, string> = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
          return bStr.replace(/[০-৯]/g, (match) => numbers[match]);
        };
        
        const englishStr = bengaliToEnglish(str);
        const match = englishStr.match(/\d+/);
        
        if (match) {
          const salaryAmount = parseInt(match[0], 10);
          fee = Math.round(salaryAmount * 0.55);
        }
      }

      // If fee is 0 due to "negotiable" or missing, let's fallback to a default or 0.
      // Usually, admin can manually adjust later, but we log the 55%.

      const batch = writeBatch(db);

      // 2. Update Tutor's Document
      const tutorRef = doc(db, "tutors", app.tutorId);
      batch.update(tutorRef, {
        pendingPaymentTotal: increment(fee),
        totalTuitionsReceived: increment(1)
      });

      // 3. Update live_tuitions status so it disappears from the board
      const liveTuitionRef = doc(db, "live_tuitions", app.tuitionId);
      // Using set with merge in case it was deleted
      batch.update(liveTuitionRef, { status: "assigned" });

      // Update original tuition_requests status as well
      const tuitionReqRef = doc(db, "tuition_requests", app.tuitionId);
      batch.update(tuitionReqRef, { status: "assigned" });

      // 4. Update tuition_applications status
      const applicationRef = doc(db, "tuition_applications", app.id);
      batch.update(applicationRef, { status: "assigned" });

      // 5. Create Notification Record in Firestore
      const newNotificationRef = doc(collection(db, "notifications"));
      batch.set(newNotificationRef, {
        tutorId: app.tutorId,
        title: "🎉 অভিনন্দন!",
        body: `আপনাকে ${app.tuition.class} এর ${app.tuition.subject} টিউশনটি প্রদান করা হয়েছে।`,
        type: "direct",
        isRead: false,
        createdAt: serverTimestamp(),
      });

      // Commit all DB changes
      await batch.commit();

      // 6. Fire Push Notification to the specific Tutor
      fetch("/api/send-direct-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId: app.tutorId,
          title: "🎉 অভিনন্দন!",
          body: `আপনাকে ${app.tuition.class} এর ${app.tuition.subject} টিউশনটি প্রদান করা হয়েছে।`,
        }),
      }).catch((err) => console.error("Notification send failed:", err));

      setToast({ message: "সফলভাবে টিউশন প্রদান করা হয়েছে!", type: "success" });
    } catch (err) {
      console.error("Assignment failed:", err);
      setToast({ message: "টিউশন প্রদান করতে সমস্যা হয়েছে।", type: "error" });
    }

    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, "tuition_applications", id), { status: "rejected" });
      setToast({ message: "আবেদন বাতিল করা হয়েছে।", type: "success" });
    } catch (err) {
      console.error("Reject failed:", err);
    }
    setActionLoading(null);
  };

  /* ── Format date ── */
  const formatDate = (ts: Timestamp | null) => {
    if (!ts) return "—";
    const d = ts.toDate();
    return d.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ── Derived Data ── */
  const joined: JoinedApplication[] = applications.map((app) => ({
    ...app,
    tutor: tutors[app.tutorId],
    tuition: tuitions[app.tuitionId],
  }));

  const pendingApps = joined.filter((a) => !a.status || a.status === "pending");
  const assignedApps = joined.filter((a) => a.status === "assigned");
  const activeApps = subTab === "pending" ? pendingApps : assignedApps;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin w-8 h-8 text-[#4F46E5]" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" />
        </svg>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setSubTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer font-['Hind_Siliguri'] ${
            subTab === "pending"
              ? "bg-[#4F46E5]/10 text-[#4338CA] border border-[#4F46E5]/30"
              : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#4F46E5]/30"
          }`}
        >
          ⏳ অপেক্ষমান ({pendingApps.length})
        </button>
        <button
          onClick={() => setSubTab("assigned")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer font-['Hind_Siliguri'] ${
            subTab === "assigned"
              ? "bg-[#10B981]/10 text-[#065F46] border border-[#10B981]/30"
              : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#10B981]/30"
          }`}
        >
          ✅ প্রদানকৃত ({assignedApps.length})
        </button>
      </div>

      {activeApps.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">📭</span>
          <p className="text-lg font-bold text-[#374151] font-['Hind_Siliguri']">
            কোনো আবেদন নেই
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  {["টিউটর", "টিউশন", "স্ট্যাটাস", "আবেদনের সময়", "অ্যাকশন"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wide font-['Hind_Siliguri']">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {activeApps.map((app) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]/50 transition-colors"
                    >
                      {/* Tutor Column */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#111827] font-['Hind_Siliguri']">
                            {app.tutor?.name || "Unregistered Tutor"}
                          </span>
                          <a href={`tel:${app.tutor?.phone}`} className="text-xs font-mono text-[#4F46E5] hover:underline mt-0.5 font-semibold">
                            {app.tutor?.phone || app.tutorId}
                          </a>
                          {app.tutor?.university && (
                            <span className="text-xs text-[#6B7280] mt-0.5 truncate max-w-[150px]">
                              {app.tutor.university}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Tuition Column */}
                      <td className="px-4 py-4">
                        {app.tuition ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-[#374151] font-['Hind_Siliguri']">
                              {app.tuition.class} - {app.tuition.subject}
                            </span>
                            <span className="text-xs text-[#6B7280] mt-0.5">
                              📍 {app.tuition.area}
                            </span>
                            <span className="text-xs font-semibold text-[#10B981] mt-0.5">
                              💰 {app.tuition.salary}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-red-500 italic">টিউশন ডিলিট হয়েছে</span>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="px-4 py-4">
                        <StatusBadge status={app.status} />
                      </td>

                      {/* Date Column */}
                      <td className="px-4 py-4 text-xs text-[#9CA3AF] font-['Hind_Siliguri'] whitespace-nowrap">
                        {formatDate(app.appliedAt)}
                      </td>

                      {/* Action Column */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {subTab === "pending" && (
                            <>
                              <button
                                onClick={() => handleAssign(app)}
                                disabled={actionLoading === app.id}
                                className="px-3 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-md shadow-[#4F46E5]/20 font-['Hind_Siliguri'] whitespace-nowrap disabled:opacity-50"
                              >
                                {actionLoading === app.id ? "..." : "প্রদান করুন"}
                              </button>
                              <button
                                onClick={() => handleReject(app.id)}
                                disabled={actionLoading === app.id}
                                className="px-3 py-1.5 bg-[#F3F4F6] hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-bold rounded-lg transition-all cursor-pointer font-['Hind_Siliguri'] disabled:opacity-50"
                              >
                                বাতিল
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </>
  );
}
