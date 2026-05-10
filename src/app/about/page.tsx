"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { BackToHome } from "@/components/PageHeader";

const TEAM_VALUES = [
  {
    icon: "🛡️",
    color: "#10B981",
    title: "বিশ্বাসযোগ্যতা",
    description: "প্রতিটি টিউটরকে NID এবং Student ID দিয়ে যাচাই করা হয়। আমরা কোনো অযাচিত প্রোফাইল গ্রহণ করি না।",
  },
  {
    icon: "⚡",
    color: "#F59E0B",
    title: "দ্রুততা",
    description: "আপনার রিকোয়েস্ট পাওয়ার ১-৩ ঘণ্টার মধ্যে আমাদের টিম আপনার সাথে যোগাযোগ করে টিউটর নিশ্চিত করে।",
  },
  {
    icon: "💰",
    color: "#4F46E5",
    title: "স্বচ্ছতা",
    description: "কোনো লুকানো চার্জ নেই। কোনো অ্যাডভান্স পেমেন্ট নেই। সব কিছু পরিষ্কার এবং সৎ।",
  },
  {
    icon: "📍",
    color: "#EC4899",
    title: "লোকাল ফোকাস",
    description: "আমরা শুধু কুষ্টিয়ার জন্য কাজ করি। তাই আমরা এখানকার প্রতিটি এলাকা, প্রতিটি প্রয়োজন বুঝি।",
  },
];

const MILESTONES = [
  { year: "২০২৬", event: "Tutor's Kushtia এর যাত্রা শুরু", icon: "🚀" },
  { year: "২০২৬", event: "প্রথম ১০০ জন ভেরিফাইড টিউটর", icon: "🎯" },
  { year: "২০২৬", event: "৫০০+ সফল টিউটর-ছাত্র ম্যাচ", icon: "🤝" },
  { year: "২০২৬", event: "মোবাইল অ্যাপ লঞ্চ", icon: "📱" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <PageHeader
        badge="ℹ️ আমাদের সম্পর্কে"
        title="আমাদের গল্প"
        subtitle="কুষ্টিয়ার অভিভাবক ও শিক্ষার্থীদের জন্য একটি বিশ্বস্ত টিউটর ম্যাচিং প্ল্যাটফর্ম গড়ে তোলার স্বপ্ন থেকে Tutor's Kushtia এর জন্ম।"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 card-hover">
            <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-xl font-bold text-[#111827] mb-3 font-['Noto_Sans_Bengali']">আমাদের মিশন</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed font-['Hind_Siliguri']">
              কুষ্টিয়ার প্রতিটি পরিবারের কাছে ভেরিফাইড, বিশ্বস্ত এবং মানসম্মত হোম টিউটর পৌঁছে দেওয়া — কোনো ঝামেলা ছাড়া, কোনো প্রতারণা ছাড়া। আমরা বিশ্বাস করি প্রতিটি শিশু মানসম্মত শিক্ষা পাওয়ার অধিকার রাখে।
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 card-hover">
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🔭</span>
            </div>
            <h2 className="text-xl font-bold text-[#111827] mb-3 font-['Noto_Sans_Bengali']">আমাদের ভিশন</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed font-['Hind_Siliguri']">
              কুষ্টিয়াকে বাংলাদেশের সবচেয়ে সুসংগঠিত টিউটরিং ইকোসিস্টেম হিসেবে গড়ে তোলা। যেখানে প্রতিটি টিউটর ভেরিফাইড, প্রতিটি অভিভাবক নিশ্চিন্ত, এবং প্রতিটি ছাত্র-ছাত্রীর শিক্ষার মান উন্নত।
            </p>
          </div>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-['Noto_Sans_Bengali']">
            আমাদের <span className="text-gradient-primary">মূল্যবোধ</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {TEAM_VALUES.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-6 card-hover"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${val.color}15` }}
                >
                  <span className="text-xl">{val.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] mb-1.5 font-['Noto_Sans_Bengali']">{val.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed font-['Hind_Siliguri']">{val.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-['Noto_Sans_Bengali']">
            আমাদের <span className="text-gradient-action">যাত্রা</span>
          </h2>
        </motion.div>

        <div className="relative max-w-xl mx-auto mb-8">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4F46E5] via-[#6366F1] to-[#F59E0B]" />

          {MILESTONES.map((ms, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex items-center gap-5 mb-8 last:mb-0"
            >
              <div className="w-12 h-12 rounded-full bg-white border-2 border-[#4F46E5] flex items-center justify-center shadow-md z-10">
                <span className="text-lg">{ms.icon}</span>
              </div>
              <div className="flex-1 bg-white rounded-xl border border-[#E5E7EB] p-4 card-hover">
                <span className="text-xs font-bold text-[#4F46E5] font-['Outfit']">{ms.year}</span>
                <p className="text-sm font-semibold text-[#111827] font-['Hind_Siliguri'] mt-0.5">{ms.event}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <BackToHome />
      </div>

      <Footer />
    </main>
  );
}
