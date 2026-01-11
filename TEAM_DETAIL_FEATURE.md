# Team Detail Page Feature

## Overview
A comprehensive team details page that displays team information, roster, statistics, and recent matches.

## Implementation

### 1. Created `TeamDetail.jsx` Page
**Location**: `src/pages/TeamDetail.jsx`

**Features**:
- Team header with logo, name, and favorite toggle
- Team statistics (Wins, Losses, Total Matches) calculated from match history
- Team roster display with player cards
- Recent matches section showing team's match history
- Responsive design with glass morphism effects

### 2. Added Route
**File**: `src/App.jsx`
- Added route: `/team/:id`

### 3. Updated Components to Link to Team Details

#### `MatchCard.jsx`
- Team names and logos are now clickable links
- Links navigate to `/team/:id`
- Uses `stopPropagation()` to prevent card click when clicking team link

#### `MatchDetail.jsx`
- Team sections are clickable links to team detail pages
- Added hover effects and "View Team Details" text

#### `LiveTicker.jsx`
- Team names in live ticker are clickable links

#### `BracketView.jsx`
- Team names in bracket matches are clickable links
- Team names in match modal are clickable links

## Team Detail Page Sections

### 1. Team Header
- Large team logo (or gradient placeholder)
- Team name with gradient text
- Favorite toggle button
- Team statistics cards:
  - Wins (green)
  - Losses (red)
  - Total Matches (purple)
- Team region and player count

### 2. Team Roster
- Grid layout of player cards
- Each player card shows:
  - Player avatar (gradient circle with initial)
  - Player name
  - Player role (Jungler, Exp Laner, etc.)
- Responsive: 1 column (mobile) → 5 columns (desktop)

### 3. Recent Matches
- Shows up to 10 most recent matches
- Matches sorted by date (latest first)
- Uses MatchCard component for consistency
- Shows all matches where team participated

## Data Flow

1. **Team Data**: Fetched from `/api/mlbb/teams/{id}` using `useTeams` hook
2. **Match History**: Fetched from `/api/mlbb/matches` and filtered by team ID
3. **Statistics**: Calculated client-side from match results
4. **Roster**: Displayed from team data's players array

## Statistics Calculation

- **Wins**: Matches where team won (team1.score > team2.score if team is team1, vice versa)
- **Losses**: Matches where team lost
- **Total Matches**: All completed matches the team participated in

## Navigation

Users can access team details by clicking on:
- Team names in match cards
- Team logos in match cards
- Team names in live ticker
- Team names in match detail pages
- Team names in bracket view

## Styling

- Glass morphism effects for cards
- Gradient text for headings
- Color-coded statistics (green for wins, red for losses)
- Hover effects on interactive elements
- Responsive grid layouts

## Future Enhancements (Optional)

- Player detail pages
- Team performance graphs
- Head-to-head statistics
- Tournament history
- Team achievements/trophies
