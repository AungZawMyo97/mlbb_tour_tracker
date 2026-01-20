import { Link, useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { ReactNode, useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] flex flex-col">
      {/* Navigation */}
      <nav className="header-bg sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 group flex-shrink-0"
            >
              <Trophy className="w-6 h-6 text-accent-gold group-hover:text-yellow-400 transition-colors" />
              <span className="text-lg font-bold text-accent-gold hidden sm:inline">
                DAWN TRACKER
              </span>
            </Link>

            {/* Search Bar */}
            <div className="relative w-96 hidden md:block">
              <input
                type="text"
                placeholder="Search for tournament..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full px-4 py-2 pl-10 card-bg border border-[#1e273b] rounded-lg text-white placeholder-[#8d95a8] focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/50"
              />
              <span className="absolute left-3 top-2.5 text-[#8d95a8]">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>


          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#1e273b] bg-[#0f1420] py-8">
        <div className="px-6 py-4 text-center">
          <p className="text-sm text-[#8d95a8]">
            © 2026 MLBB Tournament Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
