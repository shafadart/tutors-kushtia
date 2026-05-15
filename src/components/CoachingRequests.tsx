"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ── Types ── */
interface CoachingRequest {
  id: string;
  coachingName?: string;
  contactPerson?: string;
  phoneNumber?: string;
  address?: string;
  requirements?: string;
  details?: string;
  status: string; // 'pending' | 'contacted'
  createdAt: Timestamp | null;
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
function StatusBadge({ status }: { status: string }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F59E0B]/10 text-[#D97706] border border-[#F59E0B]/20 rounded-full text-xs font-semibold">
        ⏳ পেন্ডিং
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#10B981]/10 text-[#059669] border border-[#10B981]/20 rounded-full text-xs font-semibold">
      ✅ যোগাযোগ করা হয়েছে
    </span>
  );
}

export default function CoachingRequests() {
  const [requests, setRequests] = useState<CoachingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [subTab, setSubTab] = useState<"pending" | "contacted">("pending");

  /* ── Real-time Firestore listener ── */
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "coaching_requests"),
      (snapshot) => {
        const all = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            coachingName: data.centerName || data.coachingName,
            contactPerson: data.contactName || data.contactPerson,
            phoneNumber: data.phone || data.phoneNumber,
            address: data.address,
            requirements: data.expertise || data.requirements,
            details: data.details,
            status: data.status,
            createdAt: data.createdAt,
          } as CoachingRequest;
        });
        // Sort client-side (newest first)
        all.sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() || 0;
          const tb = b.createdAt?.toMillis?.() || 0;
          return tb - ta;
        });
        setRequests(all);
        setLoading(false);
      },
      (error) => {
        console.error("Coaching requests fetch error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ── Actions ── */
  const handleMarkContacted = async (id: string) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, "coaching_requests", id), { status: "contacted" });
      setToast({ message: "স্ট্যাটাস সফলভাবে আপডেট হয়েছে!", type: "success" });
    } catch (err) {
      console.error("Update failed:", err);
      setToast({ message: "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।", type: "error" });
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই রিকোয়েস্টটি মুছে ফেলতে চান?")) return;
    setActionLoading(id);
    try {
      await deleteDoc(doc(db, "coaching_requests", id));
      setToast({ message: "রিকোয়েস্টটি মুছে ফেলা হয়েছে।", type: "success" });
    } catch (err) {
      console.error("Delete failed:", err);
      setToast({ message: "মুছে ফেলতে সমস্যা হয়েছে।", type: "error" });
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
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ── Derived Data ── */
  const pendingRequests = requests.filter((r) => r.status === "pending" || !r.status);
  const contactedRequests = requests.filter((r) => r.status === "contacted");
  const activeRequests = subTab === "pending" ? pendingRequests : contactedRequests;

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-[#4F46E5]" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" />
          </svg>
          <span className="text-sm text-[#6B7280] font-['Hind_Siliguri']">ডেটা লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Sub-Tab Switcher ── */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setSubTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer font-['Hind_Siliguri'] ${
            subTab === "pending"
              ? "bg-[#F59E0B]/10 text-[#92400E] border border-[#F59E0B]/30"
              : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#F59E0B]/30"
          }`}
        >
          ⏳ পেন্ডিং ({pendingRequests.length})
        </button>
        <button
          onClick={() => setSubTab("contacted")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer font-['Hind_Siliguri'] ${
            subTab === "contacted"
              ? "bg-[#10B981]/10 text-[#065F46] border border-[#10B981]/30"
              : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#10B981]/30"
          }`}
        >
          ✅ যোগাযোগ সম্পন্ন ({contactedRequests.length})
        </button>
      </div>

      {/* ── Empty State ── */}
      {activeRequests.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">{subTab === "pending" ? "🎉" : "📭"}</span>
          <p className="text-lg font-bold text-[#374151] font-['Hind_Siliguri']">
            {subTab === "pending" ? "কোনো পেন্ডিং রিকোয়েস্ট নেই" : "এখনো কোনো কোচিংয়ের সাথে যোগাযোগ করা হয়নি"}
          </p>
          <p className="text-sm text-[#6B7280] font-['Hind_Siliguri'] mt-1">
            {subTab === "pending" ? "সবগুলো কোচিংয়ের সাথে যোগাযোগ করা হয়েছে।" : "পেন্ডিং ট্যাব থেকে রিকোয়েস্ট চেক করুন।"}
          </p>
        </div>
      ) : (

      /* ── Table / Cards ── */
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                {["কোচিংয়ের নাম", "যোগাযোগের ব্যক্তি", "ফোন", "ঠিকানা", "রিকোয়ারমেন্ট", "বিস্তারিত", "তারিখ", "অ্যাকশন"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wide font-['Hind_Siliguri'] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {activeRequests.map((req) => (
                  <motion.tr
                    key={req.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm font-bold text-[#111827] font-['Hind_Siliguri']">{req.coachingName || '—'}</td>
                    <td className="px-4 py-4 text-sm text-[#374151] font-['Hind_Siliguri']">{req.contactPerson || '—'}</td>
                    <td className="px-4 py-4 text-sm font-mono text-[#4F46E5] font-semibold">
                      <a href={`tel:${req.phoneNumber}`} className="hover:underline">{req.phoneNumber || '—'}</a>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#6B7280] font-['Hind_Siliguri'] max-w-[150px] truncate" title={req.address}>{req.address || '—'}</td>
                    <td className="px-4 py-4 text-sm text-[#374151] font-['Hind_Siliguri']">
                      <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        {req.requirements || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#6B7280] font-['Hind_Siliguri'] max-w-[200px] truncate" title={req.details}>{req.details || '—'}</td>
                    <td className="px-4 py-4 text-xs text-[#9CA3AF] font-['Hind_Siliguri'] whitespace-nowrap">{formatDate(req.createdAt)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {subTab === "pending" && (
                          <button
                            onClick={() => handleMarkContacted(req.id)}
                            disabled={actionLoading === req.id}
                            className="px-3 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-md shadow-[#4F46E5]/20 font-['Hind_Siliguri'] flex items-center gap-1.5"
                          >
                            {actionLoading === req.id ? "আপডেট হচ্ছে..." : (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                যোগাযোগ হয়েছে
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(req.id)}
                          disabled={actionLoading === req.id}
                          className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-[#F3F4F6]">
          {activeRequests.map((req) => (
            <div key={req.id} className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#111827] text-lg font-['Hind_Siliguri']">{req.coachingName || '—'}</h3>
                  <p className="text-sm text-[#4F46E5] font-bold font-['Hind_Siliguri'] mt-0.5">{req.contactPerson || '—'}</p>
                </div>
                <StatusBadge status={req.status || "pending"} />
              </div>

              <div className="bg-[#F9FAFB] p-3 rounded-xl space-y-2 border border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <span className="text-[#9CA3AF]">📞</span>
                  <a href={`tel:${req.phoneNumber}`} className="text-sm font-mono text-[#4F46E5] font-semibold">{req.phoneNumber || '—'}</a>
                </div>
                {req.address && (
                  <div className="flex items-start gap-2">
                    <span className="text-[#9CA3AF] mt-0.5">📍</span>
                    <p className="text-sm text-[#6B7280] font-['Hind_Siliguri']">{req.address}</p>
                  </div>
                )}
              </div>

              {(req.requirements || req.details) && (
                <div className="space-y-1.5">
                  {req.requirements && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-[#374151] mt-0.5 w-16 shrink-0">চাহিদা:</span>
                      <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {req.requirements}
                      </span>
                    </div>
                  )}
                  {req.details && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-[#374151] mt-0.5 w-16 shrink-0">বিস্তারিত:</span>
                      <p className="text-sm text-[#6B7280] font-['Hind_Siliguri']">{req.details}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF] font-['Hind_Siliguri']">{formatDate(req.createdAt)}</span>
                <div className="flex items-center gap-2">
                  {subTab === "pending" && (
                    <button
                      onClick={() => handleMarkContacted(req.id)}
                      disabled={actionLoading === req.id}
                      className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-[#4F46E5]/20 font-['Hind_Siliguri']"
                    >
                      {actionLoading === req.id ? "..." : "যোগাযোগ হয়েছে"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(req.id)}
                    disabled={actionLoading === req.id}
                    className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-red-500 bg-[#F9FAFB] hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </>
  );
}
