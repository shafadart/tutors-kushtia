"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ── Data Constants ── */
const CLASSES = [
  "নার্সারি (Nursery)",
  "কেজি (KG)",
  "শ্রেণি ১",
  "শ্রেণি ২",
  "শ্রেণি ৩",
  "শ্রেণি ৪",
  "শ্রেণি ৫",
  "শ্রেণি ৬",
  "শ্রেণি ৭",
  "শ্রেণি ৮",
  "শ্রেণি ৯",
  "শ্রেণি ১০",
  "শ্রেণি ১১ (HSC)",
  "শ্রেণি ১২ (HSC)",
];

const SUBJECTS = [
  "গণিত (Math)",
  "বিজ্ঞান (Science)",
  "ইংরেজি (English)",
  "বাংলা (Bangla)",
  "পদার্থবিদ্যা (Physics)",
  "রসায়ন (Chemistry)",
  "জীববিদ্যা (Biology)",
  "হিসাববিজ্ঞান (Accounting)",
  "ICT",
  "সকল বিষয় (All Subjects)",
];

const AREAS = [
  "হাউজিং (Housing)",
  "মজমপুর (Majampur)",
  "কোর্ট পাড়া (Court Para)",
  "থানা পাড়া (Thana Para)",
  "মিলপাড়া (Milpara)",
  "জুরানপুর (Juranpur)",
  "বড় বাজার (Boro Bazaar)",
  "পৌরসভা (Pourashava)",
  "আমলাপাড়া (Amlapara)",
  "মোহিনী মিল (Mohini Mill)",
  "কুমারখালী (Kumarkhali)",
  "খোকসা (Khoksa)",
  "অন্যান্য (Others)",
];



const TUTOR_EXPERIENCE = [
  "Fresh/New",
  "1-2 Years",
  "3+ Years",
  "Any",
];

const TUTOR_PREFERENCE = [
  { value: "male", label: "পুরুষ", icon: "👨‍🏫" },
  { value: "female", label: "মহিলা", icon: "👩‍🏫" },
  { value: "any", label: "যেকোনো", icon: "🤝" },
];

/* ── Custom Select Dropdown ── */
function CustomSelect({
  label,
  icon,
  options,
  value,
  onChange,
  placeholder,
  id,
}: {
  label: string;
  icon: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  id: string;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-semibold text-[#374151] font-['Hind_Siliguri']"
      >
        <span>{icon}</span>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] text-base font-['Hind_Siliguri'] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all duration-200 cursor-pointer hover:border-[#4F46E5]/40"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9CA3AF]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── Confetti Component ── */
function Confetti() {
  const colors = ["#4F46E5", "#F59E0B", "#10B981", "#EC4899", "#8B5CF6", "#06B6D4"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${Math.random() * 0.8}s`,
            animationDuration: `${1 + Math.random() * 1}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main MagicForm ── */
export default function MagicForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [formData, setFormData] = useState({
    classLevel: "",
    subject: "",
    area: "",
    tutorPreference: "any",
    salary: "",
    phone: "",
    address: "",
    qualification: "",
    experience: "",
    preferredTime: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "tuition_requests"), {
        class: formData.classLevel,
        subject: formData.subject,
        area: formData.area,
        tutorGender: formData.tutorPreference,
        salary: formData.salary,
        guardianPhone: formData.phone,
        guardianAddress: formData.address,
        tutorQualification: formData.qualification,
        tutorExperience: formData.experience,
        preferredTime: formData.preferredTime,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      /* ── Discord Webhook Alert (silent background execution) ── */
      // https://discord.com/api/webhooks/1503434920398160074/tCnOWir96W6Cqqbl2OKCtu6BMgkYp2Lp3Qrcq5cElTO1KGlvYZxAgFlc3lfD91l_kmBy
      try {
        const DISCORD_WEBHOOK_URL =
          "https://discord.com/api/webhooks/1503434920398160074/tCnOWir96W6Cqqbl2OKCtu6BMgkYp2Lp3Qrcq5cElTO1KGlvYZxAgFlc3lfD91l_kmBy";

        const discordPayload = {
          username: "Tutors Kushtia",
          avatar_url: "https://tutors-kushtia.vercel.app/favicon.ico",
          embeds: [
            {
              title: "🚀 New Tuition Request!",
              color: 5201637, // Indigo #4F46E5
              fields: [
                { name: "📚 Class",       value: formData.classLevel || "—",           inline: true },
                { name: "📝 Subject",     value: formData.subject || "—",              inline: true },
                { name: "📍 Area",        value: formData.area || "—",                 inline: true },
                { name: "👤 Tutor Pref",  value: formData.tutorPreference || "—",      inline: true },
                { name: "🎓 Qualification", value: formData.qualification || "—",      inline: true },
                { name: "⏳ Experience",  value: formData.experience || "—",            inline: true },
                { name: "💰 Salary",      value: formData.salary || "N/A",             inline: true },
                { name: "🕐 Time",        value: formData.preferredTime || "N/A",      inline: true },
                { name: "📱 Phone",       value: `\`${formData.phone}\``,              inline: true },
                { name: "🏠 Address",     value: formData.address || "—",              inline: false },
              ],
              footer: { text: "Tutors Kushtia Admin System" },
              timestamp: new Date().toISOString(),
            },
          ],
        };

        // Fire-and-forget: don't await, don't block UI
        fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordPayload),
        }).catch(() => {
          // Silently ignore Discord webhook errors
        });
      } catch {
        // Silently ignore any notification errors
      }

      setIsSubmitting(false);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting request:", error);
      setIsSubmitting(false);
      alert("সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    }
  };

  const isFormValid =
    formData.classLevel &&
    formData.subject &&
    formData.area &&
    formData.phone.length >= 11 &&
    formData.preferredTime;

  return (
    <section id="magic-form" className="relative py-20 sm:py-28" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F9FAFB] via-white to-[#F9FAFB]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#4F46E5]/[.03] blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4F46E5]/[.08] text-[#4F46E5] text-sm font-semibold mb-4 font-['Hind_Siliguri']">
            <span className="text-lg">✨</span>
            ম্যাজিক ফর্ম
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mb-3 font-['Noto_Sans_Bengali']">
            আপনার প্রয়োজন <span className="text-gradient-primary">জানান</span>
          </h2>
          <p className="text-[#6B7280] text-base sm:text-lg font-['Hind_Siliguri']">
            কোনো লগইন লাগবে না। শুধু ফর্মটি পূরণ করুন, আমরা যোগাযোগ করব।
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="relative glass-card-strong rounded-3xl shadow-xl p-6 sm:p-8 overflow-hidden">
            {/* Decorative corner accent */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#4F46E5]/[.08] to-[#F59E0B]/[.08]" />

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="relative z-10 space-y-5"
                >
                  {/* Row 1: Class & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <CustomSelect
                      id="select-class"
                      label="শ্রেণি"
                      icon="📚"
                      options={CLASSES}
                      value={formData.classLevel}
                      onChange={(v) => setFormData({ ...formData, classLevel: v })}
                      placeholder="শ্রেণি নির্বাচন করুন"
                    />
                    <CustomSelect
                      id="select-subject"
                      label="বিষয়"
                      icon="📝"
                      options={SUBJECTS}
                      value={formData.subject}
                      onChange={(v) => setFormData({ ...formData, subject: v })}
                      placeholder="বিষয় নির্বাচন করুন"
                    />
                  </div>

                  {/* Row 2: Area */}
                  <CustomSelect
                    id="select-area"
                    label="এলাকা"
                    icon="📍"
                    options={AREAS}
                    value={formData.area}
                    onChange={(v) => setFormData({ ...formData, area: v })}
                    placeholder="এলাকা নির্বাচন করুন"
                  />

                  {/* Guardian Full Address */}
                  <div className="space-y-2">
                    <label
                      htmlFor="input-address"
                      className="flex items-center gap-2 text-sm font-semibold text-[#374151] font-['Hind_Siliguri']"
                    >
                      <span>🏠</span>
                      অভিভাবকের সম্পূর্ণ ঠিকানা
                    </label>
                    <textarea
                      id="input-address"
                      rows={3}
                      placeholder="বাড়ি নং, রাস্তা, মহল্লা, পোস্ট অফিস..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] text-base font-['Hind_Siliguri'] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all duration-200 placeholder:text-[#9CA3AF] resize-none"
                    />
                  </div>

                  {/* Tutor Preference Radio */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#374151] font-['Hind_Siliguri']">
                      <span>👤</span>
                      টিউটর পছন্দ
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {TUTOR_PREFERENCE.map((pref) => (
                        <button
                          key={pref.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, tutorPreference: pref.value })}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 font-['Hind_Siliguri'] cursor-pointer ${
                            formData.tutorPreference === pref.value
                              ? "border-[#4F46E5] bg-[#4F46E5]/[.06] text-[#4F46E5]"
                              : "border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] hover:border-[#4F46E5]/30"
                          }`}
                        >
                          <span className="text-2xl">{pref.icon}</span>
                          <span className="text-sm font-medium">{pref.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row 3: Qualification & Experience */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="input-qualification"
                        className="flex items-center gap-2 text-sm font-semibold text-[#374151] font-['Hind_Siliguri']"
                      >
                        <span>🎓</span>
                        টিউটরের যোগ্যতা
                      </label>
                      <input
                        id="input-qualification"
                        type="text"
                        placeholder="যেমন: Honours, Masters, Engineer..."
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        className="w-full px-4 py-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] text-base font-['Hind_Siliguri'] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all duration-200 placeholder:text-[#9CA3AF]"
                      />
                    </div>
                    <CustomSelect
                      id="select-experience"
                      label="টিউটরের অভিজ্ঞতা"
                      icon="⏳"
                      options={TUTOR_EXPERIENCE}
                      value={formData.experience}
                      onChange={(v) => setFormData({ ...formData, experience: v })}
                      placeholder="অভিজ্ঞতা নির্বাচন করুন"
                    />
                  </div>

                  {/* Row 4: Salary & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="input-salary"
                        className="flex items-center gap-2 text-sm font-semibold text-[#374151] font-['Hind_Siliguri']"
                      >
                        <span>💰</span>
                        বেতন (মাসিক)
                      </label>
                      <input
                        id="input-salary"
                        type="text"
                        placeholder="যেমন: ২০০০-৩০০০ টাকা"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        className="w-full px-4 py-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] text-base font-['Hind_Siliguri'] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all duration-200 placeholder:text-[#9CA3AF]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="input-phone"
                        className="flex items-center gap-2 text-sm font-semibold text-[#374151] font-['Hind_Siliguri']"
                      >
                        <span>📱</span>
                        ফোন নম্বর <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="input-phone"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value.replace(/[^0-9]/g, "").slice(0, 11),
                          })
                        }
                        className="w-full px-4 py-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] text-base font-['Hind_Siliguri'] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all duration-200 placeholder:text-[#9CA3AF]"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 5: Preferred Tuition Time */}
                  <div className="space-y-2">
                    <label
                      htmlFor="input-time"
                      className="flex items-center gap-2 text-sm font-semibold text-[#374151] font-['Hind_Siliguri']"
                    >
                      <span>🕐</span>
                      পছন্দের টিউশন সময়
                      <svg className="w-4 h-4 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </label>
                    <input
                      id="input-time"
                      type="time"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-4 py-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] text-base font-['Hind_Siliguri'] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    id="btn-submit"
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-4 rounded-2xl text-lg font-bold font-['Hind_Siliguri'] transition-all duration-300 flex items-center justify-center gap-3 ${
                      isFormValid
                        ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white btn-glow-primary cursor-pointer"
                        : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="31.4"
                            strokeDashoffset="10"
                          />
                        </svg>
                        <span>পাঠানো হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <span>রিকোয়েস্ট পাঠান</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </motion.button>

                  {/* Privacy note */}
                  <p className="text-center text-xs text-[#9CA3AF] font-['Hind_Siliguri']">
                    🔒 আপনার তথ্য সম্পূর্ণ নিরাপদ ও গোপনীয়
                  </p>
                </motion.form>
              ) : (
                /* ── Success State ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="relative z-10 text-center py-8"
                >
                  <Confetti />

                  {/* Animated checkmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg"
                    style={{ boxShadow: "0 0 40px rgba(16, 185, 129, 0.3)" }}
                  >
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="w-10 h-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      />
                    </motion.svg>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-[#111827] mb-2 font-['Noto_Sans_Bengali']">
                    ধন্যবাদ! 🎉
                  </h3>
                  <p className="text-[#6B7280] text-lg mb-6 font-['Hind_Siliguri']">
                    আপনার রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে।
                    <br />
                    আমাদের টিম শীঘ্রই যোগাযোগ করবে।
                  </p>

                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#10B981]/[.1] text-[#059669] rounded-full text-sm font-semibold font-['Hind_Siliguri']">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    সাধারণত ১-৩ ঘণ্টার মধ্যে কল করা হয়
                  </div>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        classLevel: "",
                        subject: "",
                        area: "",
                        tutorPreference: "any",
                        salary: "",
                        phone: "",
                        address: "",
                        qualification: "",
                        experience: "",
                        preferredTime: "",
                      });
                    }}
                    className="mt-6 text-sm text-[#4F46E5] hover:underline font-['Hind_Siliguri'] cursor-pointer"
                  >
                    আরেকটি রিকোয়েস্ট পাঠান →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
