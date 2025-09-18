const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugLeaderboard() {
  console.log('=== Debugging Leaderboard ===');
  
  // Check all players
  const allPlayers = await prisma.player.findMany({
    include: {
      matchesA: true,
      matchesB: true,
      ratings: {
        orderBy: { atTime: 'desc' },
        take: 1,
      },
    },
  });

  console.log('\nAll Players:');
  allPlayers.forEach(player => {
    console.log(`- ${player.name}: ${player.matchesA.length + player.matchesB.length} matches, Rating: ${player.ratings[0]?.btRating || 'No rating'}`);
  });

  // Check all matches
  const allMatches = await prisma.match.findMany({
    include: {
      playerA: true,
      playerB: true,
    },
    orderBy: { playedAt: 'desc' },
  });

  console.log('\nAll Matches:');
  allMatches.forEach(match => {
    console.log(`- ${match.playerA.name} vs ${match.playerB.name}: ${match.gamesA}-${match.gamesB} on ${match.playedAt.toISOString()}`);
  });

  // Check players who have played matches
  const playersWithMatches = await prisma.player.findMany({
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
    },
  });

  console.log('\nPlayers with matches:');
  playersWithMatches.forEach(player => {
    console.log(`- ${player.name}: BT Rating: ${player.ratings[0]?.btRating || 'No rating'}, Dynamic Points: ${player.ratings[0]?.dynamicPoints || 0}`);
  });

  await prisma.$disconnect();
}

debugLeaderboard().catch(console.error);
