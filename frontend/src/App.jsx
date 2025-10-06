import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainMenu from "./pages/MainMenu";
import VotingPage from "./pages/VotingPage";
import AuthCallback from "./pages/AuthCallback";
import ScorePage from "./pages/ScorePage"; 

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/vote" element={<VotingPage />} />
        <Route path="/auth/discord/callback" element={<AuthCallback />} />
        <Route path="/scores" element={<ScorePage />} />
      </Routes>
    </Router>
  );
}
