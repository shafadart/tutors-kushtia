"use client";

import { motion } from "framer-motion";

/* ── Orange-outlined SVG Icon wrapper ── */
function ContactIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-10 h-10 rounded-xl border-2 border-[#F59E0B]/40 bg-[#F59E0B]/[.08] flex items-center justify-center flex-shrink-0">
      {children}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* ── Indigo Backdrop ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#111827]" />

      {/* Decorative blurred circles */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#6366F1]/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#F59E0B]/10 blur-3xl" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Top Wave Divider ── */}
      <div className="absolute top-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 10 480 70 720 40C960 10 1200 70 1440 40V0H0V40Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>

      {/* ── Footer Content ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">

          {/* ── Brand Column ── */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="text-white text-xl font-extrabold font-['Outfit']">T</span>
              </div>
              <div>
                <div className="font-extrabold text-xl text-white font-['Outfit'] tracking-tight">
                  Tutor&apos;s Kushtia
                </div>
                <div className="text-xs text-white/50 font-['Hind_Siliguri']">
                  বিশ্বস্ত টিউটর প্ল্যাটফর্ম
                </div>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed font-['Hind_Siliguri'] mb-6 max-w-xs">
              কুষ্টিয়ায় সবচেয়ে বিশ্বস্ত হোম টিউটর ম্যাচিং প্ল্যাটফর্ম। ভেরিফাইড টিউটর,
              জিরো অ্যাডভান্স পেমেন্ট, এবং দ্রুত ম্যাচিং।
            </p>

            {/* App Download CTA */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-sm font-bold rounded-xl font-['Hind_Siliguri'] shadow-lg shadow-[#F59E0B]/20 cursor-pointer transition-shadow hover:shadow-xl hover:shadow-[#F59E0B]/30"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.523 2.236a.75.75 0 010 1.028l-2.22 2.388A7.5 7.5 0 0119.5 12a7.5 7.5 0 01-7.5 7.5 7.5 7.5 0 01-7.5-7.5A7.5 7.5 0 018.697 5.652L6.477 3.264a.75.75 0 011.046-1.028L9.97 4.88A7.458 7.458 0 0112 4.5c.712 0 1.402.099 2.058.284l2.437-2.52a.75.75 0 011.028-.028zM12 6a6 6 0 100 12 6 6 0 000-12zm0 2.25a.75.75 0 01.75.75v2.25H15a.75.75 0 010 1.5h-2.25V15a.75.75 0 01-1.5 0v-2.25H9a.75.75 0 010-1.5h2.25V9a.75.75 0 01.75-.75z" />
              </svg>
              অ্যাপ ডাউনলোড করুন
            </motion.button>
          </div>

          {/* ── Quick Links ── */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-5 font-['Outfit']">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "টিউটর খুঁজুন", href: "#magic-form", icon: "🔍" },
                { label: "টিউশন বোর্ড", href: "#live-board", icon: "📋" },
                { label: "কেন আমরা", href: "#trust-section", icon: "🛡️" },
                { label: "হোম", href: "#hero", icon: "🏠" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200 font-['Hind_Siliguri']"
                  >
                    <span className="text-xs">{link.icon}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── About ── */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-5 font-['Outfit']">
              About
            </h4>
            <ul className="space-y-3">
              {[
                { label: "আমাদের সম্পর্কে", icon: "ℹ️", href: "/about" },
                { label: "গোপনীয়তা নীতি", icon: "🔒", href: "/privacy" },
                { label: "শর্তাবলী", icon: "📄", href: "/terms" },
                { label: "FAQ", icon: "❓", href: "/faq" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200 font-['Hind_Siliguri'] cursor-pointer">
                    <span className="text-xs">{item.icon}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Info ── */}
          <div className="lg:col-span-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-5 font-['Outfit']">
              Contact Us
            </h4>
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <ContactIcon>
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </ContactIcon>
                <div>
                  <div className="text-xs text-white/40 font-['Outfit'] uppercase tracking-wide">Phone</div>
                  <a href="tel:+8801625868024" className="text-sm text-white font-semibold hover:text-[#F59E0B] transition-colors font-['Inter']">
                    +8801625-868024
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <ContactIcon>
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </ContactIcon>
                <div>
                  <div className="text-xs text-white/40 font-['Outfit'] uppercase tracking-wide">Email</div>
                  <a href="mailto:support@tutorskushtia.com" className="text-sm text-white font-semibold hover:text-[#F59E0B] transition-colors font-['Inter']">
                    support@tutorskushtia.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <ContactIcon>
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </ContactIcon>
                <div>
                  <div className="text-xs text-white/40 font-['Outfit'] uppercase tracking-wide">Location</div>
                  <span className="text-sm text-white font-semibold font-['Hind_Siliguri']">
                    কুষ্টিয়া, বাংলাদেশ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-white/10" />

        {/* ── Bottom Bar ── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 font-['Hind_Siliguri']">
            © ২০২৬ Tutor&apos;s Kushtia. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40 font-['Hind_Siliguri']">
              ❤️ কুষ্টিয়া থেকে ভালোবাসায় তৈরি
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline text-xs text-white/30 font-['Inter']">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
