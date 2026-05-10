"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { BackToHome } from "@/components/PageHeader";

const FAQ_DATA = [
  {
    category: "সাধারণ প্রশ্ন",
    icon: "💡",
    color: "#4F46E5",
    questions: [
      {
        q: "Tutor's Kushtia কি?",
        a: "Tutor's Kushtia হলো কুষ্টিয়ার একটি হোম টিউটর ম্যাচিং প্ল্যাটফর্ম। আমরা অভিভাবকদের ভেরিফাইড এবং বিশ্বস্ত হোম টিউটরের সাথে সংযুক্ত করি।",
      },
      {
        q: "Tutor's Kushtia কি ফ্রি?",
        a: "হ্যাঁ! অভিভাবকদের জন্য আমাদের সেবা সম্পূর্ণ ফ্রি। কোনো সার্ভিস চার্জ বা অ্যাডভান্স পেমেন্ট নেই। আপনি টিউটর পেয়ে সন্তুষ্ট হলে তখনই শুধু টিউটরকে মাসিক বেতন দেবেন।",
      },
      {
        q: "Tutor's Kushtia কোন এলাকায় সেবা দেয়?",
        a: "বর্তমানে আমরা কুষ্টিয়া শহর এবং আশেপাশের এলাকাসমূহে (হাউজিং, মজমপুর, কোর্ট পাড়া, থানা পাড়া, মিলপাড়া, জুরানপুর, কুমারখালী, খোকসা ইত্যাদি) সেবা দিচ্ছি।",
      },
    ],
  },
  {
    category: "টিউটর সম্পর্কে",
    icon: "👨‍🏫",
    color: "#10B981",
    questions: [
      {
        q: "টিউটররা কিভাবে ভেরিফাই করা হয়?",
        a: "প্রতিটি টিউটরের NID (জাতীয় পরিচয়পত্র) এবং Student ID যাচাই করা হয়। এছাড়াও তাদের শিক্ষাগত যোগ্যতা এবং অভিজ্ঞতা পর্যালোচনা করা হয়।",
      },
      {
        q: "আমি কি টিউটর পছন্দ করতে পারি (পুরুষ/মহিলা)?",
        a: "অবশ্যই! ফর্ম পূরণের সময় আপনি পুরুষ, মহিলা, বা যেকোনো — আপনার পছন্দ উল্লেখ করতে পারেন। আমরা আপনার পছন্দ অনুযায়ী টিউটর খুঁজে দেব।",
      },
      {
        q: "টিউটর পছন্দ না হলে কি পরিবর্তন করা যায়?",
        a: "হ্যাঁ! যদি কোনো টিউটর আপনার পছন্দ না হয়, তাহলে আমাদের জানান। আমরা বিনা খরচে নতুন টিউটর ম্যাচ করে দেব।",
      },
    ],
  },
  {
    category: "প্রক্রিয়া সম্পর্কে",
    icon: "⚡",
    color: "#F59E0B",
    questions: [
      {
        q: "টিউটর পেতে কতক্ষণ সময় লাগে?",
        a: "সাধারণত আপনার রিকোয়েস্ট পাওয়ার ১-৩ ঘণ্টার মধ্যে আমাদের টিম আপনার সাথে যোগাযোগ করে। ২৪ ঘণ্টার মধ্যে টিউটর ম্যাচ করে দেওয়া হয়।",
      },
      {
        q: "কিভাবে টিউটরের জন্য রিকোয়েস্ট করব?",
        a: "খুব সহজ! আমাদের ওয়েবসাইটের 'টিউটর খুঁজছি' ফর্মটি পূরণ করুন — শ্রেণি, বিষয়, এলাকা এবং আপনার ফোন নম্বর দিন। কোনো লগইন বা রেজিস্ট্রেশন লাগবে না।",
      },
      {
        q: "আমি কি অ্যাপের মাধ্যমেও টিউটর খুঁজতে পারি?",
        a: "হ্যাঁ! Tutor's Kushtia অ্যাপ ডাউনলোড করে আপনি সরাসরি টিউশন পোস্ট দেখতে এবং টিউটরদের কন্টাক্ট নম্বর পেতে পারবেন।",
      },
    ],
  },
  {
    category: "পেমেন্ট সম্পর্কে",
    icon: "💰",
    color: "#EC4899",
    questions: [
      {
        q: "টিউটরের বেতন কিভাবে নির্ধারণ হয়?",
        a: "টিউটরের বেতন অভিভাবক এবং টিউটরের মধ্যে সরাসরি আলোচনা করে নির্ধারিত হয়। আমরা শুধু একটি সাধারণ রেঞ্জ সাজেস্ট করি।",
      },
      {
        q: "কোনো অ্যাডভান্স পেমেন্ট দিতে হবে?",
        a: "একদম না! Tutor's Kushtia তে কোনো অ্যাডভান্স পেমেন্ট নেই। আপনি টিউটর পেয়ে সন্তুষ্ট হলে মাস শেষে বেতন দেবেন।",
      },
    ],
  },
];

/* ── FAQ Accordion Item ── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#4F46E5]/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer bg-white hover:bg-[#F9FAFB]/50 transition-colors"
      >
        <span className="text-sm font-semibold text-[#111827] font-['Hind_Siliguri'] leading-relaxed">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <svg className="w-5 h-5 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-0">
              <div className="border-t border-[#E5E7EB] pt-3">
                <p className="text-sm text-[#6B7280] leading-relaxed font-['Hind_Siliguri']">{answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <PageHeader
        badge="❓ সচরাচর জিজ্ঞাসা"
        title="FAQ"
        subtitle="Tutor's Kushtia সম্পর্কে আপনার মনে যে প্রশ্নগুলো আসতে পারে, তার উত্তর এখানে পাবেন।"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* FAQ Categories */}
        <div className="space-y-10">
          {FAQ_DATA.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  <span className="text-lg">{cat.icon}</span>
                </div>
                <h2 className="text-lg font-bold text-[#111827] font-['Noto_Sans_Bengali']">
                  {cat.category}
                </h2>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {cat.questions.map((faq, j) => (
                  <FaqItem key={j} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center card-hover"
        >
          <span className="text-4xl mb-4 block">🤔</span>
          <h3 className="text-lg font-bold text-[#111827] mb-2 font-['Noto_Sans_Bengali']">
            আপনার প্রশ্নের উত্তর পাননি?
          </h3>
          <p className="text-sm text-[#6B7280] mb-5 font-['Hind_Siliguri']">
            আমাদের সাপোর্ট টিম আপনাকে সাহায্য করতে প্রস্তুত।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:+8801625868024"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white text-sm font-bold rounded-xl font-['Hind_Siliguri'] hover:shadow-lg transition-all duration-300"
            >
              📞 +8801625-868024
            </a>
            <a
              href="mailto:support@tutorskushtia.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#4F46E5]/30 text-[#4F46E5] text-sm font-bold rounded-xl font-['Hind_Siliguri'] hover:border-[#4F46E5] hover:bg-[#4F46E5]/5 transition-all duration-300"
            >
              ✉️ ইমেইল করুন
            </a>
          </div>
        </motion.div>

        <BackToHome />
      </div>

      <Footer />
    </main>
  );
}
