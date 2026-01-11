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

        // Helper to infer location from league name
        const inferLocation = (leagueName) => {
          if (!leagueName) return 'TBA'
          const lower = leagueName.toLowerCase()
          if (lower.includes('ph') || lower.includes('philippines')) return 'Manila, Philippines'
          if (lower.includes('id') || lower.includes('indonesia')) return 'Jakarta, Indonesia'
          if (lower.includes('my') || lower.includes('malaysia')) return 'Kuala Lumpur, Malaysia'
          if (lower.includes('sg') || lower.includes('singapore')) return 'Singapore'
          if (lower.includes('kh') || lower.includes('cambodia')) return 'Phnom Penh, Cambodia'
          if (lower.includes('mm') || lower.includes('myanmar')) return 'Yangon, Myanmar'
          if (lower.includes('tr') || lower.includes('turkey')) return 'Istanbul, Turkey'
          if (lower.includes('na') || lower.includes('north america')) return 'Las Vegas, USA'
          if (lower.includes('latam')) return 'Sao Paulo, Brazil'
          if (lower.includes('mena')) return 'Riyadh, Saudi Arabia'
          if (lower.includes('m5') || lower.includes('world')) return 'International'
          if (lower.includes('msc')) return 'International'
          return 'TBA'
        }

        // Transform API data to match our component structure
        const transformedData = data.map((item) => {
          // Resolve Prize Pool
          let prizePoolStr = 'TBA'
          const amount = item.prizepool || item.serie?.prizepool
          if (amount) {
            prizePoolStr = item.currency === 'USD' ? `$${parseFloat(amount).toLocaleString()}` : `${amount} ${item.currency || ''}`
            // If currency is null, assume USD for now as it's standard for esports
            if (!item.currency && !item.serie?.currency) prizePoolStr = `$${parseFloat(amount).toLocaleString()}`
          }

          // Resolve Location
          let locationStr = item.league?.location || item.serie?.city || item.country
          if (!locationStr || locationStr === 'null') {
            locationStr = inferLocation(item.league?.name)
          }

          return {
            id: item.id?.toString() || `tournament-${Date.now()}-${Math.random()}`,
            name: item.league?.name && item.name
              ? `${item.league.name} - ${item.name}`
              : item.name || item.league?.name || 'Unnamed Tournament',
            status: status, // Map to our status
            startDate: item.begin_at || new Date().toISOString(),
            endDate: item.end_at || item.begin_at || new Date().toISOString(),
            location: locationStr,
            prizePool: prizePoolStr,
            featured: false, // Can be enhanced later
            description: item.league?.name || item.name || 'Mobile Legends tournament',
            logo: item.league?.image_url || null,
            // Store original API data for reference
            _apiData: item
          }
        })

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
