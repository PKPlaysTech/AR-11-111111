import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, List, Trophy, Copy, Loader2, Edit, Trash2 } from "lucide-react";
import { getAllGames, deleteGame } from "../../lib/db";

export default function TeacherDashboard() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      const g = await getAllGames();
      setGames(g);
      setLoading(false);
    };
    fetchGames();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Code ${code} copied to clipboard!`);
  };

  const handleDelete = async (code) => {
    const password = prompt("Warning: You are about to delete this game. Enter Admin Password:");
    
    if (password !== "PK2026") {
      alert("Incorrect password. Delete cancelled.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this game? This action cannot be undone.")) {
      try {
        await deleteGame(code);
        setGames(games.filter((g) => g.id !== code));
        alert("Game deleted successfully.");
      } catch (error) {
        console.error("Error deleting game:", error);
        alert("Failed to delete game.");
      }
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary-600 flex items-center gap-2">
            AR Learning Quest <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Teacher Mode</span>
          </Link>
          <nav className="flex gap-4 items-center">
             {/* Nav items */}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">My Games</h1>
          <Link to="/teacher/new" className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
            <PlusCircle className="w-5 h-5" />
            Create New Game
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
          </div>
        ) : games.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <List className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">No games yet</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">You haven't created any AR treasure hunts! Click the button above to design your first magical learning adventure.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <div key={game.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{game.title || "Untitled Game"}</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-3">
                  Updated: {formatTime(game.updatedAt || game.createdAt)}
                </p>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{game.questions?.[0]?.question || "No questions yet"}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Game Code</span>
                    <span className="font-mono text-xl font-black text-primary-600 tracking-widest">{game.code}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      to={`/teacher/edit/${game.code}`}
                      className="p-2 bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
                      title="Edit Game"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(game.code)}
                      className="p-2 bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete Game"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleCopy(game.code)}
                      className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Copy Code"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <Link 
                      to={`/student/leaderboard/${game.code}`}
                      className="p-2 bg-accent-100 text-accent-600 hover:bg-accent-200 rounded-lg transition-colors"
                      title="View Leaderboard"
                    >
                      <Trophy className="w-5 h-5" />
                    </Link>
                    <Link 
                      to={`/teacher/records/${game.code}`}
                      className="p-2 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-colors"
                      title="Quiz Records"
                    >
                      <List className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
