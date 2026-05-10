"use client";

import { motion } from "framer-motion";

/* ── Floating decorative icons ── */
function FloatingElement({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none select-none ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 0.15, y: 0 }}
      transition={{ duration: 1.2, delay }}
      aria-hidden
    >
      <div className="animate-float-slow">{children}</div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* ── Gradient Background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E8EDFF] via-[#F8F9FC] to-[#FDF0C0]" />

      {/* ── Top-left decorative blob ── */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#4F46E5]/[.08] blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#F59E0B]/[.08] blur-3xl" />

      {/* ── Floating Educational Icons ── */}
      <FloatingElement className="top-[15%] left-[8%] text-6xl md:text-8xl" delay={0.3}>
        🎓
      </FloatingElement>
      <FloatingElement className="top-[20%] right-[10%] text-5xl md:text-7xl" delay={0.6}>
        📖
      </FloatingElement>
      <FloatingElement className="bottom-[20%] left-[15%] text-5xl md:text-6xl" delay={0.9}>
        ✏️
      </FloatingElement>
      <FloatingElement className="bottom-[25%] right-[12%] text-4xl md:text-6xl" delay={1.1}>
        🔬
      </FloatingElement>
      <FloatingElement className="top-[45%] left-[4%] text-4xl md:text-5xl" delay={0.5}>
        📐
      </FloatingElement>
      <FloatingElement className="top-[50%] right-[5%] text-4xl md:text-5xl" delay={0.8}>
        🏆
      </FloatingElement>

      {/* ── Grid Pattern Overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#E0E7FF] shadow-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-sm font-medium text-[#4F46E5] font-['Hind_Siliguri']">
            কুষ্টিয়ার #১ টিউটর প্ল্যাটফর্ম
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 font-['Noto_Sans_Bengali']"
        >
          <span className="text-[#111827]">কুষ্টিয়ায় </span>
          <span className="text-gradient-primary">বিশ্বস্ত</span>
          <br />
          <span className="text-[#111827]">হোম টিউটর </span>
          <span className="text-gradient-action">খুঁজছেন?</span>
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[17px] sm:text-xl text-[#6B7280] max-w-2xl mx-auto mb-10 font-['Hind_Siliguri'] leading-relaxed"
        >
          NID ও Student ID ভেরিফাইড টিউটর। কোনো অ্যাডভান্স পেমেন্ট নেই।
          <br className="hidden sm:block" />
          আপনার সন্তানের জন্য সেরা টিউটর মাত্র এক ক্লিকেই।
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary CTA - Tutor Needed */}
          <a
            href="#magic-form"
            id="cta-find-tutor"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-lg font-bold rounded-2xl btn-glow-action transition-all duration-300 font-['Hind_Siliguri'] hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="text-2xl">🔍</span>
            <span>টিউটর খুঁজছি</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            {/* Shimmer overlay */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 animate-shimmer" />
            </div>
          </a>

          {/* Secondary CTA - Want to Teach */}
          <a
            href="#live-board"
            id="cta-want-to-teach"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent text-[#4F46E5] text-lg font-bold rounded-2xl border-2 border-[#4F46E5]/30 hover:border-[#4F46E5] hover:bg-[#4F46E5]/5 transition-all duration-300 font-['Hind_Siliguri'] hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="text-2xl">🎓</span>
            <span>টিউশন চাই (App)</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>

        {/* Trust micro-badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-10 text-[13px] sm:text-sm text-[#6B7280] font-['Hind_Siliguri']"
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            ১০০% ভেরিফাইড
          </span>
          <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            কোনো চার্জ নেই
          </span>
          <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            দ্রুত ম্যাচিং
          </span>
        </motion.div>
      </div>

      {/* ── Bottom wave divider ── */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50C240 10 480 90 720 50C960 10 1200 90 1440 50V100H0V50Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>
    </section>
  );
}
