# API Setup Guide

## PandaScore API Integration

This project uses PandaScore API to fetch real tournament data for Mobile Legends: Bang Bang.

### Environment Variables

1. Create a `.env` file in the root directory:

```env
VITE_PANDASCORE_KEY=your_api_key_here
```

2. Get your API key from [PandaScore](https://pandascore.co/)

### Vite Proxy Configuration

The `vite.config.js` includes a proxy configuration that forwards requests from `/api` to `https://api.pandascore.co` to avoid CORS issues during development.

**How it works:**
- Frontend makes request to: `/api/mlbb/tournaments/running`
- Vite proxy forwards to: `https://api.pandascore.co/mlbb/tournaments/running`
- The API key is appended as a query parameter: `?token=your_api_key`

### API Endpoints Used

1. **Ongoing Tournaments**: `GET /mlbb/tournaments/running`
2. **Upcoming Tournaments**: `GET /mlbb/tournaments/upcoming`
3. **Completed Tournaments**: `GET /mlbb/tournaments/past`

### Data Mapping

The `useTournaments` hook transforms PandaScore API responses to match our component structure:

| PandaScore Field | Our Component Field | Notes |
|-----------------|---------------------|-------|
| `item.league.name + item.name` | `name` | Combined league and tournament name |
| `item.league.image_url` | `logo` | Tournament/league logo |
| `item.begin_at` | `startDate` | Tournament start date |
| `item.end_at` | `endDate` | Tournament end date (falls back to begin_at) |
| `item.league.location` | `location` | Tournament location |
| `item.prizepool` | `prizePool` | Formatted as currency string |

### Usage

```jsx
import { useTournaments } from '../hooks/useTournaments'

function MyComponent() {
  const { tournaments, loading, error } = useTournaments('ongoing')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {tournaments.map(tournament => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  )
}
```

### Status Mapping

The hook maps our internal status values to API endpoints:

- `ongoing` → `running`
- `upcoming` → `upcoming`
- `completed` → `past`

### Error Handling

The hook handles:
- Missing API key
- Network errors
- API response errors
- Missing or null data fields

### Production Deployment

For production, you may need to:
1. Set up a backend proxy to hide the API key
2. Or use environment variables in your deployment platform
3. Ensure CORS is properly configured if not using a proxy
