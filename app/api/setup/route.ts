import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Create hardcoded players
    const players = ['Mati', 'Rodrigo', 'Max', 'Rigved', 'Ziai', 'Jake'];
    
    for (const name of players) {
      await prisma.player.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database setup complete! Players created.' 
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
