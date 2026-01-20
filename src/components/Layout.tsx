import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
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
                className="w-full px-4 py-2 pl-10 bg-card-bg border border-[#1e273b] rounded-lg text-white placeholder-[#8d95a8] focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/50"
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

            {/* User Actions */}
            <div className="flex items-center space-x-6 text-[#8d95a8]">
              <button className="hover:text-white transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </button>
              <button className="hover:text-white transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <button className="hover:text-white transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">{children}</main>

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
