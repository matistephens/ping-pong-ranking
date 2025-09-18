import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Add hardcoded players
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
      message: 'Players added successfully!' 
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
