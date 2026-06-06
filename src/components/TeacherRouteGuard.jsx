import { useState, useEffect } from "react";
import { Lock, Unlock, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { auth } from "../lib/firebase";
import { authorizeTeacher } from "../lib/db";

export default function TeacherRouteGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("teacher_authenticated") === "true"
  );
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(!auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passcode !== "PK2026") {
      setError("Incorrect Passcode! Access Denied.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Authentication state is not ready. Please refresh the page.");
      }

      // Authorize this user's UID in Firebase Realtime Database
      await authorizeTeacher(currentUser.uid, passcode);

      // Save success state in session storage
      sessionStorage.setItem("teacher_authenticated", "true");
      sessionStorage.setItem("teacher_passcode", passcode);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Teacher authentication error:", err);
      setError(err.message || "Failed to authorize database access.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Securing connection...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-secondary-500/10 blur-[120px] pointer-events-none"></div>

      <Link
        to="/"
        className="absolute top-6 left-6 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-400 hover:text-white shadow-lg transition-all duration-300 backdrop-blur-md"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <div className="w-full max-w-md bg-slate-900/60 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl z-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-primary-500/10 border border-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Lock className="w-10 h-10 text-primary-400" />
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          Teacher Mode
        </h1>
        <p className="text-slate-400 mb-8 text-sm">
          Please enter the PK Plays teacher passcode to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError("");
                }}
                placeholder="Enter teacher passcode"
                className="w-full px-4 py-4 pl-12 bg-white/5 border-2 border-white/10 focus:border-primary-500 rounded-2xl focus:outline-none transition-all text-center text-lg font-bold text-white tracking-widest placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-500"
                required
                autoFocus
              />
              <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-4.5" />
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-3 font-semibold bg-red-500/10 border border-red-500/20 py-2 px-4 rounded-xl">
                ⚠️ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !passcode}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Unlock Dashboard
                <Unlock className="w-5 h-5 ml-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
