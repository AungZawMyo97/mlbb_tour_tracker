import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Trophy } from "lucide-react";
import { useTeams } from "../hooks/useTeams";
import { useMatches } from "../hooks/useMatches";
import useFavoritesStore from "../stores/favoritesStore";
import MatchCard from "../components/MatchCard";

function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const { teams, loading, error } = useTeams(id || null);
  const { matches: teamMatches, loading: matchesLoading } = useMatches(
    null,
    null,
  );

  // Get first team from teams array
  const team = Array.isArray(teams) && teams.length > 0 ? teams[0] : null;

  const toggleTeamFavorite = useFavoritesStore(
    (state) => state.toggleTeamFavorite,
  );
  const isTeamFavorite = useFavoritesStore((state) => state.isTeamFavorite);

  // Filter matches where this team participated
  const filteredMatches = teamMatches
    .filter((m) => m.team1.id === id || m.team2.id === id)
    .sort((a, b) => {
      const dateA = a.beginAt || a.date || a.endAt || "";
      const dateB = b.beginAt || b.date || b.endAt || "";
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  // Calculate team stats from matches
  const wins = filteredMatches.filter((m) => {
    if (m.status !== "completed") return false;
    const isTeam1 = m.team1.id === id;
    return isTeam1
      ? m.team1.score > m.team2.score
      : m.team2.score > m.team1.score;
  }).length;

  const losses = filteredMatches.filter((m) => {
    if (m.status !== "completed") return false;
    const isTeam1 = m.team1.id === id;
    return isTeam1
      ? m.team1.score < m.team2.score
      : m.team2.score < m.team1.score;
  }).length;

  const totalMatches = filteredMatches.filter(
    (m) => m.status === "completed",
  ).length;
  const winRate =
    totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-purple-300 animate-pulse font-medium">
          Summoning Team Details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="max-w-md p-8 bg-red-500/10 border border-red-500/50 rounded-2xl">
          <p className="text-red-400 font-bold text-xl mb-2">
            Error Loading Team
          </p>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to="/teams"
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
          >
            Return to Teams
          </Link>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-gray-400 text-xl mb-6">Team not found</p>
        <Link
          to="/teams"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg shadow-purple-500/20"
        >
          Browse Teams
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12 pb-12">
      {/* Back Button */}
      <Link
        to="/teams"
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-all hover:-translate-x-1 text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Back to Teams</span>
      </Link>

      {/* Team Header with Logo */}
      <div className="glass-effect rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-8 border border-slate-700/50 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-3 sm:gap-4 md:gap-6 items-start">
          {/* Team Logo */}
          <div className="flex justify-center md:justify-start">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 relative">
              <div className="absolute inset-0 bg-gradient-purple-blue blur-2xl rounded-full opacity-30"></div>
              {team.logo ? (
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-full h-full object-contain relative z-10 drop-shadow-xl"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold relative z-10 border border-slate-600 shadow-inner">
                  <span className="gradient-purple-blue bg-clip-text text-transparent">
                    {team.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Team Info */}
          <div className="text-center md:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 md:mb-4 text-white line-clamp-2">
              {team.name}
            </h1>
            {team.region && (
              <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-400 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 md:mb-4">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span>{team.region}</span>
              </div>
            )}
            {team.players && team.players.length > 0 && (
              <div className="text-xs sm:text-sm text-gray-500">
                {team.players.length} player
                {team.players.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => toggleTeamFavorite(team.id)}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-slate-700/50 rounded-lg transition-all self-start"
          >
            <Trophy
              className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                isTeamFavorite(team.id)
                  ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
            />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-6 mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 md:pt-8 border-t border-slate-700/50">
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-2 sm:p-3 md:p-4 text-center border border-purple-500/20 hover:border-purple-500/50 transition-colors">
            <p className="text-gray-400 text-xs font-medium">Total Matches</p>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-300 mt-1 sm:mt-2">
              {totalMatches}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-2 sm:p-3 md:p-4 text-center border border-blue-500/20 hover:border-blue-500/50 transition-colors">
            <p className="text-gray-400 text-xs font-medium">Win Rate</p>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold text-cyan-300 mt-1 sm:mt-2">
              {winRate}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg p-2 sm:p-3 md:p-4 text-center border border-emerald-500/20 hover:border-emerald-500/50 transition-colors">
            <p className="text-gray-400 text-xs font-medium">W-L Record</p>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold text-emerald-300 mt-1 sm:mt-2">
              {wins}-{losses}
            </p>
          </div>
        </div>
      </div>

      {/* Players */}
      {team.players && team.players.length > 0 && (
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white flex items-center space-x-3">
            <div className="w-1 h-8 bg-gradient-purple-blue rounded"></div>
            <span>Roster</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {team.players.map((player, index) => (
              <div
                key={player.id}
                className="group relative glass-effect rounded-lg p-4 sm:p-5 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs sm:text-sm font-bold text-purple-400">
                        #{index + 1}
                      </span>
                      <p className="text-white font-bold text-sm sm:text-base line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                        {player.name}
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm capitalize bg-slate-800/50 w-fit px-2 py-1 rounded">
                      {player.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Matches */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white flex items-center space-x-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded"></div>
          <span>Recent Matches</span>
        </h2>
        {matchesLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400">Loading matches...</p>
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {filteredMatches.slice(0, 10).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-lg border border-slate-700/50">
            <p className="text-gray-400">No matches found for this team</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default TeamDetail;
