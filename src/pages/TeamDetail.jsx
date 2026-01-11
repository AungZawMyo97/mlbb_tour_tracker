import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, Star, Trophy, Calendar, Swords, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { useTeams } from '../hooks/useTeams'
import { useMatches } from '../hooks/useMatches'
import useFavoritesStore from '../stores/favoritesStore'
import MatchCard from '../components/MatchCard'

function TeamDetail() {
  const { id } = useParams()
  const { teams, loading, error } = useTeams(id)
  const { matches: teamMatches, loading: matchesLoading } = useMatches(null, null)

  // useTeams always returns an array, get first element when teamId is provided
  const team = Array.isArray(teams) && teams.length > 0 ? teams[0] : null

  const toggleTeamFavorite = useFavoritesStore((state) => state.toggleTeamFavorite)
  const isTeamFavorite = useFavoritesStore((state) => state.isTeamFavorite)

  // Filter matches where this team participated
  const filteredMatches = teamMatches.filter(
    m => m.team1.id === id || m.team2.id === id
  ).sort((a, b) => {
    const dateA = a.beginAt || a.date || a.endAt || ''
    const dateB = b.beginAt || b.date || b.endAt || ''
    if (!dateA && !dateB) return 0
    if (!dateA) return 1
    if (!dateB) return -1
    return new Date(dateB) - new Date(dateA)
  })

  // Calculate team stats from matches
  const wins = filteredMatches.filter(m => {
    if (m.status !== 'completed') return false
    const isTeam1 = m.team1.id === id
    return isTeam1 ? m.team1.score > m.team2.score : m.team2.score > m.team1.score
  }).length

  const losses = filteredMatches.filter(m => {
    if (m.status !== 'completed') return false
    const isTeam1 = m.team1.id === id
    return isTeam1 ? m.team1.score < m.team2.score : m.team2.score < m.team1.score
  }).length

  const totalMatches = filteredMatches.filter(m => m.status === 'completed').length
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-purple-300 animate-pulse font-medium">Summoning Team Details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="max-w-md p-8 bg-red-500/10 border border-red-500/50 rounded-2xl">
          <p className="text-red-400 font-bold text-xl mb-2">Error Loading Team</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/teams" className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30">
            Return to Teams
          </Link>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-gray-400 text-xl mb-6">Team not found</p>
        <Link to="/teams" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg shadow-purple-500/20">
          Browse Teams
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-fadeIn pb-12">
      {/* Back Button */}
      <Link
        to="/teams"
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-all hover:-translate-x-1"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Teams</span>
      </Link>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20 border border-slate-700/50">
        {/* Banner Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://cdn.pandascore.co/images/league/image/4302/MWI_2023.png')] bg-cover bg-center opacity-10 blur-md mix-blend-overlay"></div>

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Logo */}
            <div className="relative group">
              <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full scale-90 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-slate-800/80 backdrop-blur-xl p-6 border border-slate-700 shadow-2xl">
                {team.logo ? (
                  <img src={team.logo} alt={team.name} className="w-full h-full object-contain drop-shadow-lg" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-bold gradient-purple-blue bg-clip-text text-transparent">
                    {team.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Team Name and Quick Stats */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 justify-between">
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-md">
                    {team.name}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-gray-300">
                    {team.region && team.region !== 'Unknown' && (
                      <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span>{team.region}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>Pro Team</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleTeamFavorite(team.id)}
                  className="p-3 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md rounded-xl border border-slate-600 transition-all hover:scale-105 active:scale-95 group"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${isTeamFavorite(team.id)
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                        : 'text-gray-400 group-hover:text-yellow-200'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 flex items-center justify-between group hover:border-green-500/30 transition-colors">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Total Wins</p>
                <p className="text-3xl font-bold text-green-400 mt-1">{wins}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500/20 group-hover:text-green-500/50 transition-colors" />
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 flex items-center justify-between group hover:border-red-500/30 transition-colors">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Total Losses</p>
                <p className="text-3xl font-bold text-red-400 mt-1">{losses}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500/20 group-hover:text-red-500/50 transition-colors" />
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 flex items-center justify-between group hover:border-purple-500/30 transition-colors">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Win Rate</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">{winRate}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-500/20 group-hover:text-purple-500/50 transition-colors" />
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 flex items-center justify-between group hover:border-blue-500/30 transition-colors">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Matches</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">{totalMatches}</p>
              </div>
              <Swords className="w-8 h-8 text-blue-500/20 group-hover:text-blue-500/50 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Roster */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Users className="w-6 h-6 text-purple-500" />
            <span>Active Roster</span>
          </h2>

          <div className="space-y-3">
            {team.players && team.players.length > 0 ? (
              team.players.map((player) => (
                <div key={player.id} className="group bg-slate-800/50 hover:bg-slate-800 p-4 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/50">
                    <span className="font-bold text-purple-400 text-lg">{player.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">{player.name}</h3>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400">{player.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <p className="text-gray-500">Roster information unavailable</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Matches */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Swords className="w-6 h-6 text-purple-500" />
            <span>Match History</span>
          </h2>

          {matchesLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="space-y-4">
              {filteredMatches.slice(0, 10).map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
              <p className="text-gray-500 text-lg">No match history found for this team.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default TeamDetail
