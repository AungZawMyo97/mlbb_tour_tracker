import { useState } from 'react'
import HeroCarousel from '../components/HeroCarousel'
import LiveTicker from '../components/LiveTicker'
import TournamentCard from '../components/TournamentCard'
import MatchCard from '../components/MatchCard'
import { useMatches } from '../hooks/useMatches'
import useTournamentsStore from '../stores/tournamentsStore'

function Home() {
  const [activeTab, setActiveTab] = useState('ongoing')
  
  // Get tournaments from store (fetched once at app start)
  const loading = useTournamentsStore((state) => state.loading)
  const error = useTournamentsStore((state) => state.error)
  const getTournamentsByStatus = useTournamentsStore((state) => state.getTournamentsByStatus)
  
  // Filter tournaments by active tab (client-side filtering)
  const filteredTournaments = getTournamentsByStatus(activeTab)
  
  // Fetch live matches from API
  const { matches: liveMatches, loading: matchesLoading } = useMatches(null, 'running')
  
  // Fetch recent completed matches
  const { matches: recentMatches } = useMatches(null, 'finished')
  
  // For hero carousel, use first ongoing tournament from API
  const heroTournaments = filteredTournaments.slice(0, 1).map(t => ({ ...t, featured: true }))

  return (
    <div className="space-y-8">
      {/* Hero Carousel */}
      {heroTournaments.length > 0 && <HeroCarousel tournaments={heroTournaments} />}

      {/* Live Ticker */}
      <LiveTicker matches={liveMatches} />

      {/* Tournaments Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 gradient-purple-blue bg-clip-text text-transparent drop-shadow-lg">
          Tournaments
        </h2>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-purple-500/20">
          {['ongoing', 'upcoming', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === tab
                  ? 'gradient-purple-blue text-white border-b-2 border-purple-500 shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400">Loading tournaments...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
            <p className="text-red-400 font-semibold mb-2">Error loading tournaments</p>
            <p className="text-gray-400 text-sm">{error}</p>
            <p className="text-gray-500 text-xs mt-2">
              Make sure VITE_PANDASCORE_KEY is set in your .env file
            </p>
          </div>
        )}

        {/* Tournament Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>

            {filteredTournaments.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>No {activeTab} tournaments at the moment</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Recent Matches Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 gradient-purple-blue bg-clip-text text-transparent drop-shadow-lg">
          Recent Matches
        </h2>

        {matchesLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400">Loading matches...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentMatches
              .filter(m => m.status === 'completed')
              .sort((a, b) => {
                // Sort by date descending (latest first)
                const dateA = a.beginAt || a.date || a.endAt || ''
                const dateB = b.beginAt || b.date || b.endAt || ''
                
                if (!dateA && !dateB) return 0
                if (!dateA) return 1  // Put matches without dates at the end
                if (!dateB) return -1
                
                return new Date(dateB) - new Date(dateA) // Descending order
              })
              .slice(0, 5)
              .map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            {recentMatches.filter(m => m.status === 'completed').length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>No recent matches available</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
