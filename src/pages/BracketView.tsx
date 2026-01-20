import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trophy } from "lucide-react";
import { useMatches } from "../hooks/useMatches";
import useTournamentsStore from "../stores/tournamentsStore";
import { normalizeTournamentName } from "../utils/tournamentUtils";

function BracketView() {
  const { tournamentId } = useParams<{ tournamentId: string }>();

  // Get tournament from store (already fetched at app start)
  const loading = useTournamentsStore((state) => state.loading);
  const findTournamentById = useTournamentsStore(
    (state) => state.findTournamentById,
  );
  const tournament = findTournamentById(tournamentId);

  // Fetch matches for this tournament
  const { matches: tournamentMatches, loading: matchesLoading } = useMatches(
    tournamentId || null,
    null,
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-400">Loading tournament...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Tournament not found</p>
        <Link
          to="/"
          className="text-purple-500 hover:text-purple-400 mt-4 inline-block"
        >
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        to={`/tournament/${tournamentId}`}
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Tournament</span>
      </Link>

      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h1 className="text-3xl font-bold mb-2 gradient-purple-blue bg-clip-text text-transparent">
          {normalizeTournamentName(tournament.name)} - Bracket
        </h1>
        <p className="text-gray-400">Tournament Bracket View</p>
      </div>

      {/* Bracket Visualization */}
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 overflow-x-auto">
        {matchesLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400">Loading bracket...</p>
          </div>
        ) : tournamentMatches.length > 0 ? (
          <div className="space-y-4">
            {tournamentMatches.map((match) => (
              <div
                key={match.id}
                className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1">
                      <p className="text-white font-semibold">
                        {match.team1.name}
                      </p>
                    </div>
                    <div className="text-2xl font-bold gradient-purple-blue bg-clip-text text-transparent">
                      {match.team1.score} - {match.team2.score}
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-white font-semibold">
                        {match.team2.name}
                      </p>
                    </div>
                  </div>
                  {match.status === "completed" && (
                    <div className="ml-4 flex items-center space-x-1 text-yellow-400">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm">
                        {match.team1.score > match.team2.score
                          ? match.team1.name
                          : match.team2.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No matches available for this tournament</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BracketView;
