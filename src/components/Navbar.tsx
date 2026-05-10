"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "হোম", href: "#hero" },
    { label: "টিউটর খুঁজুন", href: "#magic-form" },
    { label: "টিউশন বোর্ড", href: "#live-board" },
    { label: "কেন আমরা", href: "#trust-section" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-[#E5E7EB]/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white text-lg font-extrabold font-['Outfit']">T</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-extrabold text-[#111827] font-['Outfit'] tracking-tight">
                Tutor&apos;s Kushtia
              </span>
              <span className="text-[10px] text-[#6B7280] font-['Hind_Siliguri']">
                বিশ্বস্ত টিউটর প্ল্যাটফর্ম
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-[#4B5563] hover:text-[#4F46E5] rounded-lg hover:bg-[#4F46E5]/[.05] transition-all duration-200 font-['Hind_Siliguri']"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#magic-form"
              className="px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all duration-300 font-['Hind_Siliguri'] hover:scale-[1.03] active:scale-[0.97]"
            >
              টিউটর খুঁজুন
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-[#374151]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-[#E5E7EB]/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-[#374151] hover:text-[#4F46E5] hover:bg-[#4F46E5]/[.05] rounded-xl transition-colors font-['Hind_Siliguri']"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2">
                <a
                  href="#magic-form"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white text-sm font-bold rounded-xl font-['Hind_Siliguri']"
                >
                  টিউটর খুঁজুন
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
