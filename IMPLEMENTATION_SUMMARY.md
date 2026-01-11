# API Integration Implementation Summary

## Overview

The tournament listing has been updated to consume real data from PandaScore API instead of static JSON files. The implementation includes proper error handling, loading states, and data transformation.

## Files Modified/Created

### 1. `src/hooks/useTournaments.js` (NEW)
Custom React hook that fetches tournaments from PandaScore API.

**Features:**
- Fetches data based on status ('ongoing', 'upcoming', 'completed')
- Maps status to API endpoints:
  - `ongoing` → `/mlbb/tournaments/running`
  - `upcoming` → `/mlbb/tournaments/upcoming`
  - `completed` → `/mlbb/tournaments/past`
- Handles loading and error states
- Transforms API response to match component structure
- Uses environment variable for API key

**Returns:**
```jsx
{
  tournaments: Array,
  loading: boolean,
  error: string | null
}
```

### 2. `vite.config.js` (UPDATED)
Added proxy configuration to forward `/api` requests to PandaScore API.

**Configuration:**
```js
server: {
  proxy: {
    '/api': {
      target: 'https://api.pandascore.co',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    }
  }
}
```

### 3. `src/pages/Home.jsx` (UPDATED)
Updated to use the `useTournaments` hook instead of static data.

**Changes:**
- Replaced static data import with hook usage
- Added loading spinner UI
- Added error message display
- Maintains tab switching functionality
- Hero carousel uses static data as fallback

### 4. `src/components/TournamentCard.jsx` (UPDATED)
Enhanced to handle API data structure and display logos.

**Changes:**
- Added logo display (from `item.league.image_url`)
- Improved date formatting with fallbacks
- Handles missing/null fields gracefully
- Conditional rendering for optional fields

## Data Transformation

The hook transforms PandaScore API responses to match our component structure:

| API Field | Component Field | Transformation |
|-----------|----------------|---------------|
| `item.id` | `id` | Converted to string |
| `item.league.name + item.name` | `name` | Combined with " - " separator |
| `item.league.image_url` | `logo` | Direct mapping |
| `item.begin_at` | `startDate` | ISO date string |
| `item.end_at` | `endDate` | Falls back to `begin_at` if missing |
| `item.league.location` | `location` | Falls back to "TBA" |
| `item.prizepool` | `prizePool` | Formatted as currency string |

## Usage Example

```jsx
import { useTournaments } from '../hooks/useTournaments'

function TournamentsPage() {
  const [activeTab, setActiveTab] = useState('ongoing')
  const { tournaments, loading, error } = useTournaments(activeTab)

  return (
    <div>
      {/* Tabs */}
      <div>
        {['ongoing', 'upcoming', 'completed'].map(tab => (
          <button onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && <div>Loading...</div>}

      {/* Error State */}
      {error && <div>Error: {error}</div>}

      {/* Tournament List */}
      {!loading && !error && (
        <div>
          {tournaments.map(tournament => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </div>
  )
}
```

## Environment Setup

1. Create `.env` file in project root:
```env
VITE_PANDASCORE_KEY=your_api_key_here
```

2. Get API key from [PandaScore](https://pandascore.co/)

3. Restart dev server after adding `.env` file

## API Request Flow

1. User clicks tab (ongoing/upcoming/completed)
2. `useTournaments` hook detects status change
3. Hook constructs API URL: `/api/mlbb/tournaments/{status}?token={key}`
4. Vite proxy forwards to: `https://api.pandascore.co/mlbb/tournaments/{status}?token={key}`
5. Response is transformed to match component structure
6. Component re-renders with new data

## Error Handling

The implementation handles:
- ✅ Missing API key (shows helpful error message)
- ✅ Network errors (displays error message)
- ✅ API response errors (shows status code and message)
- ✅ Missing/null data fields (uses fallback values)
- ✅ Empty responses (shows "No tournaments" message)

## Testing

To test the implementation:

1. **With API Key:**
   - Set `VITE_PANDASCORE_KEY` in `.env`
   - Start dev server: `npm run dev`
   - Navigate to home page
   - Switch between tabs to see different tournament lists

2. **Without API Key:**
   - Remove or don't set `VITE_PANDASCORE_KEY`
   - Should see error message prompting to set the key

3. **Network Issues:**
   - Disconnect internet
   - Should see network error message

## Next Steps (Optional Enhancements)

- [ ] Add pagination for large tournament lists
- [ ] Cache API responses to reduce requests
- [ ] Add retry logic for failed requests
- [ ] Implement TanStack Query for better caching and state management
- [ ] Add tournament search/filter functionality
- [ ] Enhance featured tournament detection from API data
