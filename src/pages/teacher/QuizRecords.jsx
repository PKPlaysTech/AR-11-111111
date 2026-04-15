import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, ArrowUpDown, CheckCircle, XCircle, BarChart } from "lucide-react";
import { getAllQuizRecords } from "../../lib/db";

export default function QuizRecords() {
  const { gameCode } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('timestamp'); // 'timestamp' or 'username'
  const [sortOrder, setSortOrder] = useState('desc');
  const [analytics, setAnalytics] = useState([]);
  const [questionAnalytics, setQuestionAnalytics] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getAllQuizRecords();
        // Filter records for the specific game
        const gameRecords = gameCode ? data.filter(r => r.gameCode === gameCode) : data;
        setRecords(gameRecords);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
      setLoading(false);
    };
    fetchRecords();
  }, [gameCode]);

  useEffect(() => {
    if (records.length === 0) return;
    const statsMap = {};
    const questionStatsMap = {};

    records.forEach(r => {
      const user = r.username || "Unknown";
      if (!statsMap[user]) statsMap[user] = { total: 0, correct: 0 };
      statsMap[user].total += 1;
      if (r.isCorrect) statsMap[user].correct += 1;

      const qId = r.questionId || "Unknown";
      if (!questionStatsMap[qId]) questionStatsMap[qId] = { total: 0, correct: 0, groups: [] };
      questionStatsMap[qId].total += 1;
      if (r.isCorrect) questionStatsMap[qId].correct += 1;
      
      questionStatsMap[qId].groups.push({
        username: user,
        isCorrect: r.isCorrect,
        answer: r.selectedAnswer || "-"
      });
    });

    const parsedStats = Object.keys(statsMap).map(user => {
      const { total, correct } = statsMap[user];
      const rate = total > 0 ? Math.round((correct / total) * 100) : 0;
      return { username: user, total, correct, rate };
    }).sort((a, b) => b.rate - a.rate); // High accuracy first

    const parsedQuestionStats = Object.keys(questionStatsMap).map(qId => {
      const { total, correct, groups } = questionStatsMap[qId];
      const rate = total > 0 ? Math.round((correct / total) * 100) : 0;
      return { questionId: qId, total, correct, rate, groups };
    }).sort((a, b) => a.rate - b.rate); // Hardest questions first

    setAnalytics(parsedStats);
    setQuestionAnalytics(parsedQuestionStats);
  }, [records]);

  const handleSort = (field) => {
    const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);

    const sorted = [...records].sort((a, b) => {
      if (field === 'username') {
        const nameA = a.username.toLowerCase();
        const nameB = b.username.toLowerCase();
        if (nameA < nameB) return order === 'asc' ? -1 : 1;
        if (nameA > nameB) return order === 'asc' ? 1 : -1;
        return 0;
      } else {
        // timestamp
        const timeA = a.timestamp || 0;
        const timeB = b.timestamp || 0;
        return order === 'asc' ? timeA - timeB : timeB - timeA;
      }
    });
    setRecords(sorted);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/teacher" className="inline-flex items-center text-slate-500 mb-6 hover:text-slate-800 font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">Quiz Records</h1>
              {gameCode && <p className="text-sm font-mono text-slate-500 mt-1">Game Code: {gameCode}</p>}
            </div>
            <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl font-bold flex items-center shadow-sm">
              Total Attempts: {records.length}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No quiz records found yet.</p>
            </div>
          ) : (
            <>
              {/* Analytics Chart */}
              <div className="mb-10 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
                  <BarChart className="w-6 h-6 text-primary-500" />
                  Team Accuracy Rate
                </h2>

                <div className="space-y-6">
                  {analytics.map(stat => {
                    let barColor = "bg-green-500 shadow-green-500/30";
                    if (stat.rate < 50) barColor = "bg-red-500 shadow-red-500/30";
                    else if (stat.rate <= 80) barColor = "bg-amber-500 shadow-amber-500/30";

                    return (
                      <div key={stat.username}>
                        <div className="flex justify-between items-center mb-2 text-sm font-bold">
                          <span className="text-slate-700 text-base">{stat.username}</span>
                          <span className="text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200 shadow-inner">
                            {stat.correct} / {stat.total} <span className="text-slate-800 ml-1">({stat.rate}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
                          <div
                            className={`${barColor} h-4 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-all duration-1000 ease-out`}
                            style={{ width: `${stat.rate}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Question Analysis */}
              <div className="mb-10 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
                  <BarChart className="w-6 h-6 text-indigo-500" />
                  Question Analysis
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {questionAnalytics.map(stat => (
                    <div key={stat.questionId} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-slate-800 flex-1 pr-4 break-words">{stat.questionId}</h3>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full shrink-0 ${
                          stat.rate >= 80 ? 'bg-green-100 text-green-700' :
                          stat.rate >= 50 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {stat.rate}% Correct
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Group Responses ({stat.correct}/{stat.total})</p>
                        <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          {stat.groups.map((g, i) => (
                            <div key={i} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 mb-2 last:border-0 last:mb-0 last:pb-0">
                              <span className="text-slate-700 font-medium">{g.username}</span>
                              <div className="flex items-center gap-2 text-right">
                                <span className="text-xs text-slate-500 max-w-[120px] truncate" title={g.answer}>{g.answer}</span>
                                {g.isCorrect ? 
                                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> : 
                                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Records Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                      <th
                        className="p-4 cursor-pointer hover:bg-slate-200 transition-colors w-1/4"
                        onClick={() => handleSort('timestamp')}
                      >
                        <div className="flex items-center gap-1 font-bold">
                          Time <ArrowUpDown className="w-4 h-4 opacity-50" />
                        </div>
                      </th>
                      <th
                        className="p-4 cursor-pointer hover:bg-slate-200 transition-colors w-1/5"
                        onClick={() => handleSort('username')}
                      >
                        <div className="flex items-center gap-1 font-bold">
                          Student Name <ArrowUpDown className="w-4 h-4 opacity-50" />
                        </div>
                      </th>
                      <th className="p-4 font-bold w-1/3">Question</th>
                      <th className="p-4 font-bold w-1/4">Selected Answer</th>
                      <th className="p-4 font-bold text-center w-24">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4 text-sm text-slate-500">
                          {formatDate(record.timestamp)}
                        </td>
                        <td className="p-4 font-bold text-slate-800">
                          {record.username}
                        </td>
                        <td className="p-4 text-slate-700 max-w-xs truncate" title={record.questionId}>
                          {record.questionId}
                        </td>
                        <td className="p-4 text-slate-600 font-medium">
                          {record.selectedAnswer || "-"}
                        </td>
                        <td className="p-4 text-center">
                          {record.isCorrect ? (
                            <div className="inline-flex items-center justify-center bg-green-100 text-green-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center bg-red-100 text-red-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
                              <XCircle className="w-5 h-5" />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
