import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Radio } from "lucide-react";
import type { Match } from "../hooks/useMatches";

interface LiveTickerProps {
  matches: Match[];
}

function LiveTicker({ matches }: LiveTickerProps) {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const liveMatches = matches.filter((m) => m.status === "live");

  useEffect(() => {
    if (liveMatches.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMatchIndex((prev) => (prev + 1) % liveMatches.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [liveMatches.length]);

  if (liveMatches.length === 0) {
    return (
      <div className="card-bg rounded-lg p-6 border border-[#1e273b]">
        <div className="flex items-center justify-center space-x-2 text-[#8d95a8]">
          <Radio className="w-5 h-5" />
          <span>No live matches at the moment</span>
        </div>
      </div>
    );
  }

  const currentMatch = liveMatches[currentMatchIndex];

  return (
    <div className="live-banner rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between gap-6">
        <div className="badge-gold rounded-full">
          <Radio className="w-4 h-4 inline mr-2" />
          <span>LIVE NOW</span>
        </div>

        <div className="flex-1 text-center">
          <div className="text-sm text-[#8d95a8] mb-3">LIVE GRAND FINALS</div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-gold flex items-center justify-center text-black font-bold text-sm">
                {currentMatch.team1.name.substring(0, 2)}
              </div>
              <span className="font-bold text-white">
                {currentMatch.team1.name} ({currentMatch.team1.score})
              </span>
            </div>
            <span className="text-[#8d95a8] text-lg font-semibold">vs</span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">
                {currentMatch.team2.name} ({currentMatch.team2.score})
              </span>
              <div className="w-10 h-10 rounded-full bg-accent-cyan flex items-center justify-center text-black font-bold text-sm">
                {currentMatch.team2.name.substring(0, 2)}
              </div>
            </div>
          </div>
        </div>

        <div className="badge-cyan rounded-full">
          <Radio className="w-4 h-4 inline mr-2" />
          <span>LIVE NOW</span>
        </div>
      </div>
    </div>
  );
}
export default LiveTicker;
