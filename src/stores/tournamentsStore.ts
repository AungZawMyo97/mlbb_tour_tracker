import { create } from "zustand";
import useLeaguesStore, { League } from "./leaguesStore.ts";
import m7Logo from "../assets/m7_logo.png";

export interface Tournament {
  id: string;
  name: string;
  status: "ongoing" | "upcoming" | "completed";
  startDate: string;
  endDate: string;
  location: string;
  prizePool: string;
  featured: boolean;
  description: string;
  logo: string | null;
  leagueId?: string;
  league?: League | null;
  _apiData?: any;
}

interface TournamentsState {
  tournaments: {
    ongoing: Tournament[];
    upcoming: Tournament[];
    completed: Tournament[];
  };
  loading: boolean;
  error: string | null;
  lastFetched: string | null;
  fetchAllTournaments: () => Promise<void>;
  getTournamentsByStatus: (
    status: "ongoing" | "upcoming" | "completed",
  ) => Tournament[];
  getAllTournaments: () => Tournament[];
  findTournamentById: (id: string | undefined) => Tournament | undefined;
}

const useTournamentsStore = create<TournamentsState>((set, get) => ({
  tournaments: {
    ongoing: [],
    upcoming: [],
    completed: [],
  },
  loading: true,
  error: null,
  lastFetched: null,


  fetchAllTournaments: async () => {
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


      if (!runningRes.ok || !upcomingRes.ok || !pastRes.ok) {
        throw new Error("Failed to fetch tournaments");
      }

      const [runningData, upcomingData, pastData] = await Promise.all([
        runningRes.json(),
        upcomingRes.json(),
        pastRes.json(),
      ]);


      const transformTournaments = (
        data: any[],
        status: "ongoing" | "upcoming" | "completed",
      ): Tournament[] => {

        const leaguesState = useLeaguesStore.getState();
        const leagues = leaguesState.leagues || [];


        const inferLocation = (leagueName: string | undefined): string => {
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

        return data.map((item: any): Tournament => {

          const leagueId =
            item.league?.id?.toString() || item.league_id?.toString();
          const league = leagueId
            ? leagues.find(
              (l) =>
                l.id === leagueId || l._apiData?.id?.toString() === leagueId,
            )
            : null;

          const leagueName = league?.name || item.league?.name;


          let leagueLocation =
            league?.location || item.league?.location || item.country;
          if (!leagueLocation || leagueLocation === "null") {
            leagueLocation = inferLocation(leagueName);
          }

          let tournamentName =
            leagueName && item.name
              ? `${leagueName} - ${item.name}`
              : item.name || leagueName || "Unnamed Tournament";

          tournamentName = tournamentName.replace(/M5/gi, "M7");

          const logoUrl = m7Logo;
          // leagueName?.includes("m5") ||
          //   leagueName?.includes("M7") ||
          //   item.name?.includes("M5") ||
          //   item.name?.includes("M7")
          //   ? m7Logo
          //   : leagueImage || null;

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
            league: league,
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
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch tournaments";
      console.error("Error fetching tournaments:", err);
      set({
        error: errorMessage,
        loading: false,
        tournaments: {
          ongoing: [],
          upcoming: [],
          completed: [],
        },
      });
    }
  },


  getTournamentsByStatus: (status: "ongoing" | "upcoming" | "completed") => {
    const state = get();
    return state.tournaments[status] || [];
  },


  getAllTournaments: () => {
    const state = get();
    return [
      ...state.tournaments.ongoing,
      ...state.tournaments.upcoming,
      ...state.tournaments.completed,
    ];
  },


  findTournamentById: (id: string | undefined) => {
    if (!id) return undefined;
    const allTournaments = get().getAllTournaments();
    return allTournaments.find(
      (t) => t.id === id || t._apiData?.id?.toString() === id,
    );
  },
}));

export default useTournamentsStore;
