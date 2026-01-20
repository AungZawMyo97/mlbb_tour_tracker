import { useState } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import MatchCard from "../components/MatchCard";
import { useMatches } from "../hooks/useMatches";
import useTournamentsStore from "../stores/tournamentsStore";

function Matches() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "live" | "completed">(
    "upcoming",
  );

  // Fetch matches based on active tab
  const { matches: upcomingMatches } = useMatches(null, "upcoming");
  const { matches: liveMatches } = useMatches(null, "running");
  const { matches: completedMatches } = useMatches(null, "finished");

  // Get running tournaments
  const getTournamentsByStatus = useTournamentsStore(
    (state) => state.getTournamentsByStatus,
  );
  const runningTournaments = getTournamentsByStatus("ongoing");

  const displayMatches =
    activeTab === "upcoming"
      ? upcomingMatches
      : activeTab === "live"
        ? liveMatches
        : completedMatches;

  return (
    <div className="flex gap-6">
      {/* Sidebar - Running Tournaments */}
      <aside className="w-80 flex-shrink-0">
        <div className="card-bg rounded-2xl p-5 border border-[#1e273b]">
          <div className="flex items-center space-x-2 mb-5">
            <Trophy className="w-5 h-5 text-accent-gold" />
            <h3 className="text-lg font-bold text-white">
              Current Tournaments
            </h3>
          </div>
          <div className="space-y-3">
            {runningTournaments.length > 0 ? (
              runningTournaments.slice(0, 5).map((tournament) => (
                <Link
                  key={tournament.id}
                  to={`/tournament/${tournament.id}`}
                  className="block pb-3 border-b border-[#1e273b] last:border-0 last:pb-0 hover:text-accent-cyan transition-colors"
                >
                  <div className="text-sm font-semibold text-white hover:text-accent-cyan truncate">
                    {tournament.name}
                  </div>
                  {tournament.status && (
                    <div className="text-xs text-accent-gold mt-1">
                      Status:{" "}
                      {tournament.status.charAt(0).toUpperCase() +
                        tournament.status.slice(1)}
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <p className="text-sm text-[#8d95a8]">No running tournaments</p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-accent-cyan hover:text-cyan-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-4xl font-bold text-white">All Matches</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 border-b border-[#1e273b]">
          {(["upcoming", "live", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === tab
                  ? "text-accent-gold border-b-2 border-accent-gold"
                  : "text-[#8d95a8] hover:text-white"
              }`}
            >
              {tab === "upcoming"
                ? "Upcoming"
                : tab === "live"
                  ? "Live"
                  : "Completed"}
            </button>
          ))}
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          {displayMatches.length > 0 ? (
            displayMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-[#8d95a8] text-lg">
                No {activeTab} matches at the moment
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Matches;
