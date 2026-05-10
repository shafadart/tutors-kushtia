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
import Link from "next/link";

/* ── Types ── */
interface TuitionRequest {
  id: string;
  class: string;
  subject: string;
  area: string;
  tutorGender: string;
  salary: string;
  guardianPhone: string;
  guardianAddress: string;
  tutorQualification: string;
  tutorExperience: string;
  preferredTime: string;
  status: string;
  createdAt: Timestamp | null;
}

/* ── Status Badge ── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20",
    approved: "bg-[#10B981]/10 text-[#059669] border-[#10B981]/20",
    rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const labels: Record<string, string> = {
    pending: "⏳ Pending",
    approved: "✅ Approved",
    rejected: "❌ Rejected",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E5E7EB] p-5 card-hover"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#6B7280] font-['Hind_Siliguri'] mb-1">{label}</p>
          <p className="text-3xl font-extrabold font-['Outfit']" style={{ color }}>{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${color}15` }}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminPage() {
  const [requests, setRequests] = useState<TuitionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /* ── Real-time Firestore listener ── */
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tuition_requests"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as TuitionRequest[];
        // Sort client-side (newest first)
        data.sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() || 0;
          const tb = b.createdAt?.toMillis?.() || 0;
          return tb - ta;
        });
        setRequests(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ── Actions ── */
  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, "tuition_requests", id), { status: "approved" });
    } catch (err) {
      console.error("Approve failed:", err);
    }
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, "tuition_requests", id), { status: "rejected" });
    } catch (err) {
      console.error("Reject failed:", err);
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই রিকোয়েস্টটি মুছে ফেলতে চান?")) return;
    setActionLoading(id);
    try {
      await deleteDoc(doc(db, "tuition_requests", id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
    setActionLoading(null);
  };

  /* ── Stats ── */
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  /* ── Filtered list ── */
  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

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

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      {/* ── Top Navbar ── */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white text-lg font-extrabold font-['Outfit']">T</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg font-['Outfit']">Admin Dashboard</h1>
              <p className="text-white/60 text-xs font-['Hind_Siliguri']">Tutor&apos;s Kushtia</p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-lg transition-all font-['Hind_Siliguri']"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            হোম পেজ
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="মোট রিকোয়েস্ট" value={stats.total} icon="📋" color="#4F46E5" />
          <StatCard label="পেন্ডিং" value={stats.pending} icon="⏳" color="#F59E0B" />
          <StatCard label="অনুমোদিত" value={stats.approved} icon="✅" color="#10B981" />
          <StatCard label="বাতিল" value={stats.rejected} icon="❌" color="#EF4444" />
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer font-['Hind_Siliguri'] ${
                filter === f
                  ? "bg-[#4F46E5] text-white shadow-md"
                  : "bg-white text-[#6B7280] hover:bg-[#4F46E5]/5 border border-[#E5E7EB]"
              }`}
            >
              {f === "all" ? "সকল" : f === "pending" ? "⏳ পেন্ডিং" : f === "approved" ? "✅ অনুমোদিত" : "❌ বাতিল"} ({f === "all" ? stats.total : stats[f]})
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin w-8 h-8 text-[#4F46E5]" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" />
              </svg>
              <span className="text-sm text-[#6B7280] font-['Hind_Siliguri']">ডেটা লোড হচ্ছে...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">📭</span>
            <p className="text-lg font-bold text-[#374151] font-['Hind_Siliguri']">কোনো রিকোয়েস্ট নেই</p>
            <p className="text-sm text-[#6B7280] font-['Hind_Siliguri']">এই ক্যাটেগরিতে এখনো কোনো রিকোয়েস্ট আসেনি।</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    {["শ্রেণি", "বিষয়", "এলাকা", "ফোন", "বেতন", "সময়", "স্ট্যাটাস", "তারিখ", "অ্যাকশন"].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wide font-['Hind_Siliguri']">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((req) => (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-semibold text-[#111827] font-['Hind_Siliguri']">{req.class}</td>
                        <td className="px-4 py-3 text-sm text-[#374151] font-['Hind_Siliguri']">{req.subject}</td>
                        <td className="px-4 py-3 text-sm text-[#374151] font-['Hind_Siliguri']">{req.area}</td>
                        <td className="px-4 py-3 text-sm font-mono text-[#4F46E5] font-semibold">{req.guardianPhone}</td>
                        <td className="px-4 py-3 text-sm text-[#374151] font-['Hind_Siliguri']">{req.salary || "—"}</td>
                        <td className="px-4 py-3 text-sm text-[#374151]">{req.preferredTime || "—"}</td>
                        <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                        <td className="px-4 py-3 text-xs text-[#9CA3AF] font-['Hind_Siliguri']">{formatDate(req.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {req.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(req.id)}
                                  disabled={actionLoading === req.id}
                                  className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {actionLoading === req.id ? "..." : "Approve"}
                                </button>
                                <button
                                  onClick={() => handleReject(req.id)}
                                  disabled={actionLoading === req.id}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(req.id)}
                              disabled={actionLoading === req.id}
                              className="px-2 py-1.5 text-[#9CA3AF] hover:text-red-500 text-xs transition-colors cursor-pointer disabled:opacity-50"
                              title="Delete"
                            >
                              🗑️
                            </button>
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
              {filtered.map((req) => (
                <div key={req.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-[#111827] font-['Hind_Siliguri']">{req.class} — {req.subject}</h3>
                      <p className="text-sm text-[#6B7280] font-['Hind_Siliguri']">📍 {req.area}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-[#6B7280] font-['Hind_Siliguri']">📱 <span className="font-mono text-[#4F46E5] font-semibold">{req.guardianPhone}</span></div>
                    <div className="text-[#6B7280] font-['Hind_Siliguri']">💰 {req.salary || "—"}</div>
                    <div className="text-[#6B7280] font-['Hind_Siliguri']">👤 {req.tutorGender}</div>
                    <div className="text-[#6B7280] font-['Hind_Siliguri']">🕐 {req.preferredTime || "—"}</div>
                  </div>
                  {req.guardianAddress && (
                    <p className="text-xs text-[#9CA3AF] font-['Hind_Siliguri']">🏠 {req.guardianAddress}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9CA3AF] font-['Hind_Siliguri']">{formatDate(req.createdAt)}</span>
                    <div className="flex items-center gap-2">
                      {req.status === "pending" && (
                        <>
                          <button onClick={() => handleApprove(req.id)} disabled={actionLoading === req.id} className="px-3 py-1.5 bg-[#10B981] text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-50">
                            Approve
                          </button>
                          <button onClick={() => handleReject(req.id)} disabled={actionLoading === req.id} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-50">
                            Reject
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(req.id)} className="text-[#9CA3AF] hover:text-red-500 cursor-pointer">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
