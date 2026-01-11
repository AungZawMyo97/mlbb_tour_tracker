import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Trophy } from 'lucide-react'
import { useMatches } from '../hooks/useMatches'
import useTournamentsStore from '../stores/tournamentsStore'

function BracketView() {
  const { tournamentId } = useParams()
  const [selectedMatch, setSelectedMatch] = useState(null)
  
  // Get tournament from store (already fetched at app start)
  const loading = useTournamentsStore((state) => state.loading)
  const findTournamentById = useTournamentsStore((state) => state.findTournamentById)
  const tournament = findTournamentById(tournamentId)
  
  // Fetch matches for this tournament
  const { matches: tournamentMatches, loading: matchesLoading } = useMatches(tournamentId, null)

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

  // Simple bracket structure for demonstration
  // In a real app, you'd have a more complex bracket algorithm
  const bracketRounds = ['Quarter-Finals', 'Semi-Finals', 'Grand Finals']
  const organizedMatches = bracketRounds.map(round => 
    tournamentMatches.filter(m => m.round === round)
  )

  const getTeamLogo = (teamId) => {
    // Use logo from match data if available
    const match = tournamentMatches.find(m => 
      m.team1.id === teamId || m.team2.id === teamId
    )
    if (match) {
      return match.team1.id === teamId ? match.team1.logo : match.team2.logo
    }
    return 'https://via.placeholder.com/50'
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
          {tournament.name} - Bracket
        </h1>
        <p className="text-gray-400">Double Elimination Tournament Bracket</p>
      </div>

      {/* Bracket Visualization */}
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 overflow-x-auto">
        {matchesLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400">Loading bracket...</p>
          </div>
        ) : (
          <div className="flex space-x-8 min-w-max">
            {organizedMatches.map((roundMatches, roundIndex) => (
            <div key={roundIndex} className="flex flex-col space-y-8 min-w-[300px]">
              {/* Round Header */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white">{bracketRounds[roundIndex]}</h3>
              </div>

              {/* Matches in this round */}
              <div className="flex flex-col space-y-4">
                {roundMatches.map((match, matchIndex) => (
                  <div
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className="bg-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-600 transition-all border border-slate-600 hover:border-purple-500"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">{match.round}</span>
                      {match.status === 'completed' && (
                        <Trophy className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>

                    {/* Team 1 */}
                    <Link
                      to={`/team/${match.team1.id}`}
                      className="flex items-center space-x-2 mb-2 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={getTeamLogo(match.team1.id)}
                        alt={match.team1.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className={`flex-1 text-sm ${
                        match.team1.score > match.team2.score ? 'font-bold text-white' : 'text-gray-400'
                      }`}>
                        {match.team1.name}
                      </span>
                      <span className="font-bold">{match.team1.score}</span>
                    </Link>

                    {/* Team 2 */}
                    <Link
                      to={`/team/${match.team2.id}`}
                      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={getTeamLogo(match.team2.id)}
                        alt={match.team2.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className={`flex-1 text-sm ${
                        match.team2.score > match.team1.score ? 'font-bold text-white' : 'text-gray-400'
                      }`}>
                        {match.team2.name}
                      </span>
                      <span className="font-bold">{match.team2.score}</span>
                    </Link>

                    {/* Status Badge */}
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        match.status === 'live' ? 'bg-red-500' :
                        match.status === 'completed' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}>
                        {match.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">{selectedMatch.round}</h3>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to={`/team/${selectedMatch.team1.id}`}
                  className="text-center hover:opacity-80 transition-opacity group"
                >
                  <img
                    src={getTeamLogo(selectedMatch.team1.id)}
                    alt={selectedMatch.team1.name}
                    className="w-16 h-16 rounded-full mx-auto mb-2 group-hover:scale-110 transition-transform"
                  />
                  <p className="font-bold group-hover:text-purple-400 transition-colors">{selectedMatch.team1.name}</p>
                  <p className="text-2xl font-bold">{selectedMatch.team1.score}</p>
                </Link>
                <Link
                  to={`/team/${selectedMatch.team2.id}`}
                  className="text-center hover:opacity-80 transition-opacity group"
                >
                  <img
                    src={getTeamLogo(selectedMatch.team2.id)}
                    alt={selectedMatch.team2.name}
                    className="w-16 h-16 rounded-full mx-auto mb-2 group-hover:scale-110 transition-transform"
                  />
                  <p className="font-bold group-hover:text-blue-400 transition-colors">{selectedMatch.team2.name}</p>
                  <p className="text-2xl font-bold">{selectedMatch.team2.score}</p>
                </Link>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <Link
                  to={`/match/${selectedMatch.id}`}
                  className="block w-full text-center px-4 py-2 gradient-purple-blue rounded-lg font-semibold hover:gradient-purple-blue-hover transition-all"
                >
                  View Full Match Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BracketView
