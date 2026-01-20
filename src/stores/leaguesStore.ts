import { create } from "zustand";

export interface League {
  id: string;
  name: string;
  slug: string | null;
  imageUrl: string | null;
  url: string | null;
  location: string | null;
  _apiData?: any;
}

interface LeaguesState {
  leagues: League[];
  loading: boolean;
  error: string | null;
  lastFetched: string | null;
  fetchAllLeagues: () => Promise<void>;
  findLeagueById: (leagueId: string | null | undefined) => League | null;
  findLeagueByName: (leagueName: string | null | undefined) => League | null;
}

const useLeaguesStore = create<LeaguesState>((set, get) => ({
  leagues: [],
  loading: true,
  error: null,
  lastFetched: null,

  // Fetch all leagues
  fetchAllLeagues: async () => {
    const apiKey = import.meta.env.VITE_PANDASCORE_KEY as string | undefined;

    if (!apiKey) {
      set({
        error:
          "API key not configured. Please set VITE_PANDASCORE_KEY in your .env file.",
        loading: false,
      });
      return;
    }

    set({ loading: true, error: null });

    try {
      const url = `/api/mlbb/leagues?token=${apiKey}&per_page=100`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch leagues: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      const transformedData: League[] = data.map((item: any) => ({
        id: item.id?.toString() || `league-${Date.now()}-${Math.random()}`,
        name: item.name || "Unnamed League",
        slug: item.slug || null,
        imageUrl: item.image_url || null,
        url: item.url || null,
        location: item.location || null,
        _apiData: item,
      }));

      set({
        leagues: transformedData,
        loading: false,
        error: null,
        lastFetched: new Date().toISOString(),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch leagues";
      console.error("Error fetching leagues:", err);
      set({
        error: errorMessage,
        loading: false,
        leagues: [],
      });
    }
  },

  // Find league by ID
  findLeagueById: (leagueId: string | null | undefined) => {
    const state = get();
    if (!leagueId) return null;

    return (
      state.leagues.find(
        (league) =>
          league.id === leagueId?.toString() ||
          league._apiData?.id?.toString() === leagueId?.toString(),
      ) || null
    );
  },

  // Find league by name (fuzzy match)
  findLeagueByName: (leagueName: string | null | undefined) => {
    const state = get();
    if (!leagueName) return null;

    return (
      state.leagues.find(
        (league) =>
          league.name?.toLowerCase().includes(leagueName.toLowerCase()) ||
          league._apiData?.name
            ?.toLowerCase()
            .includes(leagueName.toLowerCase()),
      ) || null
    );
  },
}));

export default useLeaguesStore;
