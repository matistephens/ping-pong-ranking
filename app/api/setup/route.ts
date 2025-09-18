import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Starting database setup...');
    
    // Test connection first
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Create hardcoded players
    const players = ['Mati', 'Rodrigo', 'Max', 'Rigved', 'Ziai', 'Jake'];
    const createdPlayers = [];
    
    for (const name of players) {
      const player = await prisma.player.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      createdPlayers.push(player);
      console.log(`Created player: ${name}`);
    }
    
    console.log('Database setup complete!');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database setup complete! Players created.',
      players: createdPlayers
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
