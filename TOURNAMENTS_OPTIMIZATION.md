# Tournaments API Optimization

## Overview
Tournaments are now fetched only once at app start instead of making separate API calls for each tab (ongoing, upcoming, completed).

## Changes Made

### 1. Created `tournamentsStore.js`
A Zustand store that:
- Fetches all tournament types (running, upcoming, past) in parallel at app start
- Stores tournaments by status for efficient filtering
- Provides helper methods to get tournaments by status or find by ID
- Caches the data to avoid redundant API calls

### 2. Updated `App.jsx`
- Added `useEffect` to fetch all tournaments once when the app starts
- This ensures tournaments are available throughout the app lifecycle

### 3. Updated Components

#### `Home.jsx`
- Removed `useTournaments` hook calls
- Now uses `useTournamentsStore` to get cached tournaments
- Filters tournaments client-side based on active tab
- No API calls when switching tabs

#### `TournamentDetail.jsx`
- Removed multiple `useTournaments` hook calls
- Uses `findTournamentById` from store to get tournament
- No API calls needed

#### `BracketView.jsx`
- Removed multiple `useTournaments` hook calls
- Uses `findTournamentById` from store
- No API calls needed

## Benefits

1. **Performance**: Only 3 API calls at app start instead of 3 calls per tab switch
2. **Speed**: Tab switching is instant (client-side filtering)
3. **Efficiency**: Reduced API rate limit usage
4. **Consistency**: All components use the same cached data

## API Calls

### Before
- Home page load: 1 call (for initial tab)
- Switch to "Upcoming": 1 call
- Switch to "Completed": 1 call
- Visit Tournament Detail: 3 calls (to find tournament)
- **Total**: 5+ calls per session

### After
- App start: 3 calls (all tournament types in parallel)
- Tab switching: 0 calls (client-side filtering)
- Visit Tournament Detail: 0 calls (uses cached data)
- **Total**: 3 calls per session

## Store API

```javascript
// Get tournaments by status
const tournaments = useTournamentsStore(state => 
  state.getTournamentsByStatus('ongoing')
)

// Get all tournaments
const allTournaments = useTournamentsStore(state => 
  state.getAllTournaments()
)

// Find tournament by ID
const tournament = useTournamentsStore(state => 
  state.findTournamentById(tournamentId)
)

// Check loading state
const loading = useTournamentsStore(state => state.loading)

// Check error state
const error = useTournamentsStore(state => state.error)
```

## Future Enhancements

- Add refresh functionality to manually refetch tournaments
- Add auto-refresh interval (e.g., every 5 minutes)
- Add cache expiration logic
- Store last fetched timestamp for debugging
