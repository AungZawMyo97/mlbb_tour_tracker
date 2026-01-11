# Land of Dawn Web - Project Structure

## Complete File Tree

```
land-of-dawn-web/
├── public/                    # Static assets (if any)
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Layout.jsx        # Main app layout with navigation
│   │   ├── HeroCarousel.jsx  # Featured tournament carousel
│   │   ├── LiveTicker.jsx    # Live match score ticker
│   │   ├── MatchCard.jsx     # Match card with favorites
│   │   └── TournamentCard.jsx # Tournament card component
│   ├── pages/                # Page-level components
│   │   ├── Home.jsx          # Tournament dashboard (main page)
│   │   ├── TournamentDetail.jsx # Individual tournament page
│   │   ├── MatchDetail.jsx   # Match details with draft & stats
│   │   └── BracketView.jsx   # Interactive bracket visualization
│   ├── hooks/                # Custom React hooks
│   │   └── useLocalStorage.js # LocalStorage management hook
│   ├── stores/               # Zustand state management
│   │   └── favoritesStore.js # Favorites store with persistence
│   ├── data/                 # Static JSON data (mock data)
│   │   ├── tournaments.json  # Tournament listings
│   │   ├── matches.json      # Match data with full game details
│   │   └── teams.json        # Team and player information
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles (Tailwind imports)
├── .eslintrc.cjs             # ESLint configuration
├── .gitignore                # Git ignore rules
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.js            # Vite build configuration
├── README.md                 # Project documentation
└── PROJECT_STRUCTURE.md      # This file
```

## Component Hierarchy

```
App
└── Router
    └── Layout
        ├── Navigation (with favorites count)
        └── Routes
            ├── Home
            │   ├── HeroCarousel
            │   ├── LiveTicker
            │   ├── TournamentCard[] (filtered by status)
            │   └── MatchCard[] (recent matches)
            ├── TournamentDetail
            │   ├── Tournament Info
            │   ├── Bracket Link
            │   └── MatchCard[] (tournament matches)
            ├── MatchDetail
            │   ├── Match Header
            │   ├── Game Selector
            │   ├── Draft Phase Visualizer
            │   └── Stats Tabs (Summary/Gold/Roster)
            └── BracketView
                ├── Bracket Visualization
                └── Match Detail Modal
```

## Data Flow

1. **Static Data**: JSON files in `src/data/` are imported directly
2. **State Management**: Zustand store handles favorites with localStorage persistence
3. **Routing**: React Router v6 manages navigation between pages
4. **LocalStorage**: User preferences persist via Zustand's persist middleware

## Key Features by Component

### Layout.jsx
- Navigation bar with logo and home link
- Favorites count display
- Footer

### HeroCarousel.jsx
- Auto-rotating featured tournaments
- Manual navigation controls
- Favorite toggle button
- Responsive design

### LiveTicker.jsx
- Simulated live match updates
- Auto-cycling through live matches
- Visual indicators

### MatchCard.jsx
- Team logos and scores
- Status badges
- Favorite indicators
- Click to navigate to match details

### TournamentCard.jsx
- Tournament information
- Status badges
- Favorite toggle
- Link to tournament details

### Home.jsx
- Tabbed tournament view (Ongoing/Upcoming/Completed)
- Recent matches section
- Integrates HeroCarousel and LiveTicker

### TournamentDetail.jsx
- Full tournament information
- Link to bracket view
- List of tournament matches

### MatchDetail.jsx
- Game selector (for Best-of-X series)
- Draft phase visualization (Bans & Picks)
- Stats tabs:
  - Summary: Kills, Deaths, Assists, Towers, Gold
  - Gold: Interactive chart using Recharts
  - Roster: Player KDA and gold stats

### BracketView.jsx
- Visual bracket representation
- Clickable match nodes
- Modal for quick match preview
- Link to full match details

## Custom Hooks

### useLocalStorage.js
Generic hook for localStorage management with React state synchronization.

**Usage:**
```jsx
const [favorites, setFavorites] = useLocalStorage('favorites', [])
```

## State Management

### favoritesStore.js (Zustand)
Manages user favorites with automatic localStorage persistence.

**Actions:**
- `toggleTeamFavorite(teamId)`
- `toggleTournamentFavorite(tournamentId)`
- `isTeamFavorite(teamId)` → boolean
- `isTournamentFavorite(tournamentId)` → boolean

**State:**
- `favoriteTeams: string[]`
- `favoriteTournaments: string[]`

## Styling Approach

- **Framework**: Tailwind CSS utility classes
- **Theme**: Dark mode (slate-900 background)
- **Gradients**: Purple-to-blue for primary actions
- **Responsive**: Mobile-first with md: and lg: breakpoints
- **Custom Utilities**: Defined in `index.css` (gradient-purple-blue, cyber-glow)

## Routing Structure

- `/` - Home (Tournament Dashboard)
- `/tournament/:id` - Tournament Detail Page
- `/match/:id` - Match Detail Page
- `/bracket/:tournamentId` - Bracket View
