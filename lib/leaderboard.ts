import { prisma } from './prisma';

interface PlayerStats {
  id: string;
  name: string;
  wins: number;
  losses: number;
  matches: number;
  btRating: number;
  dynamicPoints: number;
  prevRank?: number;
  currentRank?: number;
}

export async function getLeaderboardStats(startDate: Date, endDate: Date) {
  // Get all matches in the time period
  const matches = await prisma.match.findMany({
    where: {
      playedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      playerA: true,
      playerB: true,
    },
    orderBy: {
      playedAt: 'desc',
    },
  });

  // Initialize stats map
  const playerStats = new Map<string, PlayerStats>();

  // Get all players who have ever played a match (regardless of time period)
  const allPlayers = await prisma.player.findMany({
    where: {
      OR: [
        { matchesA: { some: {} } },
        { matchesB: { some: {} } },
      ],
    },
    include: {
      ratings: {
        where: { scope: 'all-time' },
        orderBy: { atTime: 'desc' },
        take: 1,
      },
      matchesA: {
        where: {
          playedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      matchesB: {
        where: {
          playedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    },
  });

  console.log(`Found ${allPlayers.length} players who have played matches`);

  // Initialize stats for all players who have ever played
  allPlayers.forEach(player => {
    // Calculate total games won and lost
    const gamesWonAsA = player.matchesA.reduce((sum, match) => sum + match.gamesA, 0);
    const gamesWonAsB = player.matchesB.reduce((sum, match) => sum + match.gamesB, 0);
    const totalGamesWon = gamesWonAsA + gamesWonAsB;

    const gamesLostAsA = player.matchesA.reduce((sum, match) => sum + match.gamesB, 0);
    const gamesLostAsB = player.matchesB.reduce((sum, match) => sum + match.gamesA, 0);
    const totalGamesLost = gamesLostAsA + gamesLostAsB;

    const totalMatches = player.matchesA.length + player.matchesB.length;

    playerStats.set(player.id, {
      id: player.id,
      name: player.name,
      wins: totalGamesWon,
      losses: totalGamesLost,
      matches: totalMatches,
      btRating: player.ratings[0]?.btRating ?? 1000,
      dynamicPoints: player.ratings[0]?.dynamicPoints ?? 0,
      prevRank: player.ratings[0]?.prevRank,
      currentRank: player.ratings[0]?.currentRank,
    });
  });

  // Convert to array and sort
  return Array.from(playerStats.values())
    .sort((a, b) => {
      // Primary sort by dynamic points
      if (b.dynamicPoints !== a.dynamicPoints) {
        return b.dynamicPoints - a.dynamicPoints;
      }
      // Secondary sort by BT rating
      if (b.btRating !== a.btRating) {
        return b.btRating - a.btRating;
      }
      // Third sort by win percentage (using games won/lost)
      const totalGamesA = a.wins + a.losses;
      const totalGamesB = b.wins + b.losses;
      const winRateA = totalGamesA > 0 ? a.wins / totalGamesA : 0;
      const winRateB = totalGamesB > 0 ? b.wins / totalGamesB : 0;
      return winRateB - winRateA;
    });
}