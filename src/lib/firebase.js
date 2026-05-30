import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously } from "firebase/auth"; // ✨ 1. 引入身份验证模块

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopment",
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

// ✨ 2. 初始化 Auth 并直接触发“隐形登录”
export const auth = getAuth(app); 

signInAnonymously(auth)
  .then(() => {
    console.log("AR Quest 隐形登录成功！当前临时用户 UID:", auth.currentUser.uid);
  })
  .catch((error) => {
    console.error("Firebase 匿名登录失败，请检查控制台是否开启了 Anonymous 登录:", error.message);
  });

export default app;
