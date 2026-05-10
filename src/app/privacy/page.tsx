"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { BackToHome } from "@/components/PageHeader";

const PRIVACY_SECTIONS = [
  {
    icon: "📋",
    title: "তথ্য সংগ্রহ",
    content: [
      "আমরা আপনার নাম, ফোন নম্বর এবং ঠিকানা সংগ্রহ করি যা টিউটর ম্যাচিং এর জন্য প্রয়োজন।",
      "ফর্ম পূরণের সময় আপনি যে তথ্য প্রদান করেন সেগুলো আমরা সংরক্ষণ করি।",
      "আমাদের ওয়েবসাইট ভিজিট করলে কিছু টেকনিক্যাল ডেটা (যেমন IP address, browser type) স্বয়ংক্রিয়ভাবে সংগৃহীত হতে পারে।",
    ],
  },
  {
    icon: "🔐",
    title: "তথ্য ব্যবহার",
    content: [
      "আপনার তথ্য শুধুমাত্র টিউটর খুঁজে দেওয়ার উদ্দেশ্যে ব্যবহৃত হয়।",
      "আপনার ফোন নম্বর দিয়ে আমাদের টিম আপনার সাথে যোগাযোগ করে।",
      "আপনার তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করা হয় না।",
      "শুধু ভেরিফাইড টিউটরদের সাথেই প্রয়োজনীয় তথ্য শেয়ার করা হয়।",
    ],
  },
  {
    icon: "🛡️",
    title: "তথ্য সুরক্ষা",
    content: [
      "আমরা আধুনিক সিকিউরিটি প্র্যাকটিস ব্যবহার করে আপনার ডেটা সুরক্ষিত রাখি।",
      "আমাদের সার্ভারে সংরক্ষিত তথ্য এনক্রিপ্টেড থাকে।",
      "শুধু অনুমোদিত টিম মেম্বাররা আপনার তথ্যে অ্যাক্সেস পায়।",
    ],
  },
  {
    icon: "🍪",
    title: "কুকিজ",
    content: [
      "আমাদের ওয়েবসাইট কুকিজ ব্যবহার করতে পারে আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে।",
      "আপনি চাইলে ব্রাউজার সেটিংস থেকে কুকিজ নিষ্ক্রিয় করতে পারেন।",
    ],
  },
  {
    icon: "✏️",
    title: "তথ্য পরিবর্তন ও মুছে ফেলা",
    content: [
      "আপনি যেকোনো সময় আপনার তথ্য আপডেট বা মুছে ফেলার অনুরোধ করতে পারেন।",
      "এ জন্য আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন: support@tutorskushtia.com",
    ],
  },
  {
    icon: "📞",
    title: "যোগাযোগ",
    content: [
      "গোপনীয়তা সম্পর্কিত যেকোনো প্রশ্ন বা উদ্বেগের জন্য আমাদের সাথে যোগাযোগ করুন।",
      "ফোন: +8801625-868024",
      "ইমেইল: support@tutorskushtia.com",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <PageHeader
        badge="🔒 গোপনীয়তা নীতি"
        title="গোপনীয়তা নীতি"
        subtitle="আমরা আপনার গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দিই। এখানে জানুন আমরা কিভাবে আপনার তথ্য সুরক্ষিত রাখি।"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5]/[.06] rounded-lg mb-10 w-fit"
        >
          <svg className="w-4 h-4 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium text-[#4F46E5] font-['Hind_Siliguri']">
            সর্বশেষ আপডেট: মে ২০২৬
          </span>
        </motion.div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {PRIVACY_SECTIONS.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 card-hover"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/[.08] flex items-center justify-center">
                  <span className="text-lg">{section.icon}</span>
                </div>
                <h2 className="text-lg font-bold text-[#111827] font-['Noto_Sans_Bengali']">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-[#6B7280] leading-relaxed font-['Hind_Siliguri']">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <BackToHome />
      </div>

      <Footer />
    </main>
  );
}
