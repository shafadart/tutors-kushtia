"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Trust Pillars Data ── */
const TRUST_PILLARS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
    color: "#10B981",
    bgGradient: "from-[#10B981]/[.12] to-[#059669]/[.06]",
    title: "১০০% ভেরিফাইড টিউটর",
    description: "প্রতিটি টিউটরের NID ও Student ID যাচাই করা হয়। কোনো ভুয়া প্রোফাইল নেই।",
    badge: "NID ✓ Student ID ✓",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
        />
      </svg>
    ),
    color: "#F59E0B",
    bgGradient: "from-[#F59E0B]/[.12] to-[#D97706]/[.06]",
    title: "কোনো অ্যাডভান্স পেমেন্ট নেই",
    description: "টিউটর পেয়ে সন্তুষ্ট হলে তারপর পেমেন্ট দিন। আগে থেকে কোনো টাকা লাগবে না।",
    badge: "Zero Upfront ✓",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
    ),
    color: "#4F46E5",
    bgGradient: "from-[#4F46E5]/[.12] to-[#6366F1]/[.06]",
    title: "কুষ্টিয়ার লোকাল সাপোর্ট",
    description: "আমরা কুষ্টিয়ার স্থানীয় টিম। যেকোনো সমস্যায় সরাসরি ফোনে পাবেন।",
    badge: "Local Team ✓",
  },
];

/* ── Single Trust Card ── */
function TrustCard({
  pillar,
  index,
}: {
  pillar: (typeof TRUST_PILLARS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative group"
    >
      <div className="h-full bg-white rounded-3xl border border-[#E5E7EB] p-8 card-hover overflow-hidden text-center">
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${pillar.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
        />

        {/* Icon container */}
        <div className="relative z-10">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${pillar.color}15`,
              color: pillar.color,
            }}
          >
            {pillar.icon}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-[#111827] mb-3 font-['Noto_Sans_Bengali']">
            {pillar.title}
          </h3>

          {/* Description */}
          <p className="text-[#6B7280] text-sm leading-relaxed mb-5 font-['Hind_Siliguri']">
            {pillar.description}
          </p>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${pillar.color}12`,
              color: pillar.color,
            }}
          >
            {pillar.badge}
          </div>
        </div>

        {/* Bottom decorative line */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-1 transition-all duration-500 rounded-b-3xl"
          style={{ backgroundColor: pillar.color }}
        />
      </div>
    </motion.div>
  );
}

/* ── Main TrustSection ── */
export default function TrustSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="trust-section" className="relative py-20 sm:py-28" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F9FAFB] to-white" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/[.1] text-[#059669] text-sm font-semibold mb-4 font-['Hind_Siliguri']">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            আমাদের প্রতিশ্রুতি
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mb-3 font-['Noto_Sans_Bengali']">
            কেন <span className="text-gradient-primary">Tutor&apos;s Kushtia?</span>
          </h2>
          <p className="text-[#6B7280] text-base sm:text-lg max-w-xl mx-auto font-['Hind_Siliguri']">
            আমরা শুধু টিউটর দেই না, আমরা বিশ্বাস দেই।
          </p>
        </motion.div>

        {/* Trust Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRUST_PILLARS.map((pillar, index) => (
            <TrustCard key={index} pillar={pillar} index={index} />
          ))}
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { number: "৫০০+", label: "ভেরিফাইড টিউটর", icon: "👨‍🏫" },
            { number: "১,০০০+", label: "সফল ম্যাচ", icon: "🤝" },
            { number: "৫০+", label: "কভার্ড এলাকা", icon: "📍" },
            { number: "৪.৮★", label: "রেটিং", icon: "⭐" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-5 bg-white rounded-2xl border border-[#E5E7EB] card-hover"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-[#111827] font-['Outfit']">
                {stat.number}
              </div>
              <div className="text-xs text-[#6B7280] font-['Hind_Siliguri'] mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
