"use client";

import { AuthProvider } from "@/lib/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
