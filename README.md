# 🏓 Ping Pong Tracker

A production-ready MVP web app to track office ping-pong results with fair Elo-based rankings. Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Fair Rankings**: Elo-based rating system with margin-of-victory multiplier
- **Weekly Winners**: Top performer per ISO week (min 2 matches)
- **Monthly Champions**: Top performer per calendar month (min 4 matches)
- **Cups System**: Track historical monthly championships
- **Retroactive Entries**: Submit matches with custom dates
- **Real-time Updates**: Instant leaderboard updates
- **Timezone Support**: America/Denver timezone for weekly/monthly grouping

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: Prisma + SQLite
- **State Management**: Redux Toolkit
- **Date Handling**: date-fns + date-fns-tz

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Data Model

### Players
- Unique names (case-insensitive)
- Auto-created when first match is added
- Initial Elo rating: 1000

### Matches
- Best-of-N games format (players choose N)
- No ties allowed
- Retroactive entries supported
- Used for weekly/monthly grouping

### Ratings
- Elo snapshots after each match
- K-factor: 24
- MOV multiplier: ln(1 + |gamesA - gamesB|)
- Expected score: 1 / (1 + 10^((rb - ra)/400))

### Championships
- Auto-created when first match of month is added
- Administrative only (champions computed from matches)

## Ranking Logic

### Elo System
```typescript
function updateElo({ ra, rb, gamesA, gamesB }: EloInput): EloOutput {
  const ka = 24; // K-factor
  const mov = Math.log(1 + Math.abs(gamesA - gamesB)); // Margin of victory
  const sa = gamesA > gamesB ? 1 : (gamesA === gamesB ? 0.5 : 0); // Actual score
  const ea = 1 / (1 + Math.pow(10, (rb - ra)/400)); // Expected score
  const delta = Math.round(ka * mov * (sa - ea));
  return { raNew: ra + delta, rbNew: rb - delta };
}
```

### Qualification Thresholds
- **Weekly Winner**: ≥2 matches in the week
- **Monthly Champion**: ≥4 matches in the month
- **Tie-breaking**: Higher all-time Elo rating

### Timezone Handling
- All weekly/monthly calculations use America/Denver timezone
- ISO week format (Monday-Sunday)
- Calendar month boundaries

## API Endpoints

### Server Actions
- `createMatch(data)` - Add new match with validation
- `getCurrentRatings()` - Fetch current Elo rankings
- `getWeeklyLeaderboard(weekStart, weekEnd)` - Weekly standings
- `getMonthlyLeaderboard(year, month)` - Monthly standings
- `getWeekWinnersHistory()` - Historical weekly winners
- `getMonthlyChampionsHistory()` - Historical monthly champions
- `getCupsLeaderboard()` - Cups count leaderboard

## Validation Rules

- Player names: Trimmed, case-insensitive uniqueness
- Games: Non-negative integers, no ties allowed
- Distinct players required
- PlayedAt: Cannot be more than 1 day in the future

## Deployment

The app is configured for deployment on Vercel:

1. **Connect to GitHub**: Push your code to a GitHub repository
2. **Deploy to Vercel**: Connect the repository to Vercel
3. **Database**: SQLite file will be created automatically
4. **Environment**: No additional environment variables needed

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # Redux provider
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── AddMatchForm.tsx  # Match creation form
│   ├── CurrentRatings.tsx # Elo rankings
│   ├── WeeklyLeaderboard.tsx # Weekly standings
│   ├── MonthlyLeaderboard.tsx # Monthly standings
│   └── RecentMatches.tsx # Recent match history
├── lib/                  # Utilities and server actions
│   ├── actions.ts        # Server actions
│   ├── elo.ts           # Elo rating calculations
│   ├── prisma.ts        # Database client
│   ├── timezone.ts      # Timezone utilities
│   └── utils.ts         # General utilities
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Prisma schema
│   └── seed.ts          # Database seeding
├── store/               # Redux store
│   ├── index.ts         # Store configuration
│   └── slices/          # Redux slices
└── components/ui/       # shadcn/ui components
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
