import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoritesState {
  favoriteTeams: string[];
  favoriteTournaments: string[];
  toggleTeamFavorite: (teamId: string) => void;
  toggleTournamentFavorite: (tournamentId: string) => void;
  isTeamFavorite: (teamId: string) => boolean;
  isTournamentFavorite: (tournamentId: string) => boolean;
}

const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteTeams: [],
      favoriteTournaments: [],

      toggleTeamFavorite: (teamId: string) =>
        set((state) => ({
          favoriteTeams: state.favoriteTeams.includes(teamId)
            ? state.favoriteTeams.filter((id) => id !== teamId)
            : [...state.favoriteTeams, teamId],
        })),

      toggleTournamentFavorite: (tournamentId: string) =>
        set((state) => ({
          favoriteTournaments: state.favoriteTournaments.includes(tournamentId)
            ? state.favoriteTournaments.filter((id) => id !== tournamentId)
            : [...state.favoriteTournaments, tournamentId],
        })),

      isTeamFavorite: (teamId: string) => {
        return get().favoriteTeams.includes(teamId);
      },

      isTournamentFavorite: (tournamentId: string) => {
        return get().favoriteTournaments.includes(tournamentId);
      },
    }),
    {
      name: "land-of-dawn-favorites",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useFavoritesStore;
