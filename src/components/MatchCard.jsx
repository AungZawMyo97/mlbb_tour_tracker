import { Link } from "react-router-dom";
import { Clock, Calendar, Trophy } from "lucide-react";
import { Star } from "lucide-react";
import useFavoritesStore from "../stores/favoritesStore";
import { formatMatchDate, formatMatchDateTime } from "../utils/dateFormatter";

function MatchCard({ match }) {
  const isTeam1Favorite = useFavoritesStore((state) =>
    state.isTeamFavorite(match.team1.id)
  );
  const isTeam2Favorite = useFavoritesStore((state) =>
    state.isTeamFavorite(match.team2.id)
  );
  const toggleTeamFavorite = useFavoritesStore(
    (state) => state.toggleTeamFavorite
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "bg-red-500 animate-pulse";
      case "completed":
        return "bg-green-500";
      case "upcoming":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "live":
        return "LIVE";
      case "completed":
        return "COMPLETED";
      case "upcoming":
        return "UPCOMING";
      default:
        return status.toUpperCase();
    }
  };

  return (
    <Link
      to={`/match/${match.id}`}
      className="block glass-effect rounded-xl p-6 hover:bg-slate-700/90 transition-all duration-300 border border-slate-700/50 hover:border-purple-500/50 hover:cyber-glow card-hover shadow-lg"
    >
      {/* Match Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${getStatusColor(
              match.status
            )}`}
          >
            {getStatusText(match.status)}
          </span>
          <span className="text-gray-400 text-sm">{match.round}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Calendar className="w-4 h-4" />
          <span>
            {match.status === "upcoming" && match.scheduledAt
              ? formatMatchDateTime(match.scheduledAt)
              : match.beginAt
              ? formatMatchDateTime(match.beginAt)
              : match.date
              ? formatMatchDate(match.date)
              : "TBA"}
          </span>
        </div>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Team 1 */}
        <Link
          to={`/team/${match.team1.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <img
              src={match.team1.logo}
              alt={match.team1.name}
              className="w-12 h-12 rounded-full border-2 border-slate-600"
            />
            {isTeam1Favorite && (
              <Star className="absolute -top-1 -right-1 w-4 h-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
          <div>
            <p className="font-semibold text-white">{match.team1.name}</p>
          </div>
        </Link>

        {/* Score */}
        <div className="text-center">
          <div className="text-3xl font-bold gradient-purple-blue bg-clip-text text-transparent">
            {match.team1.score} - {match.team2.score}
          </div>
          {match.status === "completed" && (
            <div className="flex items-center justify-center mt-2 space-x-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">
                {match.team1.score > match.team2.score
                  ? match.team1.name
                  : match.team2.name}{" "}
                Wins
              </span>
            </div>
          )}
        </div>

        {/* Team 2 */}
        <Link
          to={`/team/${match.team2.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-3 justify-end hover:opacity-80 transition-opacity"
        >
          <div>
            <p className="font-semibold text-white text-right">
              {match.team2.name}
            </p>
          </div>
          <div className="relative">
            <img
              src={match.team2.logo}
              alt={match.team2.name}
              className="w-12 h-12 rounded-full border-2 border-slate-600"
            />
            {isTeam2Favorite && (
              <Star className="absolute -top-1 -right-1 w-4 h-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
        </Link>
      </div>

      {/* Match Info */}
      <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Best of {match.bestOf}</span>
          {match.games && match.games.length > 0 && (
            <span>{match.games.length} games played</span>
          )}
        </div>
        {match.games && match.games[0] && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{match.games[0].duration}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default MatchCard;
