import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { tutorId, title, body, data } = await req.json();

    // Fetch the tutor's FCM token from Firestore
    const tutorDoc = await admin.firestore().collection("tutors").doc(tutorId).get();
    const tutorData = tutorDoc.data();

    if (!tutorData || !tutorData.fcmToken) {
      return NextResponse.json(
        { success: false, error: "Tutor does not have an FCM token registered." },
        { status: 404 }
      );
    }

    const message = await admin.messaging().send({
      token: tutorData.fcmToken,
      notification: {
        title: title || "Tutor's Kushtia",
        body: body || "You have a new notification.",
      },
      data: data || {},
      android: {
        priority: "high",
        notification: {
          channelId: "direct_alerts_channel",
          sound: "default",
        },
      },
    });

    return NextResponse.json({ success: true, messageId: message });
  } catch (error: unknown) {
    console.error("Direct FCM Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
