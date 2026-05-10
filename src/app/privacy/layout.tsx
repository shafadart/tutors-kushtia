import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি | Tutor's Kushtia",
  description: "Tutor's Kushtia এর গোপনীয়তা নীতি। আমরা আপনার ব্যক্তিগত তথ্য কিভাবে সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি।",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
