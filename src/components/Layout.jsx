import { Link } from "react-router-dom";
import { Trophy, Star, Home, Users } from "lucide-react";
import useFavoritesStore from "../stores/favoritesStore";

function Layout({ children }) {
  const favoriteTournaments =
    useFavoritesStore((state) => state.favoriteTournaments) || [];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-purple-500/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Trophy className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300 transition-colors drop-shadow-lg" />
                <div className="absolute inset-0 bg-yellow-400/20 blur-xl group-hover:bg-yellow-400/30 transition-colors"></div>
              </div>
              <span className="text-2xl font-bold gradient-purple-blue bg-clip-text text-transparent drop-shadow-lg">
                MLBB Tournaments
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all px-3 py-2 rounded-lg hover:bg-purple-500/10 hover:border hover:border-purple-500/20"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>

              <Link
                to="/teams"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all px-3 py-2 rounded-lg hover:bg-purple-500/10 hover:border hover:border-purple-500/20"
              >
                <Users className="w-5 h-5" />
                <span>Teams</span>
              </Link>

              {favoriteTournaments.length > 0 && (
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-all px-3 py-2 rounded-lg hover:bg-yellow-400/10 hover:border hover:border-yellow-400/20"
                >
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>Watchlist ({favoriteTournaments.length})</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 mt-16 py-8 bg-gradient-to-t from-slate-900 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300 font-semibold">
            Land of Dawn Web - MLBB Tournament Tracker
          </p>
          <p className="text-sm mt-2 text-gray-500">
            M7 World Championship Edition
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
