import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Loader2 } from "lucide-react";
import { createGame, getGame, updateGame } from "../../lib/db";

export default function GameEditor() {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!gameCode);
  const [game, setGame] = useState({
    title: "",
    questions: [
      {
        markerId: 1,
        question: "",
        imageUrl: "",
        audioUrl: "",
        points: 100,
        options: { a: "", b: "", c: "", d: "" },
        correctOption: "a"
      }
    ]
  });

  useEffect(() => {
    if (gameCode) {
      const fetchGame = async () => {
        const data = await getGame(gameCode);
        if (data) {
          // Normalize questions if needed (backward compatibility)
          let qs = data.questions;
          if (!qs && data.question) {
            qs = [{
              markerId: 1, 
              question: data.question, 
              points: data.points || 100, 
              options: data.options, 
              correctOption: data.correctOption 
            }];
          }
          setGame({ title: data.title || "", questions: qs || [] });
        }
        setInitialLoading(false);
      };
      fetchGame();
    }
  }, [gameCode]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    // 1. This is your "Key In" place!
    const adminPassword = prompt("Enter Admin Password to Save Changes:");
    
    // 2. Check the "Secret Key"
    if (adminPassword !== "PK2026") {
      alert("Wrong Password! Access Denied.");
      return;
    }

    setLoading(true);
    try {
      if (gameCode) {
        await updateGame(gameCode, game);
        alert(`Game updated successfully!`);
      } else {
        const newGameCode = await createGame(game);
        alert(`Game created! Your code is: ${newGameCode}`);
      }
      navigate("/teacher");
    } catch (error) {
      console.error("Error saving game", error);
      alert(`Error saving game: ${error.message}`);
    }
    setLoading(false);
  };

  const addQuestion = () => {
    const nextMarkerId = game.questions.length + 1;
    setGame({
      ...game,
      questions: [
        ...game.questions,
        {
          markerId: nextMarkerId,
          question: "",
          imageUrl: "",
          audioUrl: "",
          points: 100,
          options: { a: "", b: "", c: "", d: "" },
          correctOption: "a"
        }
      ]
    });
  };

  const removeLastQuestion = () => {
    if (game.questions.length <= 1) return;
    const newQ = [...game.questions];
    newQ.pop();
    setGame({ ...game, questions: newQ });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...game.questions];
    newQuestions[index][field] = value;
    setGame({ ...game, questions: newQuestions });
  };

  const updateOption = (index, optKey, value) => {
    const newQuestions = [...game.questions];
    newQuestions[index].options[optKey] = value;
    setGame({ ...game, questions: newQuestions });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <Link to="/teacher" className="inline-flex items-center text-slate-500 mb-6 hover:text-slate-800">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          {initialLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-slate-800 mb-8">
                {gameCode ? "Edit AR interactive quest" : "AR interactive quest"}
              </h1>
              
              <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Game Title</label>
              <input 
                type="text" required
                value={game.title} onChange={e => setGame({...game, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:outline-none"
                placeholder="e.g. Science Chapter 1"
              />
            </div>
            
            {game.questions.map((q, index) => (
              <div key={index} className="bg-primary-50 p-6 rounded-2xl border border-primary-100 relative">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-slate-800">Marker {q.markerId} Setup</h2>
                  {game.questions.length > 1 && index === game.questions.length - 1 && (
                    <button 
                      type="button" 
                      onClick={removeLastQuestion}
                      className="text-red-500 hover:text-red-700 text-sm font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-500 mb-6">Linked to image: <code className="bg-white px-1 py-0.5 rounded">public/markers/marker{q.markerId}.patt</code></p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Question</label>
                    <textarea required
                      value={q.question} onChange={e => updateQuestion(index, 'question', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:outline-none"
                      placeholder="e.g. What does a panda eat?"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Image URL (Optional)</label>
                    <input type="text"
                      value={q.imageUrl || ""} onChange={e => updateQuestion(index, 'imageUrl', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:outline-none"
                      placeholder="e.g. https://github.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Audio URL (Optional)</label>
                    <input type="text"
                      value={q.audioUrl || ""} onChange={e => updateQuestion(index, 'audioUrl', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:outline-none"
                      placeholder="e.g. https://github.com/..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Initial Points</label>
                    <input type="number" required min="10"
                      value={q.points} onChange={e => updateQuestion(index, 'points', parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {['a', 'b', 'c', 'd'].map(opt => (
                      <div key={opt}>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Option {opt.toUpperCase()}</label>
                        <input type="text" required
                          value={q.options[opt]} onChange={e => updateOption(index, opt, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:outline-none"
                          placeholder={`Option ${opt.toUpperCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Correct Answer</label>
                    <select 
                      value={q.correctOption} onChange={e => updateQuestion(index, 'correctOption', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:outline-none bg-white"
                    >
                      <option value="a">Option A</option>
                      <option value="b">Option B</option>
                      <option value="c">Option C</option>
                      <option value="d">Option D</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button 
              type="button" 
              onClick={addQuestion}
              className="w-full border-2 border-dashed border-primary-300 text-primary-600 hover:bg-primary-50 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" /> Add Another Question
            </button>
            
            <button 
              type="submit" disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50 mt-8"
            >
              {loading ? "Saving..." : <><Save className="w-5 h-5" /> {gameCode ? "Save Changes" : "Publish Game"}</>}
            </button>
          </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
