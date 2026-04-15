import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import GameEditor from "./pages/teacher/GameEditor";
import StudentJoin from "./pages/student/StudentJoin";
import ARScanner from "./pages/student/ARScanner";
import Leaderboard from "./pages/student/Leaderboard";
import QuizRecords from "./pages/teacher/QuizRecords";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/new" element={<GameEditor />} />
        <Route path="/teacher/edit/:gameCode" element={<GameEditor />} />
        <Route path="/student" element={<StudentJoin />} />
        <Route path="/student/play/:gameCode" element={<ARScanner />} />
        <Route path="/student/leaderboard/:gameCode" element={<Leaderboard />} />
        <Route path="/teacher/records/:gameCode" element={<QuizRecords />} />
      </Routes>
    </Router>
  );
}

export default App;
