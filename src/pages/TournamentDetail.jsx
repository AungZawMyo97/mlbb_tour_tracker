import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Trophy, ArrowLeft, Network } from 'lucide-react'
import MatchCard from '../components/MatchCard'
import { useMatches } from '../hooks/useMatches'
import useTournamentsStore from '../stores/tournamentsStore'

function TournamentDetail() {
  const { id } = useParams()
  
  // Get tournament from store (already fetched at app start)
  const loading = useTournamentsStore((state) => state.loading)
  const findTournamentById = useTournamentsStore((state) => state.findTournamentById)
  const tournament = findTournamentById(id)
  
  // Fetch matches for this tournament
  const { matches: tournamentMatches, loading: matchesLoading } = useMatches(id, null)

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-400">Loading tournament...</p>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Tournament not found</p>
        <Link to="/" className="text-purple-500 hover:text-purple-400 mt-4 inline-block">
          Go back home
        </Link>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-500'
      case 'upcoming':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      {/* Tournament Header */}
      <div className="glass-effect rounded-xl p-8 border border-slate-700/50 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-4 gradient-purple-blue bg-clip-text text-transparent drop-shadow-lg">
              {tournament.name.replace(/M5/gi, 'M7')}
            </h1>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white ${getStatusColor(tournament.status)}`}>
              {tournament.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Tournament Logo */}
        {tournament.logo && (
          <div className="mb-6 flex justify-center">
            <img
              src={tournament.logo}
              alt={tournament.name}
              className="w-32 h-32 object-contain rounded-xl bg-slate-700/30 p-4 border border-slate-600/50 shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        )}
        
        <p className="text-gray-300 text-lg mb-6">{tournament.description}</p>

        {/* Tournament Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p className="font-semibold">
                {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-sm text-gray-400">Location</p>
              <p className="font-semibold">{tournament.location}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Prize Pool</p>
              <p className="font-semibold">{tournament.prizePool}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bracket Link */}
      <Link
        to={`/bracket/${tournament.id}`}
        className="block w-full glass-effect rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all hover:cyber-glow card-hover shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Network className="w-8 h-8 text-purple-500" />
            <div>
              <h3 className="text-xl font-bold text-white">View Bracket</h3>
              <p className="text-gray-400">Interactive tournament bracket</p>
            </div>
          </div>
          <div className="text-purple-500 font-semibold">→</div>
        </div>
      </Link>

      {/* Matches Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 gradient-purple-blue bg-clip-text text-transparent">
          Matches
        </h2>

        {matchesLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400">Loading matches...</p>
          </div>
        ) : tournamentMatches.length > 0 ? (
          <div className="space-y-4">
            {tournamentMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No matches scheduled yet</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default TournamentDetail
