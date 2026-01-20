import { Link } from "react-router-dom";
import { useTeams } from "../hooks/useTeams";
import { Users, MapPin, Trophy, ArrowRight } from "lucide-react";
import type { Team } from "../hooks/useTeams";

function Teams() {
  const { teams, loading, error } = useTeams();

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Header Section */}
      <div className="relative py-8 sm:py-12 px-4 sm:px-6 rounded-2xl sm:rounded-3xl overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="relative z-10 text-center space-y-2 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-purple-blue bg-clip-text text-transparent drop-shadow-2xl tracking-tight px-2">
            Pro Teams
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed px-2">
            Explore the elite organizations competing for glory in the Land of
            Dawn.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-purple-300 animate-pulse font-medium">
            Summoning Teams...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-xl mx-auto bg-red-500/10 border border-red-500/50 rounded-2xl p-8 text-center backdrop-blur-sm">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-red-400 font-bold text-lg mb-2">
            Connection Severed
          </p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Teams Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {teams.map((team: Team) => (
            <Link
              key={team.id}
              to={`/team/${team.id}`}
              className="group relative flex flex-col h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl border border-slate-700/50 group-hover:border-purple-500/50 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-purple-500/20"></div>

              {/* Card Content */}
              <div className="relative p-6 flex flex-col items-center h-full z-10 transition-transform duration-500 group-hover:-translate-y-2">
                {/* Logo Container */}
                <div className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 mb-4 sm:mb-6 relative group-hover:scale-110 transition-transform duration-500 mx-auto">
                  <div className="absolute inset-0 bg-gradient-purple-blue blur-2xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
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
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-4xl font-bold relative z-10 border border-slate-600 shadow-inner">
                      <span className="gradient-purple-blue bg-clip-text text-transparent">
                        {team.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Team Info */}
                <div className="text-center w-full mt-auto">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300 truncate px-2 line-clamp-2">
                    {team.name}
                  </h3>

                  <div className="h-px w-12 bg-slate-700 mx-auto my-4 group-hover:w-full group-hover:bg-purple-500/30 transition-all duration-500"></div>

                  <div className="flex items-center justify-center space-x-3 sm:space-x-6 text-xs sm:text-sm text-gray-400">
                    {team.region && team.region !== "Unknown" && (
                      <div className="flex items-center space-x-1.5 group-hover:text-purple-300 transition-colors">
                        <MapPin className="w-4 h-4" />
                        <span>{team.region}</span>
                      </div>
                    )}
                    {team.players && team.players.length > 0 ? (
                      <div className="flex items-center space-x-1.5 group-hover:text-blue-300 transition-colors">
                        <Users className="w-4 h-4" />
                        <span>{team.players.length}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 group-hover:text-blue-300 transition-colors">
                        <Trophy className="w-4 h-4" />
                        <span>Pro</span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button (appears on hover) */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                    <span className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-400 hover:text-purple-300">
                      <span>View Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && teams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-slate-800/30 rounded-3xl border border-slate-700/50 border-dashed">
          <Users className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-xl">No teams found in this realm.</p>
        </div>
      )}
    </div>
  );
}

export default Teams;
