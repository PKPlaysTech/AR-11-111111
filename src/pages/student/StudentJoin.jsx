import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft, Users, Lock } from "lucide-react"; // 引入锁图标

export default function StudentJoin() {
  const [teamName, setTeamName] = useState("");
  const [className, setClassName] = useState(""); // 添加班级状态
  const [gameCode, setGameCode] = useState("");
  const [studentPassword, setStudentPassword] = useState(""); // 添加学生通关暗号状态
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!teamName || !className || !gameCode || !studentPassword) return;
    
    // 【密码校验】：如果输入的不是 student2026，直接拦截！
    if (studentPassword !== "student2026") {
      alert("Wrong Student Passcode! Access Denied.");
      return;
    }

    // 【密码向下传递】：把学生输入的密码顺带传给真正玩的页面，交分数时要用
    navigate(`/student/play/${gameCode}`, { 
      state: { teamName, className, studentKey: studentPassword } 
    });
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Link to="/" className="absolute top-6 left-6 p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl z-10 border border-secondary-100">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-8 h-8 text-secondary-500" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-center text-slate-800 mb-2">Join Adventure!</h1>
        <p className="text-center text-slate-500 mb-8">Enter details below to start hunting.</p>

        <form onSubmit={handleJoin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Team Name</label>
            <input 
              type="text" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Red Dragons"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-secondary-400 focus:outline-none transition-colors text-lg font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Class</label>
            <input 
              type="text" 
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. Year 2A / 5B"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-secondary-400 focus:outline-none transition-colors text-lg font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Game Code</label>
            <input 
              type="text" 
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              placeholder="e.g. ABCDF"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-secondary-400 focus:outline-none transition-colors text-lg font-medium tracking-widest uppercase"
              required
            />
          </div>

          {/* Student passcode input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Student Passcode</label>
            <div className="relative">
              <input 
                type="password" 
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                placeholder="Enter passcode"
                className="w-full px-4 py-3 pl-11 rounded-xl border-2 border-slate-200 focus:border-secondary-400 focus:outline-none transition-colors text-lg font-medium"
                required
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!teamName || !className || !gameCode || !studentPassword}
            className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start the Hunt
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
