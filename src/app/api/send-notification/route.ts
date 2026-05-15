import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin lazily
function initAdmin() {
  if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace \n with actual newlines in the private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
}

export async function POST(req: NextRequest) {
  initAdmin();
  try {
    const { tuitionId, className, subject, area } = await req.json();

    // Send FCM notification to all tutors subscribed to 'all_verified_tutors' topic
    const message = await admin.messaging().send({
      topic: "all_verified_tutors",
      notification: {
        title: "🚀 নতুন টিউশন অ্যালার্ট!",
        body: `${className} — ${subject} (${area}) এ একটি নতুন টিউশন পোস্ট হয়েছে।`,
      },
      data: {
        tuitionId: tuitionId || "",
        type: "new_tuition",
      },
      android: {
        priority: "high",
        notification: {
          channelId: "tuition_alerts_channel",
          sound: "default",
        },
      },
    });

    return NextResponse.json({ success: true, messageId: message });
  } catch (error: unknown) {
    console.error("FCM Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
