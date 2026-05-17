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
  addDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TutorVerification from "@/components/TutorVerification";
import CoachingRequests from "@/components/CoachingRequests";
import TuitionApplications from "@/components/TuitionApplications";
import PaymentRequests from "@/components/PaymentRequests";


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
  days?: string;
  studentGender?: string;
  curriculum?: string;
  studentCount?: string;
  details?: string;
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
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<TuitionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"requests" | "verify" | "coaching" | "applications" | "payments">("requests");

  /* ── Auth Guard: redirect to login if not authenticated ── */
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/admin/login");
    }
  }, [authLoading, user, router]);

  /* ── Real-time Firestore listener ── */
  useEffect(() => {
    if (!user) return; // Don't subscribe if not logged in
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
  }, [user]);

  /* ── Logout handler ── */
  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/admin/login");
  };

  /* ── Show loading spinner during auth check ── */
  if (authLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#312E81] via-[#4F46E5] to-[#6366F1]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10 text-white/80" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" />
          </svg>
          <span className="text-sm text-white/50 font-['Hind_Siliguri']">অনুগ্রহ করে অপেক্ষা করুন...</span>
        </div>
      </main>
    );
  }


  /* ── Actions ── */
  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, "tuition_requests", id), { status: "approved" });

      const approvedReq = requests.find((r) => r.id === id);
      if (approvedReq) {
        // 1. Sanitize the document: omit contact info (guardianPhone, email, guardianAddress)
        // Only saving safe fields to live_tuitions
        await setDoc(doc(db, "live_tuitions", id), {
          requestId: id,
          class: approvedReq.class || "",
          subject: approvedReq.subject || "",
          area: approvedReq.area || "",
          salary: approvedReq.salary || "",
          days: approvedReq.days || "",
          studentGender: approvedReq.studentGender || "",
          tutorGender: approvedReq.tutorGender || "",
          curriculum: approvedReq.curriculum || "",
          studentCount: approvedReq.studentCount || "",
          preferredTime: approvedReq.preferredTime || "",
          details: approvedReq.details || "",
          createdAt: approvedReq.createdAt || serverTimestamp(),
          status: "live"
        });

        // 2. Create a document in global 'notifications' collection
        await addDoc(collection(db, "notifications"), {
          tutorId: "all",
          title: "🚀 নতুন টিউশন অ্যালার্ট!",
          body: `${approvedReq.class} — ${approvedReq.subject} (${approvedReq.area}) এ একটি নতুন টিউশন পোস্ট হয়েছে।`,
          type: "broadcast",
          isRead: false,
          createdAt: serverTimestamp(),
        });

        // 3. Trigger FCM API
        fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tuitionId: id,
            className: approvedReq.class,
            subject: approvedReq.subject,
            area: approvedReq.area,
          }),
        }).catch((err) => console.error("Notification send failed:", err));
      }
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
          <div className="flex items-center gap-2">
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/40 text-white text-sm font-semibold rounded-lg transition-all font-['Hind_Siliguri'] border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              CCTV Analytics
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-lg transition-all font-['Hind_Siliguri']"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              হোম পেজ
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Primary Tab Switcher ── */}
        <div className="flex items-center gap-1 mb-8 bg-white rounded-xl p-1.5 border border-[#E5E7EB] shadow-sm w-fit overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap font-['Hind_Siliguri'] ${
              activeTab === "requests"
                ? "bg-[#4F46E5] text-white shadow-md shadow-[#4F46E5]/25"
                : "text-[#6B7280] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
            টিউশন রিকোয়েস্ট
          </button>
          <button
            onClick={() => setActiveTab("verify")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap font-['Hind_Siliguri'] ${
              activeTab === "verify"
                ? "bg-[#4F46E5] text-white shadow-md shadow-[#4F46E5]/25"
                : "text-[#6B7280] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
            টিউটর যাচাইকরণ
          </button>
          <button
            onClick={() => setActiveTab("coaching")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap font-['Hind_Siliguri'] ${
              activeTab === "coaching"
                ? "bg-[#4F46E5] text-white shadow-md shadow-[#4F46E5]/25"
                : "text-[#6B7280] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
            কোচিং রিকোয়েস্ট
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap font-['Hind_Siliguri'] ${
              activeTab === "applications"
                ? "bg-[#4F46E5] text-white shadow-md shadow-[#4F46E5]/25"
                : "text-[#6B7280] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.225-.564.481-1.15.481M12 3v1m0 16v-1m9-9l-9 9m0 0l-9-9" />
            </svg>
            আবেদনসমূহ
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap font-['Hind_Siliguri'] ${
              activeTab === "payments"
                ? "bg-[#4F46E5] text-white shadow-md shadow-[#4F46E5]/25"
                : "text-[#6B7280] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            পেমেন্ট
          </button>
        </div>

        {/* ── Tab: Tuition Requests ── */}
        {activeTab === "requests" && (
          <>
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
          </>
        )}

        {/* ── Tab: Tutor Verification ── */}
        {activeTab === "verify" && <TutorVerification />}

        {/* ── Tab: Coaching Requests ── */}
        {activeTab === "coaching" && <CoachingRequests />}

        {/* ── Tab: Tuition Applications ── */}
        {activeTab === "applications" && <TuitionApplications />}

        {/* ── Tab: Payment Requests ── */}
        {activeTab === "payments" && <PaymentRequests />}
      </div>
    </main>
  );
}
