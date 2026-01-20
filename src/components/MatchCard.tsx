import { Link } from "react-router-dom";
import { Calendar, Trophy, Star, Zap } from "lucide-react";
import useFavoritesStore from "../stores/favoritesStore";
import { formatMatchDate, formatMatchDateTime } from "../utils/dateFormatter";
import type { Match } from "../hooks/useMatches";

interface MatchCardProps {
  match: Match;
}

function MatchCard({ match }: MatchCardProps) {
  const isTeam1Favorite = useFavoritesStore((state) =>
    state.isTeamFavorite(match.team1.id),
  );
  const isTeam2Favorite = useFavoritesStore((state) =>
    state.isTeamFavorite(match.team2.id),
  );

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  const getTeamInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link
      to={`/match/${match.id}`}
      className="block card-bg rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-300 card-border border border-[#1e273b] hover:border-accent-cyan/50 hover:shadow-xl hover:shadow-cyan-500/20"
    >
      {/* Match Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${getStatusColor(
              match.status,
            )}`}
          >
            {getStatusText(match.status)}
          </span>
          <span className="text-gray-400 text-xs sm:text-sm">
            {match.round}
          </span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 text-gray-400 text-xs sm:text-sm whitespace-nowrap">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate">
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
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
        {/* Team 1 */}
        <Link
          to={`/team/${match.team1.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-1 sm:space-x-3 hover:opacity-80 transition-opacity min-w-0"
        >
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 sm:w-12 sm:h-12 hexagon hexagon-border-gold p-0.5 flex items-center justify-center">
              {match.team1.logo ? (
                <img
                  src={match.team1.logo}
                  alt={match.team1.name}
                  className="w-full h-full object-cover hexagon"
                />
              ) : (
                <div className="w-full h-full hexagon bg-gradient-to-br from-accent-gold to-yellow-600 flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold text-black">
                    {getTeamInitials(match.team1.name)}
                  </span>
                </div>
              )}
            </div>
            {isTeam1Favorite && (
              <Star className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-xs sm:text-base truncate">
              {match.team1.name}
            </p>
          </div>
        </Link>

        {/* Score */}
        <div className="text-center">
          <div className="text-lg sm:text-3xl font-bold gradient-purple-blue bg-clip-text text-transparent">
            {match.team1.score} - {match.team2.score}
          </div>
          {match.status === "completed" && (
            <div className="flex items-center justify-center mt-1 sm:mt-2 space-x-1">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
              <span className="text-xs text-gray-400 truncate">
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
          className="flex items-center space-x-1 sm:space-x-3 justify-end hover:opacity-80 transition-opacity min-w-0"
        >
          <div className="min-w-0">
            <p className="font-semibold text-white text-xs sm:text-base text-right truncate">
              {match.team2.name}
            </p>
          </div>
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 sm:w-12 sm:h-12 hexagon hexagon-border-cyan p-0.5 flex items-center justify-center">
              {match.team2.logo ? (
                <img
                  src={match.team2.logo}
                  alt={match.team2.name}
                  className="w-full h-full object-cover hexagon"
                />
              ) : (
                <div className="w-full h-full hexagon bg-gradient-to-br from-accent-cyan to-cyan-600 flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold text-black">
                    {getTeamInitials(match.team2.name)}
                  </span>
                </div>
              )}
            </div>
            {isTeam2Favorite && (
              <Star className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
        </Link>
      </div>

      {/* Match Info */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-700 flex items-center justify-between text-xs sm:text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Best of {match.bestOf}</span>
        </div>
      </div>
    </Link>
  );
}

export default MatchCard;
