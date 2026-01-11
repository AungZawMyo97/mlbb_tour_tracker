import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Calendar, MapPin, Trophy, Star } from 'lucide-react'
import useFavoritesStore from '../stores/favoritesStore'

function HeroCarousel({ tournaments }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const featuredTournaments = tournaments.filter(t => t.featured)
  
  const toggleTournamentFavorite = useFavoritesStore((state) => state.toggleTournamentFavorite)
  const isTournamentFavorite = useFavoritesStore((state) => state.isTournamentFavorite)

  useEffect(() => {
    if (featuredTournaments.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredTournaments.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [featuredTournaments.length])

  if (featuredTournaments.length === 0) return null

  const currentTournament = featuredTournaments[currentIndex]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredTournaments.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredTournaments.length) % featuredTournaments.length)
  }

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl">
      {/* Background Image/Overlay */}
      <div className="absolute inset-0 gradient-purple-blue opacity-95">
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.3),transparent_50%)]"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-between px-8">
        {/* Previous Button */}
        {featuredTournaments.length > 1 && (
          <button
            onClick={prevSlide}
            className="z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Tournament Info */}
        <div className="flex-1 text-center text-white px-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
              <div className="absolute inset-0 bg-yellow-400/30 blur-xl"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">{currentTournament.name.replace(/M5/g, 'M7').replace(/m5/gi, 'M7')}</h1>
            <button
              onClick={(e) => {
                e.preventDefault()
                toggleTournamentFavorite(currentTournament.id)
              }}
              className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Star
                className={`w-6 h-6 ${
                  isTournamentFavorite(currentTournament.id)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-white'
                }`}
              />
            </button>
          </div>
          
          <p className="text-xl text-gray-200 mb-6 max-w-2xl mx-auto">
            {currentTournament.description}
          </p>

          <div className="flex items-center justify-center space-x-6 text-gray-200 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(currentTournament.startDate).toLocaleDateString()} - {new Date(currentTournament.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>{currentTournament.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">{currentTournament.prizePool}</span>
            </div>
          </div>

          <Link
            to={`/tournament/${currentTournament.id}`}
            className="inline-block px-8 py-3 gradient-purple-blue rounded-xl font-semibold hover:gradient-purple-blue-hover transition-all transform hover:scale-105 cyber-glow shadow-lg"
          >
            View Tournament
          </Link>
        </div>

        {/* Next Button */}
        {featuredTournaments.length > 1 && (
          <button
            onClick={nextSlide}
            className="z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6 text-white" />
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
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default HeroCarousel
