import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে | Tutor's Kushtia",
  description: "Tutor's Kushtia - কুষ্টিয়ার সবচেয়ে বিশ্বস্ত হোম টিউটর ম্যাচিং প্ল্যাটফর্ম। আমাদের মিশন, ভিশন এবং গল্প জানুন।",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
