import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously } from "firebase/auth"; // 1. Import Authentication module

const firebaseConfig = {
  // Replace the string below with your real API key from Firebase Project Settings
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "", 
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

if (!firebaseConfig.apiKey) {
  console.error("FIREBASE API KEY IS MISSING! Please make sure your .env.local file is loaded properly.");
  if (typeof window !== 'undefined') alert("Firebase API Key is missing! Please check your .env file.");
  db = {};
  auth = {};
} else {
  try {
    app = initializeApp(firebaseConfig);
    analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
    db = getDatabase(app);
    auth = getAuth(app); 

    if (typeof window !== "undefined") {
      signInAnonymously(auth)
        .then((cred) => {
          console.log("AR Quest anonymous sign-in successful! Current UID:", cred.user.uid);
        })
        .catch((error) => {
          console.error("Firebase anonymous sign-in failed:", error.message);
          // Don't alert here to avoid spam, just log
        });
    }
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    if (typeof window !== 'undefined') {
      alert("Firebase Init Error: " + error.message);
    }
    // DO NOT mock db and auth as empty objects if it breaks the SDK.
    // Let it be undefined so it throws a standard error, or just throw it.
    throw error;
  }
}

export { db, auth };
export default app;
