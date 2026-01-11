import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favoriteTeams: [],
      favoriteTournaments: [],
      
      toggleTeamFavorite: (teamId) => set((state) => ({
        favoriteTeams: state.favoriteTeams.includes(teamId)
          ? state.favoriteTeams.filter(id => id !== teamId)
          : [...state.favoriteTeams, teamId]
      })),
      
      toggleTournamentFavorite: (tournamentId) => set((state) => ({
        favoriteTournaments: state.favoriteTournaments.includes(tournamentId)
          ? state.favoriteTournaments.filter(id => id !== tournamentId)
          : [...state.favoriteTournaments, tournamentId]
      })),
      
      isTeamFavorite: (teamId) => {
        return get().favoriteTeams.includes(teamId)
      },
      
      isTournamentFavorite: (tournamentId) => {
        return get().favoriteTournaments.includes(tournamentId)
      },
    }),
    {
      name: 'land-of-dawn-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useFavoritesStore
