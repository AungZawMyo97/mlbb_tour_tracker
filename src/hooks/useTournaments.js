import { useState, useEffect } from 'react'

/**
 * Custom hook to fetch tournaments from PandaScore API
 * @param {string} status - 'running', 'upcoming', or 'past'
 * @returns {object} - { tournaments, loading, error }
 */
export function useTournaments(status) {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Map status to API endpoint
    const endpointMap = {
      ongoing: 'running',
      upcoming: 'upcoming',
      completed: 'past'
    }

    const apiStatus = endpointMap[status] || status
    const apiKey = import.meta.env.VITE_PANDASCORE_KEY

    if (!apiKey) {
      setError('API key not configured. Please set VITE_PANDASCORE_KEY in your .env file.')
      setLoading(false)
      return
    }

    // Reset state when status changes
    setLoading(true)
    setError(null)
    setTournaments([])

    // Fetch tournaments from API
    const fetchTournaments = async () => {
      try {
        // PandaScore API expects token as query parameter
        const url = `/api/mlbb/tournaments/${apiStatus}?token=${apiKey}`
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch tournaments: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        
        // Transform API data to match our component structure
        const transformedData = data.map((item) => ({
          id: item.id?.toString() || `tournament-${Date.now()}-${Math.random()}`,
          name: item.league?.name && item.name 
            ? `${item.league.name} - ${item.name}` 
            : item.name || item.league?.name || 'Unnamed Tournament',
          status: status, // Map to our status
          startDate: item.begin_at || new Date().toISOString(),
          endDate: item.end_at || item.begin_at || new Date().toISOString(),
          location: item.league?.location || 'TBA',
          prizePool: item.prizepool 
            ? `$${item.prizepool.toLocaleString()}` 
            : 'TBA',
          featured: false, // Can be enhanced later
          description: item.league?.name || item.name || 'Mobile Legends tournament',
          logo: item.league?.image_url || null,
          // Store original API data for reference
          _apiData: item
        }))

        setTournaments(transformedData)
        setError(null)
      } catch (err) {
        console.error('Error fetching tournaments:', err)
        setError(err.message || 'Failed to fetch tournaments')
        setTournaments([])
      } finally {
        setLoading(false)
      }
    }

    fetchTournaments()
  }, [status])

  return { tournaments, loading, error }
}
