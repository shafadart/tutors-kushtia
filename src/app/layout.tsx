import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tutor's Kushtia | কুষ্টিয়ার বিশ্বস্ত হোম টিউটর প্ল্যাটফর্ম",
  description:
    "কুষ্টিয়ায় ভেরিফাইড হোম টিউটর খুঁজুন। ১০০% নিরাপদ, কোনো অ্যাডভান্স পেমেন্ট নেই। ক্লাস ১-১২ পর্যন্ত সকল বিষয়ে অভিজ্ঞ টিউটর পাবেন।",
  keywords: [
    "tutor kushtia",
    "home tutor kushtia",
    "কুষ্টিয়া টিউটর",
    "হোম টিউটর",
    "টিউশন কুষ্টিয়া",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-[Inter] antialiased">{children}</body>
    </html>
  );
}
