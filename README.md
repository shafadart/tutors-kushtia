<div align="center">
  
# 🎓 Tutor's Kushtia

### কুষ্টিয়ার সবচেয়ে বিশ্বস্ত হোম টিউটর ম্যাচিং প্ল্যাটফর্ম

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

**Scam-free • NID Verified • Zero Advance Payment**

[🌐 Live Demo](#) • [📱 Download App](#) • [📧 Contact Us](#contact)

</div>

---

## 🌟 Overview

**Tutor's Kushtia** is a hyper-local, trust-focused home tutor matching platform built specifically for the parents and students of **Kushtia, Bangladesh**. We bridge the gap between verified tutors and families seeking quality education — with zero upfront costs and complete transparency.

> 🇧🇩 _"কুষ্টিয়ায় বিশ্বস্ত হোম টিউটর খুঁজছেন? NID ও Student ID ভেরিফাইড টিউটর। কোনো অ্যাডভান্স পেমেন্ট নেই।"_

---

## ✨ Features

### 🏠 For Parents (অভিভাবকদের জন্য)
- **Magic Form** — Submit tuition requests without any login or registration
- **Verified Tutors** — Every tutor is NID & Student ID verified
- **Zero Payment** — No advance fees, no hidden charges
- **Fast Matching** — Get matched with a tutor within 1-3 hours

### 📊 Admin Dashboard
- **Real-time Data** — Live Firestore-powered request management
- **Approve/Reject System** — One-click approval workflow
- **Filter & Stats** — Track pending, approved, and rejected requests
- **Responsive Design** — Manage from desktop or mobile

### 📋 Live Tuition Board
- **Dynamic Posts** — Only admin-approved posts appear publicly
- **Real-time Updates** — Board updates instantly via Firestore
- **Privacy Protected** — Phone numbers are blurred; app required to unlock

### 📄 Static Pages
- **About Us** — Mission, vision, core values & timeline
- **Privacy Policy** — Data collection & security practices
- **Terms & Conditions** — Platform usage rules
- **FAQ** — Interactive accordion-style Q&A

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Backend** | Firebase Firestore |
| **Fonts** | Noto Sans Bengali, Hind Siliguri, Outfit, Inter |
| **Deployment** | Vercel (recommended) |

---

## 🎨 Design System

| Role | Color | Hex |
|------|-------|-----|
| 🔵 **Primary** (Trust & Security) | Deep Indigo | `#4F46E5` |
| 🟠 **Action** (Energy & Urgency) | Vibrant Orange | `#F59E0B` |
| 🟢 **Verified** (Safety) | Emerald Green | `#10B981` |
| ⚪ **Background** | Warm Off-White | `#F9FAFB` |
| ⚫ **Footer** | Dark Charcoal | `#111827` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (Firestore enabled)

### Installation

```bash
# Clone the repository
git clone https://github.com/shafadart/tutors-kushtia.git

# Navigate to the project
cd tutors-kushtia

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database**
3. Update Firebase config in `src/lib/firebase.ts`
4. Set Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tuition_requests/{requestId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if true;
    }
  }
}
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx            # Homepage
│   ├── layout.tsx          # Root layout with fonts & metadata
│   ├── globals.css         # Design system & animations
│   ├── admin/
│   │   └── page.tsx        # Admin dashboard
│   ├── about/
│   │   └── page.tsx        # About us page
│   ├── privacy/
│   │   └── page.tsx        # Privacy policy
│   ├── terms/
│   │   └── page.tsx        # Terms & conditions
│   └── faq/
│       └── page.tsx        # FAQ with accordions
├── components/
│   ├── Navbar.tsx          # Sticky navigation
│   ├── Hero.tsx            # Hero section with floating icons
│   ├── MagicForm.tsx       # Tuition request form → Firestore
│   ├── LiveBoard.tsx       # Dynamic tuition board (approved only)
│   ├── TrustSection.tsx    # Trust badges & stats
│   ├── Footer.tsx          # Footer with links & contact
│   └── PageHeader.tsx      # Reusable page header component
└── lib/
    └── firebase.ts         # Firebase client initialization
```

---

## 🔄 Data Flow

```
Parent fills Magic Form
        ↓
Data saved to Firestore (status: "pending")
        ↓
Admin sees request in /admin dashboard
        ↓
Admin clicks "Approve" → status: "approved"
        ↓
Post appears on Live Tuition Board (homepage)
```

---

## 📞 Contact

<div align="center">

| Channel | Details |
|---------|---------|
| 📱 **Phone** | +8801625-868024 |
| 📧 **Email** | support@tutorskushtia.com |
| 📍 **Location** | Kushtia, Bangladesh |

</div>

---

<div align="center">

**Built with ❤️ for the students of Kushtia**

© ২০২৬ Tutor's Kushtia. সর্বস্বত্ব সংরক্ষিত।

</div>
