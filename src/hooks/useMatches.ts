import { useState, useEffect } from "react";

interface Team {
  id: string;
  name: string;
  score: number;
  logo: string | null;
}

export interface Match {
  id: string;
  tournamentId?: string;
  round: string;
  bestOf: number;
  status: "upcoming" | "live" | "completed";
  date: string | null;
  beginAt: string | null;
  endAt: string | null;
  scheduledAt: string | null;
  team1: Team;
  team2: Team;
  _apiData?: any;
}

interface UseMatchesReturn {
  matches: Match[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch matches from PandaScore API
 * @param {string} tournamentId - Optional tournament ID to filter matches
 * @param {string} status - Optional status filter ('running', 'not_started', 'finished')
 * @returns {UseMatchesReturn} - { matches, loading, error }
 */
export function useMatches(
  tournamentId: string | null = null,
  status: string | null = null,
): UseMatchesReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_PANDASCORE_KEY as string | undefined;

    if (!apiKey) {
      setError(
        "API key not configured. Please set VITE_PANDASCORE_KEY in your .env file.",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setMatches([]);

    const fetchMatches = async () => {
      try {
        let url = "/api/mlbb/matches";
        const params = new URLSearchParams({ token: apiKey });

        if (tournamentId) {
          params.append("filter[tournament_id]", tournamentId);
        }

        if (status) {
          params.append("filter[status]", status);
        }

        // Get recent matches
        params.append("sort", "-begin_at");
        params.append("per_page", "50");

        url = `${url}?${params.toString()}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch matches: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();

        const transformedData: Match[] = data.map((item: any) => {
          // Map PandaScore status to our status
          let matchStatus: "upcoming" | "live" | "completed" = "upcoming";
          if (item.status === "running") matchStatus = "live";
          else if (item.status === "finished") matchStatus = "completed";

          // Use begin_at (current schedule) if available, fallback to scheduled_at
          const matchDate = item.begin_at || item.scheduled_at || null;

          return {
            id: item.id?.toString() || `match-${Date.now()}-${Math.random()}`,
            tournamentId: item.tournament?.id?.toString() || tournamentId,
            round:
              item.tournament?.name ||
              item.league?.name ||
              item.serie?.name ||
              "Match",
            bestOf: item.number_of_games || 1,
            status: matchStatus,
            date: matchDate,
            beginAt: item.begin_at || null,
            endAt: item.end_at || null,
            scheduledAt: item.scheduled_at || null,
            team1: {
              id: item.opponents?.[0]?.opponent?.id?.toString() || "team-1",
              name: item.opponents?.[0]?.opponent?.name || "TBD",
              score: item.results?.[0]?.score || 0,
              logo: item.opponents?.[0]?.opponent?.image_url || null,
            },
            team2: {
              id: item.opponents?.[1]?.opponent?.id?.toString() || "team-2",
              name: item.opponents?.[1]?.opponent?.name || "TBD",
              score: item.results?.[1]?.score || 0,
              logo: item.opponents?.[1]?.opponent?.image_url || null,
            },
            _apiData: item,
          };
        });

        setMatches(transformedData);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch matches";
        console.error("Error fetching matches:", err);
        setError(errorMessage);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [tournamentId, status]);

  return { matches, loading, error };
}
