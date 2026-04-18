import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ar-11-111111.firebaseapp.com",
  projectId: "ar-11-111111",
  storageBucket: "ar-11-111111.firebasestorage.app",
  messagingSenderId: "967787882232",
  appId: "1:967787882232:web:9fa4efe1dcc2ec11503d0d",
  measurementId: "G-E2P39X778W",
  databaseURL: "https://ar-11-111111-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Initialize Realtime Database
export const db = getDatabase(app);
export default app;
