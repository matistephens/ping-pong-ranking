import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This will be called after deployment to set up the database
    const { prisma } = await import('@/lib/prisma');
    
    // Test connection
    await prisma.$connect();
    
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
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully!',
      players: createdPlayers
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
