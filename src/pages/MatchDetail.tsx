import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { useMatches } from "../hooks/useMatches";
import { formatMatchDateTime, formatMatchDate } from "../utils/dateFormatter";

function MatchDetail() {
  const { id } = useParams<{ id: string }>();

  // Fetch all matches to find the one we need
  const { matches: allMatches, loading: matchesLoading } = useMatches(
    null,
    null,
  );
  const match = allMatches.find(
    (m) => m.id === id || m._apiData?.id?.toString() === id,
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

  if (matchesLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-400">Loading match...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Match not found</p>
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
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Back to Home</span>
      </Link>

      {/* Match Header */}
      <div className="glass-effect rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 border border-slate-700/50 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <div className="w-full md:w-auto">
            <span
              className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white ${getStatusColor(
                match.status,
              )} mb-3 sm:mb-4`}
            >
              {match.status.toUpperCase()}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-white">
              {match.round}
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mb-2">
              Best of {match.bestOf}
            </p>
            {match.date && (
              <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">
                  {match.status === "upcoming" && match.scheduledAt
                    ? `Scheduled: ${formatMatchDateTime(match.scheduledAt)}`
                    : match.beginAt
                      ? `Started: ${formatMatchDateTime(match.beginAt)}`
                      : formatMatchDate(match.date)}
                </span>
              </div>
            )}
          </div>
          <div className="w-full md:w-auto md:text-right">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-purple-blue bg-clip-text text-transparent mb-2">
              {match.team1.score} - {match.team2.score}
            </div>
            {match.status === "completed" && (
              <div className="flex items-center justify-start md:justify-end space-x-2 text-yellow-400 text-xs sm:text-sm">
                <span className="font-semibold">
                  {match.team1.score > match.team2.score
                    ? match.team1.name
                    : match.team2.name}{" "}
                  Wins
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Team 1 */}
        <Link
          to={`/team/${match.team1.id}`}
          className="group glass-effect rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            {match.team1.logo && (
              <img
                src={match.team1.logo}
                alt={match.team1.name}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-slate-600 object-cover flex-shrink-0 group-hover:scale-110 transition-transform"
              />
            )}
            <div className="min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">Team 1</p>
              <p className="text-white font-bold text-sm sm:text-base md:text-lg line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                {match.team1.name}
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400 mt-1">
                {match.team1.score}
              </p>
            </div>
          </div>
        </Link>

        {/* Team 2 */}
        <Link
          to={`/team/${match.team2.id}`}
          className="group glass-effect rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
        >
          <div className="flex items-center space-x-3 sm:space-x-4 flex-row-reverse">
            {match.team2.logo && (
              <img
                src={match.team2.logo}
                alt={match.team2.name}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-slate-600 object-cover flex-shrink-0 group-hover:scale-110 transition-transform"
              />
            )}
            <div className="min-w-0 text-right">
              <p className="text-gray-400 text-xs sm:text-sm">Team 2</p>
              <p className="text-white font-bold text-sm sm:text-base md:text-lg line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all">
                {match.team2.name}
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400 mt-1">
                {match.team2.score}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default MatchDetail;
