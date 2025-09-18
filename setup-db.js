const { PrismaClient } = require('@prisma/client');

async function setupDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Setting up database...');
    
    // This will create all tables
    await prisma.$executeRaw`SELECT 1`;
    console.log('Database connection successful!');
    
    // Create the hardcoded players
    const players = ['Mati', 'Rodrigo', 'Max', 'Rigved', 'Ziai', 'Jake'];
    
    for (const name of players) {
      await prisma.player.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      console.log(`Created player: ${name}`);
    }
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
