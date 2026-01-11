# Land of Dawn Web - MLBB Tournament Tracker

A modern, serverless Single Page Application (SPA) for tracking Mobile Legends: Bang Bang tournaments. Built with React, Vite, and Tailwind CSS.

## 🎮 Features

- **Tournament Dashboard**: Browse ongoing, upcoming, and completed tournaments
- **Hero Carousel**: Featured tournament highlights with auto-rotation
- **Live Match Ticker**: Real-time match score updates (simulated)
- **Interactive Bracket View**: Visual tournament bracket with match details
- **Match Detail Room**: Comprehensive match analysis including:
  - Draft Phase (Bans & Picks)
  - Match Statistics (Kills, Deaths, Assists, Towers, Gold)
  - Gold Graph Visualization
  - Player Rosters with KDA
- **User Personalization**: Save favorite teams and tournaments to LocalStorage
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with localStorage persistence)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Charts**: Recharts

## 📁 Project Structure

```
land-of-dawn-web/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx       # Main layout with navigation
│   │   ├── HeroCarousel.jsx # Featured tournament carousel
│   │   ├── LiveTicker.jsx   # Live match score ticker
│   │   ├── MatchCard.jsx    # Match card component with favorites
│   │   └── TournamentCard.jsx # Tournament card component
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Tournament dashboard
│   │   ├── TournamentDetail.jsx # Tournament details page
│   │   ├── MatchDetail.jsx  # Match details with draft & stats
│   │   └── BracketView.jsx  # Interactive bracket visualization
│   ├── hooks/               # Custom React hooks
│   │   └── useLocalStorage.js # LocalStorage management hook
│   ├── stores/              # Zustand state stores
│   │   └── favoritesStore.js # Favorites state with persistence
│   ├── data/                # Static JSON data files
│   │   ├── tournaments.json # Tournament data
│   │   ├── matches.json     # Match data with draft & stats
│   │   └── teams.json       # Team and player data
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Data Model

### Tournament Structure
```json
{
  "id": "tournament-id",
  "name": "Tournament Name",
  "status": "ongoing|upcoming|completed",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "location": "City, Country",
  "prizePool": "$XXX,XXX",
  "featured": true|false,
  "description": "Tournament description",
  "teams": ["team-id-1", "team-id-2", ...]
}
```

### Match Structure (Best-of-5 Example)
```json
{
  "id": "match-id",
  "tournamentId": "tournament-id",
  "round": "Grand Finals",
  "bestOf": 5,
  "status": "completed|live|upcoming",
  "date": "YYYY-MM-DD",
  "team1": {
    "id": "team-id",
    "name": "Team Name",
    "score": 3,
    "logo": "logo-url"
  },
  "team2": { ... },
  "games": [
    {
      "gameNumber": 1,
      "winner": "team-id",
      "duration": "MM:SS",
      "draft": {
        "team1Bans": ["Hero1", "Hero2", "Hero3"],
        "team1Picks": [
          {
            "hero": "Hero Name",
            "player": "Player Name",
            "role": "Jungler|Exp Laner|Mid Laner|Gold Laner|Roamer"
          }
        ],
        "team2Bans": [...],
        "team2Picks": [...]
      },
      "stats": {
        "team1": {
          "kills": 15,
          "deaths": 8,
          "assists": 32,
          "towers": 7,
          "gold": 65230,
          "goldGraph": [
            { "minute": 0, "team1": 0, "team2": 0 },
            ...
          ]
        },
        "team2": { ... }
      },
      "roster": {
        "team1": [
          {
            "player": "Player Name",
            "role": "Jungler",
            "kda": "5/1/8",
            "gold": 12500,
            "hero": "Hero Name"
          }
        ],
        "team2": [...]
      }
    }
  ]
}
```

## 🎨 Design System

### Color Palette
- **Background**: Slate-900 (Dark mode default)
- **Primary Gradient**: Purple-600 to Blue-600
- **Accent Colors**: 
  - Purple-500 (Team 1)
  - Blue-500 (Team 2)
  - Yellow-400 (Trophy/Favorites)
  - Red-500 (Live status)
  - Green-500 (Completed status)

### Typography
- **Headings**: Bold, gradient text for emphasis
- **Body**: Gray-100 to Gray-400 for hierarchy

## 🔧 Custom Hooks

### `useLocalStorage(key, initialValue)`
Manages localStorage with React state synchronization.

```jsx
const [value, setValue] = useLocalStorage('myKey', [])
```

### Zustand Store: `useFavoritesStore`
Manages favorites with automatic localStorage persistence.

```jsx
const toggleTeamFavorite = useFavoritesStore(state => state.toggleTeamFavorite)
const isTeamFavorite = useFavoritesStore(state => state.isTeamFavorite)
```

## 📱 Responsive Breakpoints

- **Mobile**: Single column layout
- **Tablet (md)**: 2-column grid
- **Desktop (lg)**: 3-column grid

## 🎯 Key Components

### MatchCard
Displays match information with team logos, scores, and favorite indicators. Clicking navigates to match details.

### HeroCarousel
Auto-rotating carousel showcasing featured tournaments with navigation controls.

### LiveTicker
Simulated live match ticker that cycles through active matches.

### BracketView
Interactive tournament bracket visualization with clickable match nodes.

## 🔐 Data Persistence

All user preferences (favorites) are stored in browser LocalStorage using Zustand's persist middleware. No backend required!

## 📝 License

This project is for demonstration purposes only.
