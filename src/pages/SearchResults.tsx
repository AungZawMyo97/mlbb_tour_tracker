import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useTournamentsStore from "../stores/tournamentsStore";
import { useMatches } from "../hooks/useMatches";
import { useTeams } from "../hooks/useTeams";
import TournamentCard from "../components/TournamentCard";
import MatchCard from "../components/MatchCard";
import { Users } from "lucide-react";

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    const { getAllTournaments } = useTournamentsStore();
    const { matches, loading: matchesLoading } = useMatches();
    const { teams, loading: teamsLoading } = useTeams();

    // Debounce query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(handler);
    }, [query]);

    if (!debouncedQuery) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                    Search Land of Dawn
                </h2>
                <p className="text-[#8d95a8]">
                    Find tournaments, teams, matches, and more...
                </p>
            </div>
        );
    }

    const normalizedQuery = debouncedQuery.toLowerCase();

    // Filter Data
    const filteredTournaments = getAllTournaments().filter(
        (t) =>
            t.name.toLowerCase().includes(normalizedQuery) ||
            t.description.toLowerCase().includes(normalizedQuery),
    );

    const filteredMatches = matches.filter(
        (m) =>
            m.team1.name.toLowerCase().includes(normalizedQuery) ||
            m.team2.name.toLowerCase().includes(normalizedQuery) ||
            m.round.toLowerCase().includes(normalizedQuery),
    );

    const filteredTeams = teams.filter(
        (t) =>
            t.name.toLowerCase().includes(normalizedQuery) ||
            t.region.toLowerCase().includes(normalizedQuery),
    );

    const isLoading = matchesLoading || teamsLoading;

    return (
        <div className="space-y-12 animate-fadeIn pb-12">
            <div className="border-b border-[#1e273b] pb-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Search Results for "{debouncedQuery}"
                </h1>
                <p className="text-[#8d95a8]">
                    Found {filteredTournaments.length} tournaments, {filteredTeams.length}{" "}
                    teams, and {filteredMatches.length} matches
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-cyan"></div>
                </div>
            ) : (
                <>
                    {/* Tournaments Section */}
                    {filteredTournaments.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-accent-gold">🏆</span> Tournaments
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTournaments.map((tournament) => (
                                    <TournamentCard key={tournament.id} tournament={tournament} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Teams Section */}
                    {filteredTeams.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-accent-cyan">👥</span> Teams
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {filteredTeams.map((team) => (
                                    <Link
                                        key={team.id}
                                        to={`/team/${team.id}`}
                                        className="card-bg p-4 rounded-xl border border-[#1e273b] hover:border-accent-cyan transition-colors text-center group"
                                    >
                                        {team.logo ? (
                                            <img
                                                src={team.logo}
                                                alt={team.name}
                                                className="w-16 h-16 mx-auto mb-3 object-contain group-hover:scale-110 transition-transform"
                                                onError={(
                                                    e: React.SyntheticEvent<HTMLImageElement>,
                                                ) => {
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#2a3447] flex items-center justify-center">
                                                <Users className="w-8 h-8 text-[#8d95a8]" />
                                            </div>
                                        )}
                                        <h3 className="text-white font-medium text-sm truncate group-hover:text-accent-cyan">
                                            {team.name}
                                        </h3>
                                        <p className="text-xs text-[#8d95a8] mt-1">{team.region}</p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Matches Section */}
                    {filteredMatches.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-red-400">⚔️</span> Matches
                            </h2>
                            <div className="space-y-4">
                                {filteredMatches.map((match) => (
                                    <MatchCard key={match.id} match={match} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* No Results */}
                    {filteredTournaments.length === 0 &&
                        filteredTeams.length === 0 &&
                        filteredMatches.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-[#2a3447] rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl">🔍</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    No results found
                                </h3>
                                <p className="text-[#8d95a8]">
                                    Try searching for a different tournament, team, or match name.
                                </p>
                            </div>
                        )}
                </>
            )}
        </div>
    );
}

export default SearchResults;
