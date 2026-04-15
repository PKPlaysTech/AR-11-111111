import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDflLbJlPMNgUtlSzDRdE1L9Djc3IAhHgA",
  authDomain: "ar-project-11-111111.firebaseapp.com",
  projectId: "ar-project-11-111111",
  storageBucket: "ar-project-11-111111.firebasestorage.app",
  messagingSenderId: "941107620302",
  appId: "1:941107620302:web:12d43683c3fa4d7ad8a39f",
  measurementId: "G-PN5576QTTY",
  databaseURL: "https://ar-project-11-111111-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Initialize Realtime Database
export const db = getDatabase(app);
