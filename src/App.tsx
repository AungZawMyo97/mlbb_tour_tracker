import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TournamentDetail from "./pages/TournamentDetail";
import MatchDetail from "./pages/MatchDetail";
import BracketView from "./pages/BracketView";
import TeamDetail from "./pages/TeamDetail";
import Teams from "./pages/Teams";
import Matches from "./pages/Matches";
import useTournamentsStore from "./stores/tournamentsStore";
import useLeaguesStore from "./stores/leaguesStore";

function App() {
  const fetchAllTournaments = useTournamentsStore(
    (state) => state.fetchAllTournaments,
  );
  const fetchAllLeagues = useLeaguesStore((state) => state.fetchAllLeagues);

  // Fetch all leagues first, then tournaments (so tournaments can use league data)
  useEffect(() => {
    const initializeData = async () => {
      // Fetch leagues first
      await fetchAllLeagues();

      // Wait a bit for leagues to be stored, then fetch tournaments
      // This ensures league data is available when transforming tournaments
      setTimeout(() => {
        fetchAllTournaments();
      }, 200);
    };
    initializeData();
  }, [fetchAllLeagues, fetchAllTournaments]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/tournament/:id" element={<TournamentDetail />} />
          <Route path="/match/:id" element={<MatchDetail />} />
          <Route path="/bracket/:tournamentId" element={<BracketView />} />
          <Route path="/team/:id" element={<TeamDetail />} />
          <Route path="/teams" element={<Teams />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
