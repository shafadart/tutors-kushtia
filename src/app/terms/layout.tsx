import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "শর্তাবলী | Tutor's Kushtia",
  description: "Tutor's Kushtia ব্যবহারের শর্তাবলী। আমাদের প্ল্যাটফর্ম ব্যবহারের নিয়ম ও শর্তসমূহ।",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
