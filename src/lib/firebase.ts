import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApz2G0XdxavMXmy2BIuEKSXk7b3xdqdg0",
  authDomain: "tutors-kushtia.firebaseapp.com",
  projectId: "tutors-kushtia",
  storageBucket: "tutors-kushtia.firebasestorage.app",
  messagingSenderId: "23298806365",
  appId: "1:23298806365:web:fa1e6ab8a4ca27126673b4",
};

// Initialize Firebase (prevent re-initialization in dev hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore database instance
export const db = getFirestore(app);

export default app;
