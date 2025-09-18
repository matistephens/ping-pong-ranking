import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    // Test basic connection
    await prisma.$connect();
    
    // Try to query players
    const players = await prisma.player.findMany();
    
    // Try to query matches
    const matches = await prisma.match.findMany();
    
    // Try to query ratings
    const ratings = await prisma.rating.findMany();
    
    return NextResponse.json({ 
      success: true,
      message: 'Database connection successful',
      data: {
        players: players.length,
        matches: matches.length,
        ratings: ratings.length,
        playerNames: players.map(p => p.name)
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
