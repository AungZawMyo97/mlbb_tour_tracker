import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Trophy,
  Star,
} from "lucide-react";
import useFavoritesStore from "../stores/favoritesStore";
import { normalizeTournamentName } from "../utils/tournamentUtils";
import { Tournament } from "../stores/tournamentsStore";

interface HeroCarouselProps {
  tournaments: Tournament[];
}

function HeroCarousel({ tournaments }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredTournaments = tournaments.filter((t) => t.featured);

  const toggleTournamentFavorite = useFavoritesStore(
    (state) => state.toggleTournamentFavorite,
  );
  const isTournamentFavorite = useFavoritesStore(
    (state) => state.isTournamentFavorite,
  );

  useEffect(() => {
    if (featuredTournaments.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredTournaments.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredTournaments.length]);

  if (featuredTournaments.length === 0) return null;

  const currentTournament = featuredTournaments[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredTournaments.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + featuredTournaments.length) % featuredTournaments.length,
    );
  };

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl border-2 border-accent-gold glow-gold mb-8">
      {/* Background with gold/orange gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-accent-gold/10 to-amber-700/20">
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-between px-4 sm:px-6 md:px-8 gap-2 sm:gap-4">
        {/* Previous Button */}
        {featuredTournaments.length > 1 && (
          <button
            onClick={prevSlide}
            className="z-10 p-1 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </button>
        )}

        {/* Tournament Info */}
        <div className="flex-1 text-center text-white px-2 sm:px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2 sm:mb-4">
            <div className="relative">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-yellow-400 drop-shadow-lg" />
              <div className="absolute inset-0 bg-yellow-400/30 blur-xl"></div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg line-clamp-2">
              {normalizeTournamentName(currentTournament.name)}
            </h1>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleTournamentFavorite(currentTournament.id);
              }}
              className="ml-2 sm:ml-4 p-1 sm:p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
            >
              <Star
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  isTournamentFavorite(currentTournament.id)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-white"
                }`}
              />
            </button>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-gray-200 mb-3 sm:mb-4 md:mb-6 max-w-2xl mx-auto line-clamp-2 px-2">
            {currentTournament.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 space-y-1 sm:space-y-0 text-gray-200 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>
                {new Date(currentTournament.startDate).toLocaleDateString()} -{" "}
                {new Date(currentTournament.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{currentTournament.location}</span>
            </div>
            {currentTournament.prizePool !== "TBA" && (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-bold">{currentTournament.prizePool}</span>
              </div>
            )}
          </div>

          <Link
            to={`/tournament/${currentTournament.id}`}
            className="inline-block px-4 sm:px-6 md:px-8 py-2 sm:py-3 gradient-purple-blue rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:gradient-purple-blue-hover transition-all transform hover:scale-105 cyber-glow shadow-lg"
          >
            View Tournament
          </Link>
        </div>

        {/* Next Button */}
        {featuredTournaments.length > 1 && (
          <button
            onClick={nextSlide}
            className="z-10 p-1 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </button>
        )}
      </div>

      {/* Indicators */}
      {featuredTournaments.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredTournaments.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroCarousel;
