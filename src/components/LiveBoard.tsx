"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ── Types ── */
interface ApprovedPost {
  id: string;
  class: string;
  subject: string;
  area: string;
  salary: string;
  guardianPhone: string;
  tutorGender: string;
  status?: string;
  createdAt: Timestamp | null;
}

/* ── Time ago helper ── */
function timeAgo(ts: Timestamp | null): string {
  if (!ts) return "";
  const now = Date.now();
  const diff = now - ts.toDate().getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return "এইমাত্র";
  if (hours < 24) return `${hours} ঘণ্টা আগে`;
  if (days === 1) return "১ দিন আগে";
  return `${days} দিন আগে`;
}

/* ── Single Tuition Card ── */
function TuitionCard({
  post,
  index,
}: {
  post: ApprovedPost;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl border border-[#E5E7EB] p-5 card-hover overflow-hidden"
    >
      {/* Verified Badge */}
      <div className="absolute top-4 right-4">
        <div className="badge-pulse flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/[.1] text-[#059669] text-xs font-semibold font-['Hind_Siliguri']">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Verified
        </div>
      </div>

      {/* Top section: Class & Subject */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5]/[.1] to-[#6366F1]/[.1] flex items-center justify-center">
            <span className="text-lg">📚</span>
          </div>
          <div>
            <h3 className="font-bold text-[#111827] font-['Hind_Siliguri'] text-base leading-tight">
              {post.class}
            </h3>
            <p className="text-sm text-[#6B7280] font-['Hind_Siliguri']">
              {post.subject}
            </p>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-[#374151] font-['Hind_Siliguri']">
          <span className="text-base">📍</span>
          <span className="font-medium">{post.area}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#374151] font-['Hind_Siliguri']">
          <span className="text-base">💰</span>
          <span className="font-semibold text-[#4F46E5]">{post.salary || "আলোচনা সাপেক্ষ"}/মাস</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#374151] font-['Hind_Siliguri']">
          <span className="text-base">👤</span>
          <span>{post.tutorGender === "male" ? "পুরুষ" : post.tutorGender === "female" ? "মহিলা" : "যেকোনো"} টিউটর</span>
        </div>
      </div>

      {/* Blurred Phone + Animated Hover Overlay */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
          <span className="text-base">📞</span>
          <span className="text-sm text-[#374151] font-mono blur-[5px] select-none">
            {post.guardianPhone}
          </span>
          <span className="ml-auto">
            <svg className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

        {/* Framer Motion hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center rounded-xl cursor-pointer"
          style={{
            background: "linear-gradient(135deg, rgba(79,70,229,0.92) 0%, rgba(99,102,241,0.88) 50%, rgba(245,158,11,0.85) 100%)",
          }}
        >
          <motion.div
            initial={{ y: 6, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex flex-col items-center gap-1 px-3"
          >
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-white/90" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-xs font-bold font-['Hind_Siliguri'] leading-tight text-center">
                বিস্তারিত দেখতে এবং কন্টাক্ট নাম্বার পেতে আমাদের App ডাউনলোড করুন।
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Time ago */}
      <div className="mt-3 text-right">
        <span className="text-xs text-[#9CA3AF] font-['Hind_Siliguri']">
          🕐 {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* Hover gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#F59E0B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}

/* ── Skeleton Card ── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#E5E7EB]" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-[#E5E7EB] rounded w-24" />
          <div className="h-3 bg-[#F3F4F6] rounded w-32" />
        </div>
      </div>
      <div className="space-y-2.5 mb-4">
        <div className="h-3 bg-[#F3F4F6] rounded w-20" />
        <div className="h-3 bg-[#F3F4F6] rounded w-28" />
        <div className="h-3 bg-[#F3F4F6] rounded w-24" />
      </div>
      <div className="h-10 bg-[#F3F4F6] rounded-xl" />
    </div>
  );
}

/* ── Main LiveBoard ── */
export default function LiveBoard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [posts, setPosts] = useState<ApprovedPost[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch only approved posts from Firestore ── */
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tuition_requests"),
      (snapshot) => {
        const data = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() } as ApprovedPost))
          .filter((d) => d.status === "approved")
          .sort((a, b) => {
            const ta = a.createdAt?.toMillis?.() || 0;
            const tb = b.createdAt?.toMillis?.() || 0;
            return tb - ta;
          });
        setPosts(data);
        setLoading(false);
      },
      (error) => {
        console.error("LiveBoard Firestore error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section id="live-board" className="relative py-20 sm:py-28" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F9FAFB] via-[#EEF2FF]/30 to-[#F9FAFB]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F59E0B]/[.1] text-[#D97706] text-sm font-semibold mb-4 font-['Hind_Siliguri']">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            লাইভ টিউশন বোর্ড
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mb-3 font-['Noto_Sans_Bengali']">
            সাম্প্রতিক <span className="text-gradient-action">টিউশন পোস্ট</span>
          </h2>
          <p className="text-[#6B7280] text-base sm:text-lg max-w-xl mx-auto font-['Hind_Siliguri']">
            প্রতিদিন নতুন টিউশনের সুযোগ। অ্যাপ ডাউনলোড করে আনলক করুন ও আবেদন করুন।
          </p>
        </motion.div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">📭</span>
            <p className="text-lg font-bold text-[#374151] font-['Hind_Siliguri']">এই মুহূর্তে কোনো অনুমোদিত পোস্ট নেই</p>
            <p className="text-sm text-[#6B7280] font-['Hind_Siliguri'] mt-1">শীঘ্রই নতুন টিউশন পোস্ট যোগ হবে।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, index) => (
              <TuitionCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}

        {/* CTA to download app */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-6 glass-card rounded-2xl">
            <div className="text-4xl">📱</div>
            <div className="text-center sm:text-left">
              <p className="font-bold text-[#111827] font-['Hind_Siliguri'] text-lg">
                সব টিউশন দেখতে ও আবেদন করতে
              </p>
              <p className="text-sm text-[#6B7280] font-['Hind_Siliguri']">
                Tutor&apos;s Kushtia অ্যাপ ডাউনলোড করুন — ফ্রি!
              </p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-bold rounded-xl font-['Hind_Siliguri'] hover:shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer">
              ডাউনলোড করুন
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
