# API Migration Summary

All dummy JSON files have been removed and replaced with real API calls to PandaScore.

## Changes Made

### 1. Created New API Hooks

#### `useMatches.js`
- Fetches matches from `/api/mlbb/matches`
- Supports filtering by tournament ID and status
- Transforms API response to match component structure

#### `useTeams.js`
- Fetches teams from `/api/mlbb/teams`
- Supports fetching single team or all teams
- Transforms API response to match component structure

### 2. Updated Components

#### `Home.jsx`
- ✅ Removed `tournaments.json` import
- ✅ Removed `matches.json` import
- ✅ Uses `useTournaments` hook for tournament list
- ✅ Uses `useMatches` hook for live matches and recent matches
- ✅ Hero carousel uses API tournaments

#### `TournamentDetail.jsx`
- ✅ Removed `tournaments.json` import
- ✅ Removed `matches.json` import
- ✅ Uses `useTournaments` to find tournament by ID
- ✅ Uses `useMatches` to fetch tournament matches

#### `MatchDetail.jsx`
- ✅ Removed `matches.json` import
- ✅ Removed `teams.json` import
- ✅ Uses `useMatches` to find match by ID
- ✅ Uses `useTeams` to fetch team data
- ✅ Handles missing detailed game data gracefully

#### `BracketView.jsx`
- ✅ Removed `tournaments.json` import
- ✅ Removed `matches.json` import
- ✅ Removed `teams.json` import
- ✅ Uses `useTournaments` to find tournament
- ✅ Uses `useMatches` to fetch tournament matches
- ✅ Gets team logos from match data

### 3. Deleted Files

- ❌ `src/data/tournaments.json` - Deleted
- ❌ `src/data/matches.json` - Deleted
- ❌ `src/data/teams.json` - Deleted

## API Data Structure

### Matches API Response
The `useMatches` hook transforms PandaScore match data:
```javascript
{
  id: string,
  tournamentId: string,
  round: string,
  bestOf: number,
  status: 'live' | 'completed' | 'upcoming',
  date: string,
  team1: { id, name, score, logo },
  team2: { id, name, score, logo },
  _apiData: original API response
}
```

### Teams API Response
The `useTeams` hook transforms PandaScore team data:
```javascript
{
  id: string,
  name: string,
  region: string,
  logo: string,
  players: [{ id, name, role }],
  _apiData: original API response
}
```

## Important Notes

### Match Detail Limitations
The PandaScore API may not provide detailed game data like:
- Draft phase (bans/picks)
- Detailed statistics (KDA, gold graphs)
- Player rosters with game-specific data

The `MatchDetail` component handles this gracefully:
- Shows basic match info when detailed data is unavailable
- Displays team rosters from team data if available
- Hides sections that require detailed game data

### Tournament ID Matching
Tournament IDs from the API may be numeric, so components check both:
- `tournament.id === id`
- `tournament._apiData?.id?.toString() === id`

### Loading States
All components now include:
- Loading spinners while fetching data
- Error messages for API failures
- Empty states when no data is available

## Testing Checklist

- [ ] Home page loads tournaments from API
- [ ] Tab switching fetches different tournament lists
- [ ] Live ticker shows live matches from API
- [ ] Tournament detail page loads tournament and matches
- [ ] Match detail page loads match and team data
- [ ] Bracket view loads tournament matches
- [ ] All loading states display correctly
- [ ] Error states handle API failures gracefully

## Environment Setup

Ensure `.env` file contains:
```env
VITE_PANDASCORE_KEY=your_api_key_here
```

## Next Steps (Optional)

If you need detailed game data (draft, stats, rosters), you may need to:
1. Use a different API endpoint that provides game details
2. Store game data separately when matches are played
3. Use webhooks to receive real-time match updates
