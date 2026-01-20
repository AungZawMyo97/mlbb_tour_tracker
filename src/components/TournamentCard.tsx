import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star } from "lucide-react";
import useFavoritesStore from "../stores/favoritesStore";
import {
  getTournamentStatusColor,
  normalizeTournamentName,
} from "../utils/tournamentUtils";
import { Tournament } from "../stores/tournamentsStore";

interface TournamentCardProps {
  tournament: Tournament;
}

function TournamentCard({ tournament }: TournamentCardProps) {
  const toggleTournamentFavorite = useFavoritesStore(
    (state) => state.toggleTournamentFavorite,
  );
  const isTournamentFavorite = useFavoritesStore(
    (state) => state.isTournamentFavorite,
  );

  return (
    <div className="glass-effect-cyan rounded-xl p-6 transition-all duration-300 card-border-cyan card-hover shadow-xl hover:shadow-2xl hover:cyber-glow-cyan tournament-banner">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-bold text-white">
              {normalizeTournamentName(tournament.name)}
            </h3>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleTournamentFavorite(tournament.id);
              }}
              className="p-1 hover:bg-slate-600 rounded transition-colors"
            >
              <Star
                className={`w-5 h-5 ${
                  isTournamentFavorite(tournament.id)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                }`}
              />
            </button>
          </div>
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${getTournamentStatusColor(
              tournament.status,
            )}`}
          >
            {tournament.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Logo */}
      {tournament.logo && (
        <div className="mb-4 flex justify-center">
          <div className="w-24 h-24 hexagon hexagon-border-gold p-2 flex items-center justify-center">
            <img
              src={tournament.logo}
              alt={tournament.name}
              className="w-full h-full object-contain"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-gray-400 mb-4">{tournament.description}</p>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-gray-300">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {tournament.startDate && tournament.endDate
              ? `${new Date(
                  tournament.startDate,
                ).toLocaleDateString()} - ${new Date(
                  tournament.endDate,
                ).toLocaleDateString()}`
              : tournament.startDate
                ? new Date(tournament.startDate).toLocaleDateString()
                : "TBA"}
          </span>
        </div>
        {tournament.location && tournament.location !== "TBA" && (
          <div className="flex items-center space-x-2 text-gray-300">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{tournament.location}</span>
          </div>
        )}
        {tournament.prizePool && tournament.prizePool !== "TBA" && (
          <div className="flex items-center space-x-2 text-gray-300">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold">
              {tournament.prizePool}
            </span>
          </div>
        )}
      </div>

      {/* Action */}
      <Link
        to={`/tournament/${tournament.id}`}
        className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-yellow-500 via-orange-400 to-orange-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:via-orange-300 hover:to-orange-500 transition-all shadow-lg hover:shadow-2xl hover:cyber-glow-gold"
      >
        View Details
      </Link>
    </div>
  );
}

export default TournamentCard;
