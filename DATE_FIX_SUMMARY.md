# Match Date Fix Summary

## Issue
Match dates were not being correctly displayed according to the API response.

## Changes Made

### 1. Updated `useMatches.js` Hook
- Now captures multiple date fields from API:
  - `scheduled_at` - When the match is scheduled (for upcoming matches)
  - `begin_at` - When the match actually started
  - `end_at` - When the match ended
- Primary `date` field now uses `scheduled_at` if available, otherwise `begin_at`
- All date fields are preserved in the match object for flexible display

### 2. Created `dateFormatter.js` Utility
New utility functions for consistent date formatting:
- `formatMatchDate()` - Formats date only
- `formatMatchDateTime()` - Formats date with time and timezone
- `formatRelativeTime()` - Formats relative time (e.g., "in 2 hours")

### 3. Updated `MatchCard.jsx`
- Uses date formatter utilities
- Shows date and time for upcoming matches (using `scheduledAt`)
- Shows date and time for started/completed matches (using `beginAt`)
- Falls back gracefully if dates are missing

### 4. Updated `MatchDetail.jsx`
- Displays match date information in the header
- Shows "Scheduled: [date]" for upcoming matches
- Shows "Started: [date]" for matches that have begun
- Uses proper date formatting utilities

## Date Field Priority

The match date is determined in this order:
1. `scheduled_at` (for upcoming matches)
2. `begin_at` (for matches that have started)
3. `null` (if neither is available, shows "TBA")

## API Date Fields Used

| API Field | Usage | When Available |
|-----------|-------|----------------|
| `scheduled_at` | Primary date for upcoming matches | Before match starts |
| `begin_at` | When match actually started | After match starts |
| `end_at` | When match ended | After match completes |

## Display Format

- **Upcoming matches**: Shows scheduled date and time with timezone
- **Live/Completed matches**: Shows start date and time with timezone
- **Missing dates**: Shows "TBA"

## Example Output

- Upcoming: "Scheduled: Dec 22, 2024, 10:00 AM PST"
- Started: "Started: Dec 22, 2024, 10:15 AM PST"
- No date: "TBA"
