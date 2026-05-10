"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PageHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <>
      {/* Navbar spacer */}
      <div className="h-16 sm:h-18" />

      {/* Hero Banner */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8EDFF] via-[#F8F9FC] to-[#FDF0C0]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#4F46E5]/[.08] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#F59E0B]/[.06] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4F46E5]/[.08] text-[#4F46E5] text-sm font-semibold mb-5 font-['Hind_Siliguri']"
          >
            {badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] mb-4 font-['Noto_Sans_Bengali']"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto font-['Hind_Siliguri'] leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0 30C360 0 720 60 1080 30C1260 15 1380 45 1440 30V60H0V30Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>
    </>
  );
}

/* Reusable back-to-home button */
export function BackToHome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mt-16"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-bold rounded-xl font-['Hind_Siliguri'] hover:shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        হোম পেজে ফিরে যান
      </Link>
    </motion.div>
  );
}
