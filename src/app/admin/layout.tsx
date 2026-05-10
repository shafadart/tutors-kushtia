import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Tutor's Kushtia",
  description: "Tutor's Kushtia অ্যাডমিন ড্যাশবোর্ড — টিউশন রিকোয়েস্ট ম্যানেজমেন্ট",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
