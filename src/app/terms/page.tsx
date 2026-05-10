"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { BackToHome } from "@/components/PageHeader";

const TERMS_SECTIONS = [
  {
    number: "০১",
    title: "সেবা পরিচিতি",
    points: [
      "Tutor's Kushtia একটি হোম টিউটর ম্যাচিং প্ল্যাটফর্ম। আমরা অভিভাবক এবং টিউটরদের মধ্যে সংযোগ স্থাপনে সাহায্য করি।",
      "আমরা সরাসরি টিউশন পরিষেবা প্রদান করি না। আমরা একটি মধ্যস্থতাকারী প্ল্যাটফর্ম হিসেবে কাজ করি।",
      "আমাদের সেবা বর্তমানে শুধুমাত্র কুষ্টিয়া জেলায় সীমাবদ্ধ।",
    ],
  },
  {
    number: "০২",
    title: "অভিভাবকদের জন্য শর্তাবলী",
    points: [
      "ফর্ম পূরণের সময় সঠিক তথ্য প্রদান করতে হবে।",
      "টিউটর নিয়োগের আগে কোনো অ্যাডভান্স পেমেন্ট প্রয়োজন নেই।",
      "টিউটরের সাথে সরাসরি বেতন নির্ধারণ করতে হবে।",
      "যেকোনো সমস্যায় আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।",
    ],
  },
  {
    number: "০৩",
    title: "টিউটরদের জন্য শর্তাবলী",
    points: [
      "টিউটর হিসেবে নিবন্ধনের জন্য বৈধ NID এবং Student ID প্রয়োজন।",
      "ভুল বা মিথ্যা তথ্য প্রদান করলে অ্যাকাউন্ট বাতিল করা হবে।",
      "টিউশন ফি সরাসরি অভিভাবকের কাছ থেকে নেওয়া হবে।",
      "পেশাদার আচরণ বজায় রাখতে হবে।",
    ],
  },
  {
    number: "০৪",
    title: "পেমেন্ট নীতি",
    points: [
      "অভিভাবকদের কাছ থেকে কোনো সার্ভিস চার্জ নেওয়া হয় না।",
      "টিউটরদের সাথে বেতন সম্পর্কিত যেকোনো চুক্তি সরাসরি অভিভাবক ও টিউটরের মধ্যে হবে।",
      "Tutor's Kushtia কোনো পেমেন্ট গ্যারান্টি প্রদান করে না।",
    ],
  },
  {
    number: "০৫",
    title: "দায়বদ্ধতার সীমাবদ্ধতা",
    points: [
      "টিউটরের শিক্ষাদানের মান সম্পর্কে Tutor's Kushtia সরাসরি দায়ী নয়।",
      "আমরা টিউটর ভেরিফিকেশন করি, তবে টিউটরের আচরণের জন্য সম্পূর্ণ দায়ভার টিউটরের।",
      "প্ল্যাটফর্মের কোনো ত্রুটি বা ডাউনটাইমের জন্য আমরা ক্ষতিপূরণ দিতে বাধ্য নই।",
    ],
  },
  {
    number: "০৬",
    title: "শর্তাবলী পরিবর্তন",
    points: [
      "Tutor's Kushtia যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার সংরক্ষণ করে।",
      "পরিবর্তিত শর্তাবলী ওয়েবসাইটে প্রকাশের পর থেকে কার্যকর হবে।",
      "নিয়মিত এই পেজ চেক করার অনুরোধ রইল।",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <PageHeader
        badge="📄 শর্তাবলী"
        title="ব্যবহারের শর্তাবলী"
        subtitle="Tutor's Kushtia প্ল্যাটফর্ম ব্যবহার করার আগে অনুগ্রহ করে নিচের শর্তাবলী পড়ুন।"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/[.08] rounded-lg mb-10 w-fit"
        >
          <svg className="w-4 h-4 text-[#D97706]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium text-[#D97706] font-['Hind_Siliguri']">
            সর্বশেষ আপডেট: মে ২০২৬
          </span>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {TERMS_SECTIONS.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 card-hover"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center">
                  <span className="text-white text-sm font-extrabold font-['Outfit']">{section.number}</span>
                </div>
                <h2 className="text-lg font-bold text-[#111827] font-['Noto_Sans_Bengali']">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3 ml-1">
                {section.points.map((point, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] mt-2 flex-shrink-0" />
                    <span className="text-sm text-[#6B7280] leading-relaxed font-['Hind_Siliguri']">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Agreement Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-[#4F46E5]/[.04] border border-[#4F46E5]/10 rounded-2xl p-6 text-center"
        >
          <p className="text-sm text-[#4F46E5] font-semibold font-['Hind_Siliguri']">
            ℹ️ Tutor&apos;s Kushtia ব্যবহার করার মাধ্যমে আপনি উপরোক্ত শর্তাবলীতে সম্মত হচ্ছেন।
          </p>
        </motion.div>

        <BackToHome />
      </div>

      <Footer />
    </main>
  );
}
