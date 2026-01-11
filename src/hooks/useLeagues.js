import { useState, useEffect } from 'react'

/**
 * Custom hook to fetch leagues from PandaScore API
 * @returns {object} - { leagues, loading, error }
 */
export function useLeagues() {
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_PANDASCORE_KEY

    if (!apiKey) {
      setError('API key not configured. Please set VITE_PANDASCORE_KEY in your .env file.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setLeagues([])

    const fetchLeagues = async () => {
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

        setLeagues(transformedData)
        setError(null)
      } catch (err) {
        console.error('Error fetching leagues:', err)
        setError(err.message || 'Failed to fetch leagues')
        setLeagues([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeagues()
  }, [])

  return { leagues, loading, error }
}

/**
 * Find league by ID
 * @param {Array} leagues - Array of leagues
 * @param {string|number} leagueId - League ID to find
 * @returns {object|null} - League object or null
 */
export function findLeagueById(leagues, leagueId) {
  if (!leagues || !leagueId) return null
  
  return leagues.find(
    league => league.id === leagueId?.toString() || 
              league._apiData?.id?.toString() === leagueId?.toString()
  )
}
