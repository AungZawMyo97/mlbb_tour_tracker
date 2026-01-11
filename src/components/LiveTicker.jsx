import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Radio } from 'lucide-react'

function LiveTicker({ matches }) {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const liveMatches = matches.filter(m => m.status === 'live')

  useEffect(() => {
    if (liveMatches.length === 0) return

    const interval = setInterval(() => {
      setCurrentMatchIndex((prev) => (prev + 1) % liveMatches.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [liveMatches.length])

  if (liveMatches.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <Radio className="w-5 h-5 text-gray-500" />
          <span>No live matches at the moment</span>
        </div>
      </div>
    )
  }

  const currentMatch = liveMatches[currentMatchIndex]

  return (
    <div className="glass-effect rounded-xl p-4 border border-red-500/50 border-l-4 shadow-lg shadow-red-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="text-red-500 font-bold text-sm">LIVE</span>
          </div>
          
          <div className="flex items-center space-x-4 flex-1">
            <Link
              to={`/team/${currentMatch.team1.id}`}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={currentMatch.team1.logo}
                alt={currentMatch.team1.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold text-white">{currentMatch.team1.name}</span>
            </Link>
            
            <div className="text-xl font-bold gradient-purple-blue bg-clip-text text-transparent">
              {currentMatch.team1.score} - {currentMatch.team2.score}
            </div>
            
            <Link
              to={`/team/${currentMatch.team2.id}`}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <span className="font-semibold text-white">{currentMatch.team2.name}</span>
              <img
                src={currentMatch.team2.logo}
                alt={currentMatch.team2.name}
                className="w-8 h-8 rounded-full"
              />
            </Link>
          </div>
        </div>

        <div className="text-sm text-gray-400 ml-4">
          {currentMatch.round}
        </div>
      </div>

      {/* Match Indicators */}
      {liveMatches.length > 1 && (
        <div className="flex justify-center space-x-1 mt-3">
          {liveMatches.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentMatchIndex
                  ? 'w-8 bg-red-500'
                  : 'w-1 bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default LiveTicker
