import { Link } from "react-router-dom";
import { Sparkles, Map, Presentation } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-700"></div>

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center z-10 border border-primary-100">
        <div className="inline-flex items-center justify-center p-4 bg-primary-100 rounded-full mb-6">
          <Map className="w-12 h-12 text-primary-600" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
          AR Learning Quest
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto">
          Embark on an amazing magical journey! Track clues, find 3D surprises, and learn along the way!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg mx-auto">
          <Link
            to="/student"
            className="group relative flex flex-col items-center p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 border-2 border-secondary-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <Sparkles className="w-8 h-8 text-secondary-500 mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-bold text-slate-800">I'm a Student</h2>
            <p className="text-sm text-slate-500 mt-2">Enter the AR world now!</p>
          </Link>

          <Link
            to="/teacher"
            className="group relative flex flex-col items-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <Presentation className="w-8 h-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-bold text-slate-800">I'm a Teacher</h2>
            <p className="text-sm text-slate-500 mt-2">Create & manage your games</p>
          </Link>
        </div>
      </div>
      
      <p className="text-slate-400 text-sm mt-8 relative z-10">
        Made with ♥ for young explorers
      </p>
    </div>
  );
}
