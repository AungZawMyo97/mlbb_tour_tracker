import { create } from "zustand";
import useLeaguesStore from "./leaguesStore";

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
    const apiKey = import.meta.env.VITE_PANDASCORE_KEY;

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
      // Fetch all tournament types in parallel
      const [runningRes, upcomingRes, pastRes] = await Promise.all([
        fetch(`/api/mlbb/tournaments/running?token=${apiKey}`, {
          headers: { Accept: "application/json" },
        }),
        fetch(`/api/mlbb/tournaments/upcoming?token=${apiKey}`, {
          headers: { Accept: "application/json" },
        }),
        fetch(`/api/mlbb/tournaments/past?token=${apiKey}`, {
          headers: { Accept: "application/json" },
        }),
      ]);

      // Check if all requests succeeded
      if (!runningRes.ok || !upcomingRes.ok || !pastRes.ok) {
        throw new Error("Failed to fetch tournaments");
      }

      const [runningData, upcomingData, pastData] = await Promise.all([
        runningRes.json(),
        upcomingRes.json(),
        pastRes.json(),
      ]);

      // Transform data for each status
      const transformTournaments = (data, status) => {
        // Get leagues from leagues store to match with tournaments
        const leaguesState = useLeaguesStore.getState();
        const leagues = leaguesState.leagues || [];

        // Helper to infer location from league name
        const inferLocation = (leagueName) => {
          if (!leagueName) return "TBA";
          const lower = leagueName.toLowerCase();
          if (lower.includes("ph") || lower.includes("philippines"))
            return "Manila, Philippines";
          if (lower.includes("id") || lower.includes("indonesia"))
            return "Jakarta, Indonesia";
          if (lower.includes("my") || lower.includes("malaysia"))
            return "Kuala Lumpur, Malaysia";
          if (lower.includes("sg") || lower.includes("singapore"))
            return "Singapore";
          if (lower.includes("kh") || lower.includes("cambodia"))
            return "Phnom Penh, Cambodia";
          if (lower.includes("mm") || lower.includes("myanmar"))
            return "Yangon, Myanmar";
          if (lower.includes("tr") || lower.includes("turkey"))
            return "Istanbul, Turkey";
          if (lower.includes("na") || lower.includes("north america"))
            return "Las Vegas, USA";
          if (lower.includes("latam")) return "Sao Paulo, Brazil";
          if (lower.includes("mena")) return "Riyadh, Saudi Arabia";
          if (lower.includes("m5") || lower.includes("world"))
            return "International";
          if (lower.includes("msc")) return "International";
          return "TBA";
        };

        return data.map((item) => {
          // Find league from leagues store using league ID
          const leagueId =
            item.league?.id?.toString() || item.league_id?.toString();
          const league = leagueId
            ? leagues.find(
                (l) =>
                  l.id === leagueId || l._apiData?.id?.toString() === leagueId
              )
            : null;

          // Use league data if found, otherwise fall back to tournament league data
          const leagueName = league?.name || item.league?.name;
          const leagueImage = league?.imageUrl || item.league?.image_url;
          // Resolve Location with fallback
          let leagueLocation =
            league?.location || item.league?.location || item.country;
          if (!leagueLocation || leagueLocation === "null") {
            leagueLocation = inferLocation(leagueName);
          }

          // Replace M5 with M7 in tournament names
          let tournamentName =
            leagueName && item.name
              ? `${leagueName} - ${item.name}`
              : item.name || leagueName || "Unnamed Tournament";

          // Replace M5 with M7 (case insensitive)
          tournamentName = tournamentName.replace(/M5/gi, "M7");

          // Custom Logo Logic
          const logoUrl =
            leagueName?.includes("M5") ||
            leagueName?.includes("M7") ||
            item.name?.includes("M5") ||
            item.name?.includes("M7")
              ? "https://liquipedia.net/commons/images/d/dd/M7_World_allmode.png"
              : leagueImage || null;

          return {
            id:
              item.id?.toString() ||
              `tournament-${Date.now()}-${Math.random()}`,
            name: tournamentName,
            status: status,
            startDate: item.begin_at || new Date().toISOString(),
            endDate: item.end_at || item.begin_at || new Date().toISOString(),
            location: leagueLocation,
            prizePool: item.prizepool
              ? `$${item.prizepool.toLocaleString()}`
              : "TBA",
            featured: false,
            description: leagueName || item.name || "Mobile Legends tournament",
            logo: logoUrl,
            leagueId: leagueId,
            league: league, // Store full league object
            _apiData: item,
          };
        });
      };

      set({
        tournaments: {
          ongoing: transformTournaments(runningData, "ongoing"),
          upcoming: transformTournaments(upcomingData, "upcoming"),
          completed: transformTournaments(pastData, "completed"),
        },
        loading: false,
        error: null,
        lastFetched: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      set({
        error: err.message || "Failed to fetch tournaments",
        loading: false,
        tournaments: {
          ongoing: [],
          upcoming: [],
          completed: [],
        },
      });
    }
  },

  // Get tournaments by status
  getTournamentsByStatus: (status) => {
    const state = get();
    return state.tournaments[status] || [];
  },

  // Get all tournaments combined
  getAllTournaments: () => {
    const state = get();
    return [
      ...state.tournaments.ongoing,
      ...state.tournaments.upcoming,
      ...state.tournaments.completed,
    ];
  },

  // Find tournament by ID
  findTournamentById: (id) => {
    const allTournaments = get().getAllTournaments();
    return allTournaments.find(
      (t) => t.id === id || t._apiData?.id?.toString() === id
    );
  },
}));

export default useTournamentsStore;
