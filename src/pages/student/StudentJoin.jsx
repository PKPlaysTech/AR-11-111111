import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft, Users } from "lucide-react";

export default function StudentJoin() {
  const [teamName, setTeamName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!teamName || !gameCode) return;
    // TODO: Verify game code via Firebase, then redirect
    navigate(`/student/play/${gameCode}`, { state: { teamName } });
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
        <p className="text-center text-slate-500 mb-8">Enter your team name to start hunting.</p>

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

          <button 
            type="submit"
            disabled={!teamName || !gameCode}
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
