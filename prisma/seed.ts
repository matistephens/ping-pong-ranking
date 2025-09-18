import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample players
  const alice = await prisma.player.upsert({
    where: { name: 'Alice' },
    update: {},
    create: { name: 'Alice' },
  });

  const bob = await prisma.player.upsert({
    where: { name: 'Bob' },
    update: {},
    create: { name: 'Bob' },
  });

  const charlie = await prisma.player.upsert({
    where: { name: 'Charlie' },
    update: {},
    create: { name: 'Charlie' },
  });

  // Create initial ratings
  await prisma.rating.createMany({
    data: [
      { playerId: alice.id, value: 1000, atTime: new Date() },
      { playerId: bob.id, value: 1000, atTime: new Date() },
      { playerId: charlie.id, value: 1000, atTime: new Date() },
    ],
  });

  // Create sample matches
  const match1 = await prisma.match.create({
    data: {
      playerAId: alice.id,
      playerBId: bob.id,
      gamesA: 3,
      gamesB: 1,
      playedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  const match2 = await prisma.match.create({
    data: {
      playerAId: bob.id,
      playerBId: charlie.id,
      gamesA: 2,
      gamesB: 3,
      playedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  });

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
