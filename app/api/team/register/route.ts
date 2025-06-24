import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createNewTeam } from '@/lib/utils/gameUtils';
import getRedisClient from '@/lib/redis';

const teamRegistrationSchema = z.object({
  teamName: z.string().min(3).max(50),
  members: z.array(z.string().min(2)).min(1).max(4),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = teamRegistrationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const { teamName, members } = validation.data;
    const newTeam = createNewTeam(teamName, members);

    const teamForRedis = {
      ...newTeam,
      members: JSON.stringify(newTeam.members),
      completedPuzzles: JSON.stringify(newTeam.completedPuzzles),
      discoveredClues: JSON.stringify(newTeam.discoveredClues),
      gameStartTime: newTeam.gameStartTime.toISOString(),
      isActive: newTeam.isActive.toString()
    };

    const redis = getRedisClient();
    await redis.connect();
    
    // Use a hash to store team details
    await redis.hSet(`team:${newTeam.id}`, teamForRedis);
    
    // Add the new team's ID to a set of all teams for easy retrieval
    await redis.sAdd('teams', newTeam.id);

    await redis.quit();

    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    console.error('Team registration failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 