import { create } from 'zustand'

const useLeaguesStore = create((set, get) => ({
  leagues: [],
  loading: true,
  error: null,
  lastFetched: null,
  
  // Fetch all leagues
  fetchAllLeagues: async () => {
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
      const url = `/api/mlbb/leagues?token=${apiKey}&per_page=100`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch leagues: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      const transformedData = data.map((item) => ({
        id: item.id?.toString() || `league-${Date.now()}-${Math.random()}`,
        name: item.name || 'Unnamed League',
        slug: item.slug || null,
        imageUrl: item.image_url || null,
        url: item.url || null,
        location: item.location || null,
        _apiData: item,
      }))

      set({
        leagues: transformedData,
        loading: false,
        error: null,
        lastFetched: new Date().toISOString(),
      })
    } catch (err) {
      console.error('Error fetching leagues:', err)
      set({
        error: err.message || 'Failed to fetch leagues',
        loading: false,
        leagues: [],
      })
    }
  },

  // Find league by ID
  findLeagueById: (leagueId) => {
    const state = get()
    if (!leagueId) return null
    
    return state.leagues.find(
      league => league.id === leagueId?.toString() || 
                league._apiData?.id?.toString() === leagueId?.toString()
    )
  },

  // Find league by name (fuzzy match)
  findLeagueByName: (leagueName) => {
    const state = get()
    if (!leagueName) return null
    
    return state.leagues.find(
      league => league.name?.toLowerCase().includes(leagueName.toLowerCase()) ||
                league._apiData?.name?.toLowerCase().includes(leagueName.toLowerCase())
    )
  },
}))

export default useLeaguesStore
