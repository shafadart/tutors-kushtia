"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ── Types ── */
interface PaymentRequest {
  id: string;
  tutorId: string;
  tutorName: string;
  amount: number;
  trxId: string;
  status: string; // 'pending' | 'approved' | 'rejected'
  createdAt: Timestamp | null;
}

/* ── Toast ── */
function Toast({
  message,
  onClose,
  type = "success",
}: {
  message: string;
  onClose: () => void;
  type?: "success" | "error";
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg =
    type === "success"
      ? "bg-[#10B981] shadow-[#10B981]/30"
      : "bg-red-500 shadow-red-500/30";

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
  const styles: Record<string, string> = {
    pending: "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20",
    approved: "bg-[#10B981]/10 text-[#059669] border-[#10B981]/20",
    rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const labels: Record<string, string> = {
    pending: "⏳ অপেক্ষমান",
    approved: "✅ ভেরিফাইড",
    rejected: "❌ বাতিল",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}
    >
      {labels[status] || status}
    </span>
  );
}

/* ── Main Component ── */
export default function PaymentRequests() {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [subTab, setSubTab] = useState<"pending" | "approved">("pending");

  /* ── Real-time Listener ── */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "payment_requests"), (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as PaymentRequest[];
      // Sort newest first
      data.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() || 0;
        const tb = b.createdAt?.toMillis?.() || 0;
        return tb - ta;
      });
      setPayments(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* ── Format Date ── */
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

  /* ── Approve Payment ── */
  const handleApprove = async (payment: PaymentRequest) => {
    if (!confirm(`TrxID: ${payment.trxId}\n\nএই পেমেন্ট ভেরিফাই করতে চান?`)) return;

    setActionLoading(payment.id);
    try {
      // 1. Update payment_requests → approved
      await updateDoc(doc(db, "payment_requests", payment.id), {
        status: "approved",
        verifiedAt: serverTimestamp(),
      });

      // 2. Reset tutor's pendingPaymentTotal to 0
      await updateDoc(doc(db, "tutors", payment.tutorId), {
        pendingPaymentTotal: 0,
      });

      // 3. Create Firestore notification for the tutor
      await addDoc(collection(db, "notifications"), {
        tutorId: payment.tutorId,
        title: "✅ পেমেন্ট ভেরিফাইড!",
        body: "অভিনন্দন! আপনার পেমেন্ট সফলভাবে ভেরিফাই হয়েছে।",
        type: "direct",
        isRead: false,
        createdAt: serverTimestamp(),
      });

      // 4. Send FCM Push Notification via existing API
      fetch("/api/send-direct-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId: payment.tutorId,
          title: "✅ পেমেন্ট ভেরিফাইড!",
          body: "অভিনন্দন! আপনার পেমেন্ট সফলভাবে ভেরিফাই হয়েছে।",
          data: { type: "payment_verified" },
        }),
      }).catch((err) => console.error("FCM send failed:", err));

      setToast({ message: "পেমেন্ট সফলভাবে ভেরিফাই করা হয়েছে!", type: "success" });
    } catch (err) {
      console.error("Approve failed:", err);
      setToast({ message: "ভেরিফাই করতে সমস্যা হয়েছে।", type: "error" });
    }
    setActionLoading(null);
  };

  /* ── Reject Payment ── */
  const handleReject = async (payment: PaymentRequest) => {
    if (!confirm("এই পেমেন্ট রিকোয়েস্ট বাতিল করতে চান?")) return;

    setActionLoading(payment.id);
    try {
      await updateDoc(doc(db, "payment_requests", payment.id), {
        status: "rejected",
        rejectedAt: serverTimestamp(),
      });

      // Notify tutor that payment was rejected
      fetch("/api/send-direct-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId: payment.tutorId,
          title: "❌ পেমেন্ট যাচাই ব্যর্থ",
          body: "আপনার পেমেন্ট যাচাই করা যায়নি। সঠিক TrxID দিয়ে আবার চেষ্টা করুন।",
          data: { type: "payment_rejected" },
        }),
      }).catch((err) => console.error("FCM send failed:", err));

      setToast({ message: "পেমেন্ট বাতিল করা হয়েছে।", type: "success" });
    } catch (err) {
      console.error("Reject failed:", err);
      setToast({ message: "বাতিল করতে সমস্যা হয়েছে।", type: "error" });
    }
    setActionLoading(null);
  };

  /* ── Derived Lists ── */
  const pendingPayments = payments.filter((p) => p.status === "pending");
  const approvedPayments = payments.filter((p) => p.status === "approved" || p.status === "rejected");
  const activeList = subTab === "pending" ? pendingPayments : approvedPayments;

  /* ── Stats ── */
  const totalPending = pendingPayments.reduce((s, p) => s + (p.amount || 0), 0);

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
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] font-['Hind_Siliguri'] mb-1">মোট পেন্ডিং</p>
              <p className="text-3xl font-extrabold font-['Outfit'] text-[#F59E0B]">{pendingPayments.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-[#F59E0B]/10">⏳</div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] font-['Hind_Siliguri'] mb-1">পেন্ডিং পরিমাণ</p>
              <p className="text-2xl font-extrabold font-['Outfit'] text-[#4F46E5]">৳{totalPending.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-[#4F46E5]/10">💰</div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] font-['Hind_Siliguri'] mb-1">সর্বমোট ভেরিফাইড</p>
              <p className="text-3xl font-extrabold font-['Outfit'] text-[#10B981]">{payments.filter((p) => p.status === "approved").length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-[#10B981]/10">✅</div>
          </div>
        </motion.div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setSubTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer font-['Hind_Siliguri'] ${
            subTab === "pending"
              ? "bg-[#F59E0B]/10 text-[#D97706] border border-[#F59E0B]/30"
              : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#F59E0B]/30"
          }`}
        >
          ⏳ অপেক্ষমান ({pendingPayments.length})
        </button>
        <button
          onClick={() => setSubTab("approved")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer font-['Hind_Siliguri'] ${
            subTab === "approved"
              ? "bg-[#10B981]/10 text-[#065F46] border border-[#10B981]/30"
              : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#10B981]/30"
          }`}
        >
          ✅ সম্পন্ন ({approvedPayments.length})
        </button>
      </div>

      {/* Table / Empty */}
      {activeList.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">📭</span>
          <p className="text-lg font-bold text-[#374151] font-['Hind_Siliguri']">কোনো পেমেন্ট রিকোয়েস্ট নেই</p>
          <p className="text-sm text-[#6B7280] font-['Hind_Siliguri']">এই ক্যাটেগরিতে এখনো কোনো পেমেন্ট আসেনি।</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  {["টিউটর", "পরিমাণ", "TrxID", "স্ট্যাটাস", "তারিখ", "অ্যাকশন"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wide font-['Hind_Siliguri']">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {activeList.map((p) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-[#111827] font-['Hind_Siliguri']">{p.tutorName || "Unknown"}</span>
                        <br />
                        <span className="text-xs font-mono text-[#9CA3AF]">{p.tutorId.substring(0, 12)}...</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-[#4F46E5] font-['Outfit']">৳{p.amount?.toLocaleString() || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F3F4F6] rounded-lg text-sm font-mono font-bold text-[#374151]">
                          🧾 {p.trxId}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 text-xs text-[#9CA3AF] font-['Hind_Siliguri']">{formatDate(p.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {p.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(p)}
                                disabled={actionLoading === p.id}
                                className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 font-['Hind_Siliguri']"
                              >
                                {actionLoading === p.id ? "..." : "✅ Verify & Approve"}
                              </button>
                              <button
                                onClick={() => handleReject(p)}
                                disabled={actionLoading === p.id}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Reject
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

          {/* Mobile cards */}
          <div className="lg:hidden divide-y divide-[#F3F4F6]">
            {activeList.map((p) => (
              <div key={p.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-[#111827] font-['Hind_Siliguri']">{p.tutorName || "Unknown"}</h3>
                    <p className="text-xs font-mono text-[#9CA3AF] mt-0.5">{p.tutorId.substring(0, 16)}...</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-[#6B7280] font-['Hind_Siliguri']">💰 <span className="font-bold text-[#4F46E5] font-['Outfit']">৳{p.amount?.toLocaleString()}</span></div>
                  <div className="text-[#6B7280] font-['Hind_Siliguri']">🧾 <span className="font-mono font-semibold">{p.trxId}</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9CA3AF] font-['Hind_Siliguri']">{formatDate(p.createdAt)}</span>
                  {p.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleApprove(p)} disabled={actionLoading === p.id} className="px-3 py-1.5 bg-[#10B981] text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-50 font-['Hind_Siliguri']">
                        ✅ Approve
                      </button>
                      <button onClick={() => handleReject(p)} disabled={actionLoading === p.id} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-50">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </>
  );
}
