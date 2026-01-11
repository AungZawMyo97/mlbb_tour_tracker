# Code Examples

This document provides key code examples from the Land of Dawn Web project, focusing on the custom hooks and components as requested.

## Custom Hook: useLocalStorage

**File**: `src/hooks/useLocalStorage.js`

```jsx
import { useState, useEffect } from 'react'

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if key doesn't exist
 * @returns {[any, function]} - [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}
```

### Usage Example:

```jsx
import { useLocalStorage } from '../hooks/useLocalStorage'

function MyComponent() {
  const [favorites, setFavorites] = useLocalStorage('my-favorites', [])
  
  const addFavorite = (id) => {
    setFavorites([...favorites, id])
  }
  
  return (
    <div>
      {favorites.map(id => <div key={id}>{id}</div>)}
    </div>
  )
}
```

## MatchCard Component

**File**: `src/components/MatchCard.jsx`

```jsx
import { Link } from 'react-router-dom'
import { Clock, Calendar, Trophy } from 'lucide-react'
import useFavoritesStore from '../stores/favoritesStore'

function MatchCard({ match }) {
  const isTeam1Favorite = useFavoritesStore((state) => state.isTeamFavorite(match.team1.id))
  const isTeam2Favorite = useFavoritesStore((state) => state.isTeamFavorite(match.team2.id))
  const toggleTeamFavorite = useFavoritesStore((state) => state.toggleTeamFavorite)

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 animate-pulse'
      case 'completed':
        return 'bg-green-500'
      case 'upcoming':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'live':
        return 'LIVE'
      case 'completed':
        return 'COMPLETED'
      case 'upcoming':
        return 'UPCOMING'
      default:
        return status.toUpperCase()
    }
  }

  return (
    <Link
      to={`/match/${match.id}`}
      className="block bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-all duration-300 border border-slate-700 hover:border-purple-500 hover:cyber-glow"
    >
      {/* Match Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(match.status)}`}>
            {getStatusText(match.status)}
          </span>
          <span className="text-gray-400 text-sm">{match.round}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{new Date(match.date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Team 1 */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={match.team1.logo}
              alt={match.team1.name}
              className="w-12 h-12 rounded-full border-2 border-slate-600"
            />
            {isTeam1Favorite && (
              <Star className="absolute -top-1 -right-1 w-4 h-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
          <div>
            <p className="font-semibold text-white">{match.team1.name}</p>
            <p className="text-sm text-gray-400">Team 1</p>
          </div>
        </div>

        {/* Score */}
        <div className="text-center">
          <div className="text-3xl font-bold gradient-purple-blue bg-clip-text text-transparent">
            {match.team1.score} - {match.team2.score}
          </div>
          {match.status === 'completed' && (
            <div className="flex items-center justify-center mt-2 space-x-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">
                {match.team1.score > match.team2.score ? match.team1.name : match.team2.name} Wins
              </span>
            </div>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex items-center space-x-3 justify-end">
          <div>
            <p className="font-semibold text-white text-right">{match.team2.name}</p>
            <p className="text-sm text-gray-400 text-right">Team 2</p>
          </div>
          <div className="relative">
            <img
              src={match.team2.logo}
              alt={match.team2.name}
              className="w-12 h-12 rounded-full border-2 border-slate-600"
            />
            {isTeam2Favorite && (
              <Star className="absolute -top-1 -right-1 w-4 h-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
        </div>
      </div>

      {/* Match Info */}
      <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Best of {match.bestOf}</span>
          {match.games && match.games.length > 0 && (
            <span>{match.games.length} games played</span>
          )}
        </div>
        {match.games && match.games[0] && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{match.games[0].duration}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default MatchCard
```

### Key Features:
- **Favorites Integration**: Uses Zustand store to check and display favorite teams
- **Status Badges**: Dynamic color coding based on match status
- **Responsive Layout**: Grid-based layout that adapts to screen size
- **Navigation**: Clicking the card navigates to match details
- **Visual Feedback**: Hover effects with cyber-glow styling

## Zustand Favorites Store

**File**: `src/stores/favoritesStore.js`

```jsx
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favoriteTeams: [],
      favoriteTournaments: [],
      
      toggleTeamFavorite: (teamId) => set((state) => ({
        favoriteTeams: state.favoriteTeams.includes(teamId)
          ? state.favoriteTeams.filter(id => id !== teamId)
          : [...state.favoriteTeams, teamId]
      })),
      
      toggleTournamentFavorite: (tournamentId) => set((state) => ({
        favoriteTournaments: state.favoriteTournaments.includes(tournamentId)
          ? state.favoriteTournaments.filter(id => id !== tournamentId)
          : [...state.favoriteTournaments, tournamentId]
      })),
      
      isTeamFavorite: (teamId) => {
        return get().favoriteTeams.includes(teamId)
      },
      
      isTournamentFavorite: (tournamentId) => {
        return get().favoriteTournaments.includes(tournamentId)
      },
    }),
    {
      name: 'land-of-dawn-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useFavoritesStore
```

### Usage Example:

```jsx
import useFavoritesStore from '../stores/favoritesStore'

function TournamentCard({ tournament }) {
  const toggleTournamentFavorite = useFavoritesStore(
    (state) => state.toggleTournamentFavorite
  )
  const isTournamentFavorite = useFavoritesStore(
    (state) => state.isTournamentFavorite
  )

  return (
    <div>
      <button onClick={() => toggleTournamentFavorite(tournament.id)}>
        <Star
          className={
            isTournamentFavorite(tournament.id)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-400'
          }
        />
      </button>
    </div>
  )
}
```

## Draft Phase Visualizer

**File**: `src/pages/MatchDetail.jsx` (excerpt)

```jsx
{/* Draft Phase */}
<div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
  <h3 className="text-2xl font-bold mb-6 gradient-purple-blue bg-clip-text text-transparent">
    Draft Phase
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Team 1 Draft */}
    <div>
      <h4 className="text-lg font-semibold mb-4 text-purple-400">{match.team1.name}</h4>
      
      {/* Bans */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Bans</p>
        <div className="flex flex-wrap gap-2">
          {currentGame.draft.team1Bans.map((hero, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-xs font-semibold"
              title={hero}
            >
              {hero.substring(0, 2)}
            </div>
          ))}
        </div>
      </div>

      {/* Picks */}
      <div>
        <p className="text-sm text-gray-400 mb-2">Picks</p>
        <div className="space-y-2">
          {currentGame.draft.team1Picks.map((pick, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 bg-slate-700/50 rounded-lg p-2"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-xs font-semibold">
                {pick.hero.substring(0, 2)}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{pick.hero}</p>
                <p className="text-xs text-gray-400">{pick.player} - {pick.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Team 2 Draft - Similar structure */}
  </div>
</div>
```

## Gold Graph with Recharts

**File**: `src/pages/MatchDetail.jsx` (excerpt)

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

{activeTab === 'gold' && currentGame.stats.team1.goldGraph && (
  <div>
    <h4 className="text-xl font-bold mb-4">Gold Graph</h4>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={currentGame.stats.team1.goldGraph}>
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis dataKey="minute" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
          labelStyle={{ color: '#e2e8f0' }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="team1"
          stroke="#8b5cf6"
          strokeWidth={2}
          name={match.team1.name}
        />
        <Line
          type="monotone"
          dataKey="team2"
          stroke="#3b82f6"
          strokeWidth={2}
          name={match.team2.name}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}
```

## Routing Setup

**File**: `src/App.jsx`

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import TournamentDetail from './pages/TournamentDetail'
import MatchDetail from './pages/MatchDetail'
import BracketView from './pages/BracketView'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournament/:id" element={<TournamentDetail />} />
          <Route path="/match/:id" element={<MatchDetail />} />
          <Route path="/bracket/:tournamentId" element={<BracketView />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
```

## Styling Utilities

**File**: `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-900 text-gray-100;
  }
}

@layer utilities {
  .gradient-purple-blue {
    @apply bg-gradient-to-r from-purple-600 to-blue-600;
  }
  
  .gradient-purple-blue-hover {
    @apply bg-gradient-to-r from-purple-700 to-blue-700;
  }
  
  .cyber-glow {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
  }
}
```

These code examples demonstrate the core functionality of the Land of Dawn Web application, including state management, component structure, and data visualization.
