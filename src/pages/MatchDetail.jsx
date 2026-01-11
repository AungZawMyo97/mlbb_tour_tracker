import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Trophy, Clock, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useMatches } from '../hooks/useMatches'
import { useTeams } from '../hooks/useTeams'
import { formatMatchDateTime, formatMatchDate } from '../utils/dateFormatter'

function MatchDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('summary')
  const [selectedGame, setSelectedGame] = useState(0)

  // Fetch all matches to find the one we need
  const { matches: allMatches, loading: matchesLoading } = useMatches(null, null)
  const match = allMatches.find(m => m.id === id || m._apiData?.id?.toString() === id)

  // Fetch team data if match is found
  const { teams: team1Data, loading: team1Loading } = useTeams(match?.team1?.id)
  const { teams: team2Data, loading: team2Loading } = useTeams(match?.team2?.id)

  if (matchesLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-400">Loading match...</p>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Match not found</p>
        <Link to="/" className="text-purple-500 hover:text-purple-400 mt-4 inline-block">
          Go back home
        </Link>
      </div>
    )
  }

  // Note: API matches may not have detailed game data like draft, stats, roster
  // This is a limitation of the API - we'll show what's available
  const currentGame = match.games && match.games[selectedGame]

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 animate-pulse'
      case 'completed':
        return 'bg-green-500'
      case 'upcoming':
        return 'bg-blue-500'
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

      {/* Match Header */}
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white ${getStatusColor(match.status)} mb-4`}>
              {match.status.toUpperCase()}
            </span>
            <h1 className="text-3xl font-bold mb-2">{match.round}</h1>
            <p className="text-gray-400 mb-2">Best of {match.bestOf}</p>
            {match.date && (
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>
                  {match.status === 'upcoming' && match.scheduledAt
                    ? `Scheduled: ${formatMatchDateTime(match.scheduledAt)}`
                    : match.beginAt
                    ? `Started: ${formatMatchDateTime(match.beginAt)}`
                    : formatMatchDate(match.date)}
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold gradient-purple-blue bg-clip-text text-transparent mb-2">
              {match.team1.score} - {match.team2.score}
            </div>
            {match.status === 'completed' && (
              <div className="flex items-center justify-end space-x-2 text-yellow-400">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">
                  {match.team1.score > match.team2.score ? match.team1.name : match.team2.name} Wins
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Teams */}
        <div className="grid grid-cols-2 gap-8">
          <Link
            to={`/team/${match.team1.id}`}
            className="text-center hover:opacity-80 transition-opacity group"
          >
            <img
              src={match.team1.logo}
              alt={match.team1.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-500 group-hover:border-purple-400 transition-colors"
            />
            <h2 className="text-2xl font-bold group-hover:text-purple-400 transition-colors">{match.team1.name}</h2>
            <p className="text-sm text-gray-400 mt-1">View Team Details →</p>
          </Link>
          <Link
            to={`/team/${match.team2.id}`}
            className="text-center hover:opacity-80 transition-opacity group"
          >
            <img
              src={match.team2.logo}
              alt={match.team2.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500 group-hover:border-blue-400 transition-colors"
            />
            <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">{match.team2.name}</h2>
            <p className="text-sm text-gray-400 mt-1">View Team Details →</p>
          </Link>
        </div>
      </div>

      {/* Game Selector - Only show if games data exists */}
      {match.games && match.games.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex space-x-2 overflow-x-auto">
            {match.games.map((game, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedGame(index)
                  setActiveTab('summary')
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  selectedGame === index
                    ? 'gradient-purple-blue text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Game {game.gameNumber}
                {game.winner && (
                  <span className="ml-2 text-xs">
                    {game.winner === match.team1.id ? match.team1.name : match.team2.name}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Game Details - Only show if detailed game data exists */}
      {currentGame && currentGame.draft ? (
        <div className="space-y-6">
          {/* Draft Phase */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-2xl font-bold mb-6 gradient-purple-blue bg-clip-text text-transparent">
              Draft Phase
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Team 1 Draft */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-purple-400">{match.team1.name}</h4>
                
                {/* Bans */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Bans</p>
                  <div className="flex flex-wrap gap-2">
                    {currentGame.draft.team1Bans.map((hero, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-xs font-semibold"
                        title={hero}
                      >
                        {hero.substring(0, 2)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Picks */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Picks</p>
                  <div className="space-y-2">
                    {currentGame.draft.team1Picks.map((pick, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 bg-slate-700/50 rounded-lg p-2"
                      >
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-xs font-semibold">
                          {pick.hero.substring(0, 2)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{pick.hero}</p>
                          <p className="text-xs text-gray-400">{pick.player} - {pick.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team 2 Draft */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-blue-400">{match.team2.name}</h4>
                
                {/* Bans */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Bans</p>
                  <div className="flex flex-wrap gap-2">
                    {currentGame.draft.team2Bans.map((hero, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-xs font-semibold"
                        title={hero}
                      >
                        {hero.substring(0, 2)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Picks */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Picks</p>
                  <div className="space-y-2">
                    {currentGame.draft.team2Picks.map((pick, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 bg-slate-700/50 rounded-lg p-2"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-xs font-semibold">
                          {pick.hero.substring(0, 2)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{pick.hero}</p>
                          <p className="text-xs text-gray-400">{pick.player} - {pick.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Tabs */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            {/* Tab Headers */}
            <div className="flex border-b border-slate-700">
              {['summary', 'gold', 'roster'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${
                    activeTab === tab
                      ? 'gradient-purple-blue text-white border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400">Duration: {currentGame.duration}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Team 1 Stats */}
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-bold mb-4 text-purple-400">{match.team1.name}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Kills</span>
                          <span className="font-bold">{currentGame.stats.team1.kills}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Deaths</span>
                          <span className="font-bold">{currentGame.stats.team1.deaths}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Assists</span>
                          <span className="font-bold">{currentGame.stats.team1.assists}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Towers</span>
                          <span className="font-bold">{currentGame.stats.team1.towers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gold</span>
                          <span className="font-bold">{currentGame.stats.team1.gold.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Team 2 Stats */}
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-bold mb-4 text-blue-400">{match.team2.name}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Kills</span>
                          <span className="font-bold">{currentGame.stats.team2.kills}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Deaths</span>
                          <span className="font-bold">{currentGame.stats.team2.deaths}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Assists</span>
                          <span className="font-bold">{currentGame.stats.team2.assists}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Towers</span>
                          <span className="font-bold">{currentGame.stats.team2.towers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gold</span>
                          <span className="font-bold">{currentGame.stats.team2.gold.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gold' && currentGame.stats.team1.goldGraph && (
                <div>
                  <h4 className="text-xl font-bold mb-4">Gold Graph</h4>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={currentGame.stats.team1.goldGraph}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="minute" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="team1"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name={match.team1.name}
                      />
                      <Line
                        type="monotone"
                        dataKey="team2"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name={match.team2.name}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {activeTab === 'roster' && (
                <div className="space-y-6">
                  {/* Team 1 Roster */}
                  <div>
                    <h4 className="text-xl font-bold mb-4 text-purple-400">{match.team1.name}</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-3 px-4 text-gray-400">Player</th>
                            <th className="text-left py-3 px-4 text-gray-400">Role</th>
                            <th className="text-left py-3 px-4 text-gray-400">Hero</th>
                            <th className="text-left py-3 px-4 text-gray-400">KDA</th>
                            <th className="text-left py-3 px-4 text-gray-400">Gold</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentGame.roster.team1.map((player, index) => (
                            <tr key={index} className="border-b border-slate-700/50">
                              <td className="py-3 px-4 font-semibold">{player.player}</td>
                              <td className="py-3 px-4 text-gray-400">{player.role}</td>
                              <td className="py-3 px-4">{player.hero}</td>
                              <td className="py-3 px-4">{player.kda}</td>
                              <td className="py-3 px-4">{player.gold.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Team 2 Roster */}
                  <div>
                    <h4 className="text-xl font-bold mb-4 text-blue-400">{match.team2.name}</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-3 px-4 text-gray-400">Player</th>
                            <th className="text-left py-3 px-4 text-gray-400">Role</th>
                            <th className="text-left py-3 px-4 text-gray-400">Hero</th>
                            <th className="text-left py-3 px-4 text-gray-400">KDA</th>
                            <th className="text-left py-3 px-4 text-gray-400">Gold</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentGame.roster.team2.map((player, index) => (
                            <tr key={index} className="border-b border-slate-700/50">
                              <td className="py-3 px-4 font-semibold">{player.player}</td>
                              <td className="py-3 px-4 text-gray-400">{player.role}</td>
                              <td className="py-3 px-4">{player.hero}</td>
                              <td className="py-3 px-4">{player.kda}</td>
                              <td className="py-3 px-4">{player.gold.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Match Information</h3>
            <p className="text-gray-400">Detailed game data (draft, stats, rosters) is not available for this match.</p>
          </div>
          
          {/* Basic Match Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-bold mb-4 text-purple-400">{match.team1.name}</h4>
              <div className="text-center">
                <p className="text-3xl font-bold">{match.team1.score}</p>
                {match.team1.logo && (
                  <img
                    src={match.team1.logo}
                    alt={match.team1.name}
                    className="w-16 h-16 rounded-full mx-auto mt-4"
                  />
                )}
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-bold mb-4 text-blue-400">{match.team2.name}</h4>
              <div className="text-center">
                <p className="text-3xl font-bold">{match.team2.score}</p>
                {match.team2.logo && (
                  <img
                    src={match.team2.logo}
                    alt={match.team2.name}
                    className="w-16 h-16 rounded-full mx-auto mt-4"
                  />
                )}
              </div>
            </div>
          </div>
          
          {team1Data && team1Data.players && (
            <div className="mt-6">
              <h4 className="text-xl font-bold mb-4 text-purple-400">{match.team1.name} - Players</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {team1Data.players.map((player) => (
                  <div key={player.id} className="text-center">
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-sm text-gray-400">{player.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {team2Data && team2Data.players && (
            <div className="mt-6">
              <h4 className="text-xl font-bold mb-4 text-blue-400">{match.team2.name} - Players</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {team2Data.players.map((player) => (
                  <div key={player.id} className="text-center">
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-sm text-gray-400">{player.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MatchDetail
