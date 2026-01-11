# Data Model Documentation

## Overview

This document describes the JSON data structures used in Land of Dawn Web. All data is stored in static JSON files in the `src/data/` directory.

## Tournament Data Structure

**File**: `src/data/tournaments.json`

```json
{
  "id": "m5-world-championship",
  "name": "M5 World Championship",
  "status": "ongoing",
  "startDate": "2024-12-15",
  "endDate": "2024-12-22",
  "location": "Kuala Lumpur, Malaysia",
  "prizePool": "$900,000",
  "featured": true,
  "description": "The biggest Mobile Legends tournament of the year",
  "teams": [
    "team-onic",
    "team-blacklist",
    "team-echo",
    "team-apbren"
  ]
}
```

### Fields:
- `id` (string): Unique tournament identifier
- `name` (string): Tournament name
- `status` (string): "ongoing" | "upcoming" | "completed"
- `startDate` (string): ISO date string (YYYY-MM-DD)
- `endDate` (string): ISO date string (YYYY-MM-DD)
- `location` (string): Tournament location
- `prizePool` (string): Prize pool amount
- `featured` (boolean): Whether to show in hero carousel
- `description` (string): Tournament description
- `teams` (string[]): Array of team IDs participating

## Team Data Structure

**File**: `src/data/teams.json`

```json
{
  "id": "team-onic",
  "name": "ONIC Esports",
  "region": "Indonesia",
  "logo": "https://via.placeholder.com/100/8B5CF6/FFFFFF?text=ONIC",
  "players": [
    {
      "id": "p1",
      "name": "Kairi",
      "role": "Jungler"
    },
    {
      "id": "p2",
      "name": "Sanford",
      "role": "Exp Laner"
    }
  ]
}
```

### Fields:
- `id` (string): Unique team identifier
- `name` (string): Team name
- `region` (string): Team region/country
- `logo` (string): URL to team logo image
- `players` (array): Array of player objects
  - `id` (string): Unique player identifier
  - `name` (string): Player name
  - `role` (string): Player role ("Jungler" | "Exp Laner" | "Mid Laner" | "Gold Laner" | "Roamer")

## Match Data Structure (Best-of-5 Example)

**File**: `src/data/matches.json`

### Complete Match Object

```json
{
  "id": "match-001",
  "tournamentId": "m5-world-championship",
  "round": "Grand Finals",
  "bestOf": 5,
  "status": "completed",
  "date": "2024-12-22",
  "team1": {
    "id": "team-onic",
    "name": "ONIC Esports",
    "score": 3,
    "logo": "https://via.placeholder.com/100/8B5CF6/FFFFFF?text=ONIC"
  },
  "team2": {
    "id": "team-blacklist",
    "name": "Blacklist International",
    "score": 2,
    "logo": "https://via.placeholder.com/100/3B82F6/FFFFFF?text=BLI"
  },
  "games": [
    {
      "gameNumber": 1,
      "winner": "team-onic",
      "duration": "18:45",
      "draft": { ... },
      "stats": { ... },
      "roster": { ... }
    }
  ]
}
```

### Match-Level Fields:
- `id` (string): Unique match identifier
- `tournamentId` (string): Reference to tournament
- `round` (string): Match round (e.g., "Grand Finals", "Semi-Finals")
- `bestOf` (number): Best-of-X series (3 or 5)
- `status` (string): "completed" | "live" | "upcoming"
- `date` (string): ISO date string (YYYY-MM-DD)
- `team1` (object): Team 1 information
  - `id` (string): Team ID
  - `name` (string): Team name
  - `score` (number): Series score
  - `logo` (string): Team logo URL
- `team2` (object): Team 2 information (same structure as team1)
- `games` (array): Array of individual game objects

### Game Object Structure

```json
{
  "gameNumber": 1,
  "winner": "team-onic",
  "duration": "18:45",
  "draft": {
    "team1Bans": ["Lancelot", "Fanny", "Gusion"],
    "team1Picks": [
      {
        "hero": "Ling",
        "player": "Kairi",
        "role": "Jungler"
      },
      {
        "hero": "Yu Zhong",
        "player": "Sanford",
        "role": "Exp Laner"
      },
      {
        "hero": "Lunox",
        "player": "CW",
        "role": "Mid Laner"
      },
      {
        "hero": "Claude",
        "player": "Butsss",
        "role": "Gold Laner"
      },
      {
        "hero": "Mathilda",
        "player": "Kiboy",
        "role": "Roamer"
      }
    ],
    "team2Bans": ["Harley", "Ling", "Yu Zhong"],
    "team2Picks": [
      {
        "hero": "Hayabusa",
        "player": "Wise",
        "role": "Jungler"
      },
      {
        "hero": "Benedetta",
        "player": "Edward",
        "role": "Exp Laner"
      },
      {
        "hero": "Yve",
        "player": "Hadji",
        "role": "Mid Laner"
      },
      {
        "hero": "Brody",
        "player": "OHEB",
        "role": "Gold Laner"
      },
      {
        "hero": "Angela",
        "player": "OhMyV33nus",
        "role": "Roamer"
      }
    ]
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
        { "minute": 2, "team1": 2500, "team2": 2300 },
        { "minute": 4, "team1": 5200, "team2": 4800 },
        { "minute": 6, "team1": 8500, "team2": 8200 },
        { "minute": 8, "team1": 12500, "team2": 11800 },
        { "minute": 10, "team1": 18200, "team2": 17500 },
        { "minute": 12, "team1": 24500, "team2": 23800 },
        { "minute": 14, "team1": 32500, "team2": 31200 },
        { "minute": 16, "team1": 42500, "team2": 39800 },
        { "minute": 18, "team1": 55230, "team2": 51200 }
      ]
    },
    "team2": {
      "kills": 8,
      "deaths": 15,
      "assists": 18,
      "towers": 3,
      "gold": 51200,
      "goldGraph": []
    }
  },
  "roster": {
    "team1": [
      {
        "player": "Kairi",
        "role": "Jungler",
        "kda": "5/1/8",
        "gold": 12500,
        "hero": "Ling"
      },
      {
        "player": "Sanford",
        "role": "Exp Laner",
        "kda": "3/2/6",
        "gold": 11800,
        "hero": "Yu Zhong"
      },
      {
        "player": "CW",
        "role": "Mid Laner",
        "kda": "4/1/9",
        "gold": 13200,
        "hero": "Lunox"
      },
      {
        "player": "Butsss",
        "role": "Gold Laner",
        "kda": "2/2/5",
        "gold": 15200,
        "hero": "Claude"
      },
      {
        "player": "Kiboy",
        "role": "Roamer",
        "kda": "1/2/4",
        "gold": 12530,
        "hero": "Mathilda"
      }
    ],
    "team2": [
      {
        "player": "Wise",
        "role": "Jungler",
        "kda": "3/3/4",
        "gold": 11200,
        "hero": "Hayabusa"
      },
      {
        "player": "Edward",
        "role": "Exp Laner",
        "kda": "2/4/3",
        "gold": 10800,
        "hero": "Benedetta"
      },
      {
        "player": "Hadji",
        "role": "Mid Laner",
        "kda": "1/3/5",
        "gold": 10200,
        "hero": "Yve"
      },
      {
        "player": "OHEB",
        "role": "Gold Laner",
        "kda": "2/3/4",
        "gold": 12200,
        "hero": "Brody"
      },
      {
        "player": "OhMyV33nus",
        "role": "Roamer",
        "kda": "0/3/2",
        "gold": 6800,
        "hero": "Angela"
      }
    ]
  }
}
```

### Game-Level Fields:

#### Draft Phase
- `team1Bans` (string[]): Array of 3 banned heroes for team 1
- `team1Picks` (array): Array of 5 hero picks for team 1
  - `hero` (string): Hero name
  - `player` (string): Player name
  - `role` (string): Player role
- `team2Bans` (string[]): Array of 3 banned heroes for team 2
- `team2Picks` (array): Array of 5 hero picks for team 2 (same structure)

#### Statistics
- `team1` (object): Team 1 statistics
  - `kills` (number): Total kills
  - `deaths` (number): Total deaths
  - `assists` (number): Total assists
  - `towers` (number): Towers destroyed
  - `gold` (number): Total gold earned
  - `goldGraph` (array): Gold progression data points
    - `minute` (number): Game minute
    - `team1` (number): Team 1 gold at this minute
    - `team2` (number): Team 2 gold at this minute
- `team2` (object): Team 2 statistics (same structure)

#### Roster
- `team1` (array): Team 1 player statistics
  - `player` (string): Player name
  - `role` (string): Player role
  - `kda` (string): Kills/Deaths/Assists (e.g., "5/1/8")
  - `gold` (number): Player gold earned
  - `hero` (string): Hero played
- `team2` (array): Team 2 player statistics (same structure)

## Data Relationships

```
Tournament (1) ──→ (N) Matches
Match (1) ──→ (N) Games
Match (N) ──→ (2) Teams
Team (1) ──→ (N) Players
Game (1) ──→ (2) Team Stats
Game (1) ──→ (2) Team Rosters
```

## Usage in Components

### Loading Data
```jsx
import tournamentsData from '../data/tournaments.json'
import matchesData from '../data/matches.json'
import teamsData from '../data/teams.json'
```

### Filtering Examples
```jsx
// Get tournament matches
const tournamentMatches = matchesData.filter(m => m.tournamentId === tournamentId)

// Get live matches
const liveMatches = matchesData.filter(m => m.status === 'live')

// Get team information
const team = teamsData.find(t => t.id === teamId)

// Get completed matches
const completedMatches = matchesData.filter(m => m.status === 'completed')
```

## Notes

- All image URLs use placeholder services. In production, replace with actual team logos and hero images.
- Gold graph data points should ideally be collected every 1-2 minutes during a match.
- KDA format: "Kills/Deaths/Assists" as a string for easy display.
- Hero names should match official Mobile Legends hero names.
- Duration format: "MM:SS" (e.g., "18:45" for 18 minutes 45 seconds).
