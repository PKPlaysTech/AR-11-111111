import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { subscribeToLeaderboard } from "../../lib/db";
import { Trophy, ArrowLeft, Loader2 } from "lucide-react";

export default function Leaderboard() {
  const { gameCode } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard(gameCode, (data) => {
      setLeaderboard(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gameCode]);

  return (
    <div className="min-h-screen bg-accent-50 p-6 flex flex-col items-center">
      <Link to="/" className="self-start p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm mb-6">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 border border-accent-100">
        <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-8 h-8 text-accent-500" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-center text-slate-800 mb-2">Leaderboard</h1>
        <p className="text-center text-slate-500 mb-8 font-mono">Game: {gameCode}</p>

        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
        ) : leaderboard.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No scores yet! Be the first to find the treasure!</p>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, idx) => (
              <div 
                key={entry.id} 
                className={`flex justify-between items-center p-4 rounded-2xl border-2 ${
                   idx === 0 ? "bg-accent-50 border-accent-200" : 
                   idx === 1 ? "bg-slate-50 border-slate-200" : 
                   idx === 2 ? "bg-orange-50 border-orange-200" : 
                   "bg-white border-slate-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-black text-xl w-6 text-center ${
                    idx === 0 ? "text-accent-500" : idx === 1 ? "text-slate-400" : idx === 2 ? "text-orange-400" : "text-slate-300"
                  }`}>
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-slate-700 text-lg">{entry.teamName}</span>
                </div>
                <span className="font-black text-primary-600 text-xl">{entry.score} pts</span>
              </div>
            ))}
          </div>
        )}
        
        <Link to={`/student/play/${gameCode}`} className="mt-8 block w-full text-center text-accent-600 font-bold hover:underline">
          Scan Another Marker
        </Link>
      </div>
    </div>
  );
}
