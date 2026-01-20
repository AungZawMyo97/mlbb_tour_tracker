import HeroCarousel from "../components/HeroCarousel";
import LiveTicker from "../components/LiveTicker";
import MatchCard from "../components/MatchCard";
import TournamentCard from "../components/TournamentCard";
import { useMatches } from "../hooks/useMatches";
import useTournamentsStore from "../stores/tournamentsStore";
import { useTeams } from "../hooks/useTeams";
import { Link } from "react-router-dom";
import type { Team } from "../hooks/useTeams";

function Home() {
  // Get tournaments from store
  const loading = useTournamentsStore((state) => state.loading);
  const getTournamentsByStatus = useTournamentsStore(
    (state) => state.getTournamentsByStatus,
  );

  // Get teams
  const { teams } = useTeams();
  const topTeams = teams.slice(0, 4);

  // Fetch live matches from API
  const { matches: liveMatches } = useMatches(null, "running");

  // Fetch upcoming matches
  const { matches: upcomingMatches } = useMatches(null, "upcoming");

  // Fetch recent completed matches
  const { matches: recentMatches } = useMatches(null, "finished");

  const filteredTournaments = getTournamentsByStatus("ongoing");

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-6">
        {/* Upcoming Matches Card */}
        <div className="card-bg rounded-2xl p-5 border border-[#1e273b]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-white">Upcoming Matches</h3>
            <Link
              to="/matches"
              className="text-accent-cyan text-sm hover:text-cyan-300 transition-colors"
            >
              See All
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingMatches.slice(0, 2).map((match) => (
              <div
                key={match.id}
                className="pb-4 border-b border-[#1e273b] last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-[#2a3447] flex items-center justify-center text-xs font-bold flex-shrink-0 text-accent-gold">
                      {match.team1.name.substring(0, 2)}
                    </div>
                    <span className="text-xs font-medium text-white truncate">
                      {match.team1.name}
                    </span>
                  </div>
                  <span className="text-xs text-[#8d95a8] flex-shrink-0">
                    VS
                  </span>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span className="text-xs font-medium text-white truncate">
                      {match.team2.name}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-[#2a3447] flex items-center justify-center text-xs font-bold flex-shrink-0 text-accent-cyan">
                      {match.team2.name.substring(0, 2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Teams Card */}
        <div className="card-bg rounded-2xl p-5 border border-[#1e273b]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-white">Top Teams</h3>
          </div>
          <div className="space-y-3">
            {topTeams.map((team: Team, index: number) => (
              <Link
                key={team.id}
                to={`/team/${team.id}`}
                className="flex items-center justify-between pb-3 border-b border-[#1e273b] last:border-0 last:pb-0 hover:text-accent-cyan transition-colors"
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs text-[#8d95a8] font-bold w-4">
                    {index + 1}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#2a3447] flex items-center justify-center text-xs font-bold text-accent-gold">
                    {team.name.substring(0, 2)}
                  </div>
                  <span className="text-sm font-medium text-white truncate">
                    {team.name}
                  </span>
                </div>
                <span className="text-sm text-accent-cyan font-semibold">
                  0
                </span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Hero Carousel */}
        {filteredTournaments.length > 0 && (
          <HeroCarousel tournaments={filteredTournaments} />
        )}

        {/* Live Banner */}
        <LiveTicker matches={liveMatches} />

        {/* Ongoing Tournaments Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Ongoing Tournaments
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-cyan"></div>
              <p className="mt-4 text-[#8d95a8]">Loading tournaments...</p>
            </div>
          ) : filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#8d95a8] card-bg rounded-xl border border-[#1e273b]">
              <p>No ongoing tournaments at the moment</p>
            </div>
          )}
        </section>

        {/* Recent Matches Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Recent Matches</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-cyan"></div>
              <p className="mt-4 text-[#8d95a8]">Loading matches...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentMatches
                .filter((m) => m.status === "completed")
                .sort((a, b) => {
                  const dateA = a.beginAt || a.date || a.endAt || "";
                  const dateB = b.beginAt || b.date || b.endAt || "";
                  if (!dateA && !dateB) return 0;
                  if (!dateA) return 1;
                  if (!dateB) return -1;
                  return new Date(dateB).getTime() - new Date(dateA).getTime();
                })
                .slice(0, 5)
                .map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              {recentMatches.filter((m) => m.status === "completed").length ===
                0 && (
                  <div className="text-center py-12 text-[#8d95a8]">
                    <p>No recent matches available</p>
                  </div>
                )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
