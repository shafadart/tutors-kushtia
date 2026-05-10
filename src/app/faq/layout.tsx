import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Tutor's Kushtia",
  description: "Tutor's Kushtia সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর।",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
