# Leagues API Integration

## Overview
The application now uses the PandaScore Leagues API (`/api/mlbb/leagues`) to fetch accurate league information and images for tournaments.

## Implementation

### 1. Created `leaguesStore.js`
A Zustand store that:
- Fetches all MLBB leagues from the API
- Stores league data with images, names, locations
- Provides helper methods to find leagues by ID or name
- Caches league data for the entire app session

### 2. Updated `App.jsx`
- Fetches leagues first, then tournaments
- Ensures league data is available when transforming tournaments
- Both stores are initialized at app start

### 3. Updated `tournamentsStore.js`
- Now matches tournaments with leagues from the leagues store
- Uses league images from the leagues API instead of tournament API
- Falls back to tournament league data if league not found
- Stores full league object with tournaments for reference

## Data Flow

1. **App Start**: Fetch leagues from `/api/mlbb/leagues`
2. **After Leagues Load**: Fetch tournaments from tournament endpoints
3. **Tournament Transformation**: Match each tournament with its league using league ID
4. **Display**: Use league image, name, and location from leagues API

## League Data Structure

```javascript
{
  id: string,
  name: string,
  slug: string,
  imageUrl: string,  // League logo/image
  url: string,
  location: string,
  _apiData: original API response
}
```

## Tournament-League Matching

Tournaments are matched with leagues using:
- `item.league?.id` - League ID from tournament data
- `item.league_id` - Alternative league ID field

If a league is found in the leagues store:
- Uses league image from leagues API
- Uses league name and location
- Stores full league object with tournament

If league not found:
- Falls back to tournament's embedded league data
- Still works but may have less accurate information

## Benefits

1. **Accurate Images**: League logos come directly from leagues API
2. **Better Data**: More complete league information
3. **Consistency**: All leagues use the same data source
4. **Performance**: Leagues fetched once and cached

## API Endpoint

- **Leagues**: `GET /api/mlbb/leagues?token={apiKey}&per_page=100`
- Proxied through Vite to: `https://api.pandascore.co/mlbb/leagues`

## Components Updated

- `TournamentCard`: Displays league logo with better styling
- `TournamentDetail`: Shows larger league logo in tournament header
- `HeroCarousel`: Uses league images from leagues API
