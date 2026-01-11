import { create } from 'zustand'
import useLeaguesStore from './leaguesStore'

const useTournamentsStore = create((set, get) => ({
  tournaments: {
    ongoing: [],
    upcoming: [],
    completed: [],
  },
  loading: true,
  error: null,
  lastFetched: null,
  
  // Fetch all tournaments at once
  fetchAllTournaments: async () => {
    const apiKey = import.meta.env.VITE_PANDASCORE_KEY

    if (!apiKey) {
      set({
        error: 'API key not configured. Please set VITE_PANDASCORE_KEY in your .env file.',
        loading: false,
      })
      return
    }

    set({ loading: true, error: null })

    try {
      // Fetch all tournament types in parallel
      const [runningRes, upcomingRes, pastRes] = await Promise.all([
        fetch(`/api/mlbb/tournaments/running?token=${apiKey}`, {
          headers: { 'Accept': 'application/json' },
        }),
        fetch(`/api/mlbb/tournaments/upcoming?token=${apiKey}`, {
          headers: { 'Accept': 'application/json' },
        }),
        fetch(`/api/mlbb/tournaments/past?token=${apiKey}`, {
          headers: { 'Accept': 'application/json' },
        }),
      ])

      // Check if all requests succeeded
      if (!runningRes.ok || !upcomingRes.ok || !pastRes.ok) {
        throw new Error('Failed to fetch tournaments')
      }

      const [runningData, upcomingData, pastData] = await Promise.all([
        runningRes.json(),
        upcomingRes.json(),
        pastRes.json(),
      ])

      // Transform data for each status
      const transformTournaments = (data, status) => {
        // Get leagues from leagues store to match with tournaments
        const leaguesState = useLeaguesStore.getState()
        const leagues = leaguesState.leagues || []

        return data.map((item) => {
          // Find league from leagues store using league ID
          const leagueId = item.league?.id?.toString() || item.league_id?.toString()
          const league = leagueId 
            ? leagues.find(l => l.id === leagueId || l._apiData?.id?.toString() === leagueId)
            : null
          
          // Use league data if found, otherwise fall back to tournament league data
          const leagueName = league?.name || item.league?.name
          const leagueImage = league?.imageUrl || item.league?.image_url
          const leagueLocation = league?.location || item.league?.location
          
          // Replace M5 with M7 in tournament names
          let tournamentName = leagueName && item.name 
            ? `${leagueName} - ${item.name}` 
            : item.name || leagueName || 'Unnamed Tournament'
          
          // Replace M5 with M7 (case insensitive)
          tournamentName = tournamentName.replace(/M5/gi, 'M7')
          
          return {
            id: item.id?.toString() || `tournament-${Date.now()}-${Math.random()}`,
            name: tournamentName,
            status: status,
            startDate: item.begin_at || new Date().toISOString(),
            endDate: item.end_at || item.begin_at || new Date().toISOString(),
            location: leagueLocation || 'TBA',
            prizePool: item.prizepool 
              ? `$${item.prizepool.toLocaleString()}` 
              : 'TBA',
            featured: false,
            description: leagueName || item.name || 'Mobile Legends tournament',
            logo: leagueImage || null,
            leagueId: leagueId,
            league: league, // Store full league object
            _apiData: item,
          }
        })
      }

      set({
        tournaments: {
          ongoing: transformTournaments(runningData, 'ongoing'),
          upcoming: transformTournaments(upcomingData, 'upcoming'),
          completed: transformTournaments(pastData, 'completed'),
        },
        loading: false,
        error: null,
        lastFetched: new Date().toISOString(),
      })
    } catch (err) {
      console.error('Error fetching tournaments:', err)
      set({
        error: err.message || 'Failed to fetch tournaments',
        loading: false,
        tournaments: {
          ongoing: [],
          upcoming: [],
          completed: [],
        },
      })
    }
  },

  // Get tournaments by status
  getTournamentsByStatus: (status) => {
    const state = get()
    return state.tournaments[status] || []
  },

  // Get all tournaments combined
  getAllTournaments: () => {
    const state = get()
    return [
      ...state.tournaments.ongoing,
      ...state.tournaments.upcoming,
      ...state.tournaments.completed,
    ]
  },

  // Find tournament by ID
  findTournamentById: (id) => {
    const allTournaments = get().getAllTournaments()
    return allTournaments.find(
      t => t.id === id || t._apiData?.id?.toString() === id
    )
  },
}))

export default useTournamentsStore
