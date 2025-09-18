import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up any old sample players and their related data
  const oldPlayerNames = ['Alice', 'Bob', 'Charlie'];
  
  // First, delete matches and ratings for old players
  for (const name of oldPlayerNames) {
    const oldPlayer = await prisma.player.findUnique({
      where: { name },
    });
    
    if (oldPlayer) {
      // Delete related data first
      await prisma.rating.deleteMany({
        where: { playerId: oldPlayer.id },
      });
      
      await prisma.match.deleteMany({
        where: {
          OR: [
            { playerAId: oldPlayer.id },
            { playerBId: oldPlayer.id },
          ],
        },
      });
      
      // Then delete the player
      await prisma.player.delete({
        where: { id: oldPlayer.id },
      });
    }
  }

  // Create hardcoded players
  const playerNames = ['Mati', 'Rodrigo', 'Max', 'Rigved', 'Ziai', 'Jake'];
  
  const players = [];
  for (const name of playerNames) {
    const player = await prisma.player.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    players.push(player);
  }

  // Create initial ratings for all players
  await prisma.rating.createMany({
    data: players.map(player => ({
      playerId: player.id,
      value: 1000,
      atTime: new Date(),
    })),
  });

  // Create some sample matches between the players
  if (players.length >= 2) {
    const match1 = await prisma.match.create({
      data: {
        playerAId: players[0].id,
        playerBId: players[1].id,
        gamesA: 3,
        gamesB: 1,
        playedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    });

    if (players.length >= 3) {
      const match2 = await prisma.match.create({
        data: {
          playerAId: players[1].id,
          playerBId: players[2].id,
          gamesA: 2,
          gamesB: 3,
          playedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
      });
    }
  }

  // Create championship for current month
  const now = new Date();
  await prisma.championship.upsert({
    where: {
      year_month: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      },
    },
    update: {},
    create: {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
