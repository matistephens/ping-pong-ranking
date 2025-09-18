'use server';

import { prisma } from './prisma';
import { updateElo } from './elo';
import { getMonthStart, getMonthEnd } from './timezone';
import { zonedTimeToUtc } from 'date-fns-tz';

export async function createMatch(data: {
  playerAName: string;
  playerBName: string;
  gamesA: number;
  gamesB: number;
  playedAt: Date;
}) {
  try {
    // Validation
    if (data.gamesA === data.gamesB) {
      throw new Error('Games cannot be equal (no ties allowed)');
    }
    if (data.gamesA < 0 || data.gamesB < 0) {
      throw new Error('Games must be non-negative');
    }
    if (data.playerAName.trim().toLowerCase() === data.playerBName.trim().toLowerCase()) {
      throw new Error('Players must be different');
    }

    // Ensure both players exist
    const playerA = await prisma.player.upsert({
      where: { name: data.playerAName.trim() },
      update: {},
      create: { name: data.playerAName.trim() },
    });

    const playerB = await prisma.player.upsert({
      where: { name: data.playerBName.trim() },
      update: {},
      create: { name: data.playerBName.trim() },
    });

    // Get current ratings
    const ratingA = await prisma.rating.findFirst({
      where: { playerId: playerA.id },
      orderBy: { atTime: 'desc' },
    });

    const ratingB = await prisma.rating.findFirst({
      where: { playerId: playerB.id },
      orderBy: { atTime: 'desc' },
    });

    const currentRatingA = ratingA?.value ?? 1000;
    const currentRatingB = ratingB?.value ?? 1000;

    // Calculate new ratings
    const { raNew, rbNew } = updateElo({
      ra: currentRatingA,
      rb: currentRatingB,
      gamesA: data.gamesA,
      gamesB: data.gamesB,
    });

    // Create match and ratings in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the match
      const match = await tx.match.create({
        data: {
          playerAId: playerA.id,
          playerBId: playerB.id,
          gamesA: data.gamesA,
          gamesB: data.gamesB,
          playedAt: data.playedAt,
        },
        include: {
          playerA: true,
          playerB: true,
        },
      });

      // Create rating snapshots
      await tx.rating.createMany({
        data: [
          {
            playerId: playerA.id,
            value: raNew,
            atTime: data.playedAt,
          },
          {
            playerId: playerB.id,
            value: rbNew,
            atTime: data.playedAt,
          },
        ],
      });

      // Check if championship exists for this month
      const monthStart = getMonthStart(data.playedAt);
      const monthEnd = getMonthEnd(data.playedAt);
      const year = monthStart.getFullYear();
      const month = monthStart.getMonth() + 1;

      const existingChampionship = await tx.championship.findUnique({
        where: {
          year_month: {
            year,
            month,
          },
        },
      });

      if (!existingChampionship) {
        await tx.championship.create({
          data: {
            year,
            month,
          },
        });
      }

      return match;
    });

    return { success: true, match: result };
  } catch (error) {
    console.error('Error creating match:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getCurrentRatings() {
  try {
    const players = await prisma.player.findMany({
      include: {
        matchesA: true,
        matchesB: true,
        ratings: {
          orderBy: { atTime: 'desc' },
          take: 1,
        },
      },
    });

    return players.map(player => {
      const allMatches = [...player.matchesA, ...player.matchesB];
      const wins = allMatches.filter(match => {
        const isPlayerA = match.playerAId === player.id;
        return (isPlayerA && match.gamesA > match.gamesB) || (!isPlayerA && match.gamesB > match.gamesA);
      }).length;

      return {
        id: player.id,
        name: player.name,
        currentRating: player.ratings[0]?.value ?? 1000,
        matchesPlayed: allMatches.length,
        wins,
        losses: allMatches.length - wins,
      };
    }).sort((a, b) => b.currentRating - a.currentRating);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return [];
  }
}

export async function getRecentMatches(limit: number = 10) {
  try {
    return await prisma.match.findMany({
      take: limit,
      orderBy: { playedAt: 'desc' },
      include: {
        playerA: true,
        playerB: true,
      },
    });
  } catch (error) {
    console.error('Error fetching recent matches:', error);
    return [];
  }
}

export async function getWeeklyLeaderboard(weekStart: Date, weekEnd: Date) {
  try {
    const matches = await prisma.match.findMany({
      where: {
        playedAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        playerA: true,
        playerB: true,
      },
    });

    const playerStats = new Map<string, { name: string; wins: number; losses: number; matches: number }>();

    matches.forEach(match => {
      const playerAId = match.playerAId;
      const playerBId = match.playerBId;
      const playerAName = match.playerA.name;
      const playerBName = match.playerB.name;

      if (!playerStats.has(playerAId)) {
        playerStats.set(playerAId, { name: playerAName, wins: 0, losses: 0, matches: 0 });
      }
      if (!playerStats.has(playerBId)) {
        playerStats.set(playerBId, { name: playerBName, wins: 0, losses: 0, matches: 0 });
      }

      const statsA = playerStats.get(playerAId)!;
      const statsB = playerStats.get(playerBId)!;

      statsA.matches++;
      statsB.matches++;

      if (match.gamesA > match.gamesB) {
        statsA.wins++;
        statsB.losses++;
      } else {
        statsA.losses++;
        statsB.wins++;
      }
    });

    return Array.from(playerStats.values())
      .filter(player => player.matches >= 2) // Minimum 2 matches for weekly winner
      .sort((a, b) => {
        const winRateA = a.matches > 0 ? a.wins / a.matches : 0;
        const winRateB = b.matches > 0 ? b.wins / b.matches : 0;
        return winRateB - winRateA;
      });
  } catch (error) {
    console.error('Error fetching weekly leaderboard:', error);
    return [];
  }
}

export async function getMonthlyLeaderboard(year: number, month: number) {
  try {
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59);

    const matches = await prisma.match.findMany({
      where: {
        playedAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        playerA: true,
        playerB: true,
      },
    });

    const playerStats = new Map<string, { name: string; wins: number; losses: number; matches: number }>();

    matches.forEach(match => {
      const playerAId = match.playerAId;
      const playerBId = match.playerBId;
      const playerAName = match.playerA.name;
      const playerBName = match.playerB.name;

      if (!playerStats.has(playerAId)) {
        playerStats.set(playerAId, { name: playerAName, wins: 0, losses: 0, matches: 0 });
      }
      if (!playerStats.has(playerBId)) {
        playerStats.set(playerBId, { name: playerBName, wins: 0, losses: 0, matches: 0 });
      }

      const statsA = playerStats.get(playerAId)!;
      const statsB = playerStats.get(playerBId)!;

      statsA.matches++;
      statsB.matches++;

      if (match.gamesA > match.gamesB) {
        statsA.wins++;
        statsB.losses++;
      } else {
        statsA.losses++;
        statsB.wins++;
      }
    });

    return Array.from(playerStats.values())
      .filter(player => player.matches >= 4) // Minimum 4 matches for monthly champion
      .sort((a, b) => {
        const winRateA = a.matches > 0 ? a.wins / a.matches : 0;
        const winRateB = b.matches > 0 ? b.wins / b.matches : 0;
        return winRateB - winRateA;
      });
  } catch (error) {
    console.error('Error fetching monthly leaderboard:', error);
    return [];
  }
}

export async function getWeekWinnersHistory() {
  try {
    const matches = await prisma.match.findMany({
      orderBy: { playedAt: 'asc' },
      include: {
        playerA: true,
        playerB: true,
      },
    });

    // Group matches by week and find winners
    const weekGroups = new Map<string, typeof matches>();
    
    matches.forEach(match => {
      const weekStart = getMonthStart(match.playedAt); // Using month start as proxy for week grouping
      const weekKey = `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`;
      
      if (!weekGroups.has(weekKey)) {
        weekGroups.set(weekKey, []);
      }
      weekGroups.get(weekKey)!.push(match);
    });

    const winners = [];
    for (const [week, weekMatches] of weekGroups) {
      const leaderboard = await getWeeklyLeaderboard(
        weekMatches[0].playedAt,
        weekMatches[weekMatches.length - 1].playedAt
      );
      
      if (leaderboard.length > 0) {
        winners.push({
          week,
          winner: leaderboard[0].name,
          record: `${leaderboard[0].wins}-${leaderboard[0].losses}`,
          totalPlayers: leaderboard.length,
        });
      }
    }

    return winners;
  } catch (error) {
    console.error('Error fetching week winners history:', error);
    return [];
  }
}

export async function getMonthlyChampionsHistory() {
  try {
    const championships = await prisma.championship.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    const champions = [];
    for (const championship of championships) {
      const leaderboard = await getMonthlyLeaderboard(championship.year, championship.month);
      
      if (leaderboard.length > 0) {
        champions.push({
          month: `${championship.year}-${championship.month.toString().padStart(2, '0')}`,
          champion: leaderboard[0].name,
          record: `${leaderboard[0].wins}-${leaderboard[0].losses}`,
        });
      }
    }

    return champions;
  } catch (error) {
    console.error('Error fetching monthly champions history:', error);
    return [];
  }
}

export async function getCupsLeaderboard() {
  try {
    const champions = await getMonthlyChampionsHistory();
    const cupsCount = new Map<string, number>();

    champions.forEach(champion => {
      const current = cupsCount.get(champion.champion) || 0;
      cupsCount.set(champion.champion, current + 1);
    });

    return Array.from(cupsCount.entries())
      .map(([name, cups]) => ({ name, cups }))
      .sort((a, b) => b.cups - a.cups);
  } catch (error) {
    console.error('Error fetching cups leaderboard:', error);
    return [];
  }
}
