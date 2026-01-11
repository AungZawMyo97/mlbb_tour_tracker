import { useState, useEffect } from 'react'

/**
 * Custom hook to fetch teams from PandaScore API
 * @param {string} teamId - Optional team ID to fetch specific team
 * @returns {object} - { teams, loading, error }
 */
export function useTeams(teamId = null) {
  const [teams, setTeams] = useState([])
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
    setTeams([])

    const fetchTeams = async () => {
      try {
        let url = teamId
          ? `/api/teams/${teamId}?token=${apiKey}`
          : `/api/mlbb/teams?token=${apiKey}&per_page=100`

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        const teamsArray = Array.isArray(data) ? data : [data]

        const transformedData = teamsArray.map((item) => ({
          id: item.id?.toString() || `team-${Date.now()}-${Math.random()}`,
          name: item.name || 'Unnamed Team',
          region: item.location || 'Unknown',
          logo: item.image_url || null,
          players: item.players?.map((player, index) => ({
            id: player.id?.toString() || `p${index}`,
            name: player.name || `Player ${index + 1}`,
            role: player.role || 'Player',
          })) || [],
          _apiData: item,
        }))

        // Always return an array for consistency
        setTeams(teamId ? (transformedData[0] ? [transformedData[0]] : []) : transformedData)
        setError(null)
      } catch (err) {
        console.error('Error fetching teams:', err)
        setError(err.message || 'Failed to fetch teams')
        setTeams([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [teamId])

  return { teams, loading, error }
}
