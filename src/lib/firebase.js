import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously } from "firebase/auth"; // 1. Import Authentication module

const firebaseConfig = {
  // Replace the string below with your real API key from Firebase Project Settings
  apiKey: "YOUR_ACTUAL_API_KEY_HERE", 
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

// 2. Initialize Auth and trigger invisible anonymous sign-in
export const auth = getAuth(app); 

if (typeof window !== "undefined") {
  signInAnonymously(auth)
    .then(() => {
      console.log("AR Quest anonymous sign-in successful! Current UID:", auth.currentUser.uid);
    })
    .catch((error) => {
      console.error("Firebase anonymous sign-in failed. Please check if Anonymous provider is enabled in Firebase Console:", error.message);
    });
}

export default app;
