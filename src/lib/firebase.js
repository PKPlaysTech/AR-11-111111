import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously } from "firebase/auth"; // 1. Import Authentication module

const firebaseConfig = {
  // Replace the string below with your real API key from Firebase Project Settings
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
  authDomain: "ar-11-111111.firebaseapp.com",
  projectId: "ar-11-111111",
  storageBucket: "ar-11-111111.firebasestorage.app",
  messagingSenderId: "967787882232",
  appId: "1:967787882232:web:9fa4efe1dcc2ec11503d0d",
  measurementId: "G-E2P39X778W",
  databaseURL: "https://ar-11-111111-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase safely to prevent white screens
let app, analytics, db, auth;

try {
  app = initializeApp(firebaseConfig);
  analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
  db = getDatabase(app);
  auth = getAuth(app); 

  if (typeof window !== "undefined") {
    signInAnonymously(auth)
      .then(() => {
        console.log("AR Quest anonymous sign-in successful! Current UID:", auth.currentUser.uid);
      })
      .catch((error) => {
        console.error("Firebase anonymous sign-in failed. Please check if Anonymous provider is enabled in Firebase Console:", error.message);
      });
  }
} catch (error) {
  console.error("Firebase initialization failed! Check your .env file:", error);
  // Create dummy objects to prevent full app crash if Firebase fails
  db = {};
  auth = {};
}

export { db, auth };
export default app;
