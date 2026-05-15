"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ── Types ── */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface PendingTutor {
  id: string;
  [key: string]: any; // Allow any field from Firestore
  name?: string;
  email?: string;
  phone?: string;
  mobileNumber?: string;
  institution?: string;
  department?: string;
  gender?: string;
  bio?: string;
  profilePicUrl?: string;
  nidFrontPicUrl?: string;
  nidBackPicUrl?: string;
  isProfileComplete?: boolean;
  isVerified?: boolean;
}

/* ── Toast Notification ── */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 bg-[#10B981] text-white rounded-xl shadow-2xl shadow-[#10B981]/30"
    >
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      <span className="text-sm font-semibold font-['Hind_Siliguri']">{message}</span>
    </motion.div>
  );
}

export default function TutorVerification() {
  const [pendingTutors, setPendingTutors] = useState<PendingTutor[]>([]);
  const [verifiedTutors, setVerifiedTutors] = useState<PendingTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<"pending" | "verified">("pending");

  /* ── Real-time Firestore listener — fetch all, split into pending/verified ── */
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tutors"),
      (snapshot) => {
        const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as PendingTutor));
        setPendingTutors(all.filter((t) => t.isProfileComplete && !t.isVerified));
        setVerifiedTutors(all.filter((t) => t.isVerified === true));
        setLoading(false);
      },
      (error) => {
        console.error("Tutor fetch error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ── Verify Handler ── */
  const handleVerify = async (id: string, name: string) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, "tutors", id), { isVerified: true });
      setToast(`✅ ${name} সফলভাবে যাচাই করা হয়েছে!`);

      // 1. Create a direct notification document
      await addDoc(collection(db, "notifications"), {
        tutorId: id,
        title: "অভিনন্দন!",
        body: "আপনার প্রোফাইল সফলভাবে ভেরিফাই হয়েছে। এখন আপনি টিউশনগুলোতে আনলক করতে পারবেন।",
        type: "direct",
        isRead: false,
        createdAt: serverTimestamp(),
      });

      // 2. Trigger Direct FCM API
      fetch("/api/send-direct-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId: id,
          title: "অভিনন্দন!",
          body: "আপনার প্রোফাইল সফলভাবে ভেরিফাই হয়েছে।",
          data: { type: "verification_success" },
        }),
      }).catch((err) => console.error("Direct FCM send failed:", err));

    } catch (err) {
      console.error("Verify failed:", err);
      setToast("❌ যাচাই করতে সমস্যা হয়েছে।");
    }
    setActionLoading(null);
  };

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-[#4F46E5]" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" />
          </svg>
          <span className="text-sm text-[#6B7280] font-['Hind_Siliguri']">টিউটর ডেটা লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  /* ── Active list based on subTab ── */
  const activeTutors = subTab === "pending" ? pendingTutors : verifiedTutors;

  return (
    <>
      {/* ── Sub-Tab Switcher: Pending / Verified ── */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setSubTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer font-['Hind_Siliguri'] ${
            subTab === "pending"
              ? "bg-[#F59E0B]/10 text-[#92400E] border border-[#F59E0B]/30"
              : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#F59E0B]/30"
          }`}
        >
          ⏳ পেন্ডিং ({pendingTutors.length})
        </button>
        <button
          onClick={() => setSubTab("verified")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer font-['Hind_Siliguri'] ${
            subTab === "verified"
              ? "bg-[#10B981]/10 text-[#065F46] border border-[#10B981]/30"
              : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#10B981]/30"
          }`}
        >
          ✅ যাচাইকৃত ({verifiedTutors.length})
        </button>
      </div>

      {/* ── Empty State ── */}
      {activeTutors.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">{subTab === "pending" ? "🎉" : "📭"}</span>
          <p className="text-lg font-bold text-[#374151] font-['Hind_Siliguri']">
            {subTab === "pending" ? "কোনো পেন্ডিং টিউটর নেই" : "এখনো কোনো টিউটর যাচাই করা হয়নি"}
          </p>
          <p className="text-sm text-[#6B7280] font-['Hind_Siliguri'] mt-1">
            {subTab === "pending" ? "সকল টিউটর যাচাই সম্পন্ন হয়েছে।" : "পেন্ডিং ট্যাব থেকে টিউটর যাচাই করুন।"}
          </p>
        </div>
      ) : (

      /* ── Tutor Table / Cards ── */
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                {(subTab === "pending"
                  ? ["ছবি", "নাম", "ইমেইল", "ফোন", "প্রতিষ্ঠান", "ডকুমেন্ট", "অ্যাকশন"]
                  : ["ছবি", "নাম", "ইমেইল", "ফোন", "প্রতিষ্ঠান", "ডকুমেন্ট", "স্ট্যাটাস"]
                ).map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wide font-['Hind_Siliguri']">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {activeTutors.map((tutor) => (
                  <motion.tr
                    key={tutor.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]/50 transition-colors"
                  >
                    {/* Profile Pic */}
                    <td className="px-4 py-3">
                      {tutor.profilePicUrl ? (
                        <button onClick={() => setPreviewImg(tutor.profilePicUrl!)} className="cursor-pointer">
                          <img
                            src={tutor.profilePicUrl}
                            alt={tutor.name || 'Tutor'}
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#4F46E5]/20 hover:border-[#4F46E5] transition-colors"
                          />
                        </button>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-[#4F46E5]">
                            {tutor.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                    </td>
                    {/* Name */}
                    <td className="px-4 py-3 text-sm font-semibold text-[#111827] font-['Hind_Siliguri']">{tutor.name || '—'}</td>
                    {/* Email */}
                    <td className="px-4 py-3 text-sm text-[#374151]">{tutor.email || '—'}</td>
                    {/* Phone */}
                    <td className="px-4 py-3 text-sm font-mono text-[#4F46E5] font-semibold">{tutor.mobileNumber || tutor.phone || '—'}</td>
                    {/* Institution */}
                    <td className="px-4 py-3 text-sm text-[#374151] font-['Hind_Siliguri']">{tutor.institution || "—"}</td>
                    {/* Documents */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {tutor.nidFrontPicUrl && (
                          <a
                            href={tutor.nidFrontPicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#4F46E5]/5 hover:bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-semibold rounded-lg transition-colors"
                          >
                            📋 NID সামনে
                          </a>
                        )}
                        {tutor.nidBackPicUrl && (
                          <a
                            href={tutor.nidBackPicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#4F46E5]/5 hover:bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-semibold rounded-lg transition-colors"
                          >
                            📋 NID পেছনে
                          </a>
                        )}
                        {tutor.profilePicUrl && (
                          <button
                            onClick={() => setPreviewImg(tutor.profilePicUrl!)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#10B981]/5 hover:bg-[#10B981]/10 text-[#059669] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            🖼️ Photo
                          </button>
                        )}
                        {!tutor.nidFrontPicUrl && !tutor.nidBackPicUrl && !tutor.profilePicUrl && (
                          <span className="text-xs text-[#9CA3AF] font-['Hind_Siliguri']">কোনো ডকুমেন্ট নেই</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {subTab === "pending" ? (
                        <button
                          onClick={() => handleVerify(tutor.id, tutor.name || 'Tutor')}
                          disabled={actionLoading === tutor.id}
                          className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-[#4F46E5]/20 hover:shadow-lg hover:shadow-[#4F46E5]/30"
                        >
                          {actionLoading === tutor.id ? (
                            <span className="flex items-center gap-1.5">
                              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" />
                              </svg>
                              যাচাই হচ্ছে...
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 font-['Hind_Siliguri']">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              যাচাই করুন
                            </span>
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981]/10 text-[#059669] text-xs font-bold rounded-full border border-[#10B981]/20">
                          ✅ যাচাইকৃত
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="lg:hidden divide-y divide-[#F3F4F6]">
          {activeTutors.map((tutor) => (
            <div key={tutor.id} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                {tutor.profilePicUrl ? (
                  <button onClick={() => setPreviewImg(tutor.profilePicUrl!)} className="cursor-pointer shrink-0">
                    <img
                      src={tutor.profilePicUrl}
                      alt={tutor.name || 'Tutor'}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#4F46E5]/20"
                    />
                  </button>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#4F46E5]/10 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-[#4F46E5]">
                      {tutor.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#111827] font-['Hind_Siliguri'] truncate">{tutor.name || '—'}</h3>
                  <p className="text-xs text-[#6B7280] truncate">{tutor.email || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-[#6B7280] font-['Hind_Siliguri']">
                  📱 <span className="font-mono text-[#4F46E5] font-semibold">{tutor.mobileNumber || tutor.phone || '—'}</span>
                </div>
                <div className="text-[#6B7280] font-['Hind_Siliguri']">
                  🏫 {tutor.institution || "—"}
                </div>
              </div>

              {/* Document Links */}
              <div className="flex items-center gap-2">
                {tutor.nidFrontPicUrl && (
                  <a
                    href={tutor.nidFrontPicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#4F46E5]/5 text-[#4F46E5] text-xs font-semibold rounded-lg"
                  >
                    📋 NID সামনে
                  </a>
                )}
                {tutor.nidBackPicUrl && (
                  <a
                    href={tutor.nidBackPicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#4F46E5]/5 text-[#4F46E5] text-xs font-semibold rounded-lg"
                  >
                    📋 NID পেছনে
                  </a>
                )}
                {tutor.profilePicUrl && (
                  <button
                    onClick={() => setPreviewImg(tutor.profilePicUrl!)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#10B981]/5 text-[#059669] text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    🖼️ ছবি দেখুন
                  </button>
                )}
              </div>

              {/* Verify / Verified Button */}
              {subTab === "pending" ? (
                <button
                  onClick={() => handleVerify(tutor.id, tutor.name || 'Tutor')}
                  disabled={actionLoading === tutor.id}
                  className="w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-[#4F46E5]/20 font-['Hind_Siliguri']"
                >
                  {actionLoading === tutor.id ? "যাচাই হচ্ছে..." : "✅ যাচাই করুন"}
                </button>
              ) : (
                <div className="w-full py-2.5 bg-[#10B981]/10 text-[#059669] text-sm font-bold rounded-xl text-center font-['Hind_Siliguri'] border border-[#10B981]/20">
                  ✅ যাচাইকৃত
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ── Image Preview Modal ── */}
      <AnimatePresence>
        {previewImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPreviewImg(null)} />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative z-10 max-w-lg w-full"
            >
              <button
                onClick={() => setPreviewImg(null)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-red-50 transition-colors z-10"
              >
                <svg className="w-4 h-4 text-[#374151]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={previewImg}
                alt="Preview"
                className="w-full rounded-2xl shadow-2xl border border-white/10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </>
  );
}
