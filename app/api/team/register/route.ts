import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createNewTeam } from '@/lib/utils/gameUtils';
import connectToRedis from '@/lib/redis';

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
      id: newTeam.id,
      name: newTeam.name,
      members: JSON.stringify(newTeam.members),
      currentPuzzle: newTeam.currentPuzzle.toString(),
      completedPuzzles: JSON.stringify(newTeam.completedPuzzles),
      discoveredClues: JSON.stringify(newTeam.discoveredClues),
      discoveredEvidence: JSON.stringify(newTeam.discoveredEvidence),
      gameStartTime: newTeam.gameStartTime.toISOString(),
      totalScore: newTeam.totalScore.toString(),
      isActive: newTeam.isActive.toString(),
      finalAccusationMade: (newTeam.finalAccusationMade || false).toString(),
      finalAccusationCorrect: (newTeam.finalAccusationCorrect || false).toString(),
      accusedSuspectId: newTeam.accusedSuspectId || '',
      gameCompletedAt: newTeam.gameCompletedAt ? newTeam.gameCompletedAt.toISOString() : '',
    };

    const redis = await connectToRedis();
    
    // Use a hash to store team details
    await redis.hSet(`team:${newTeam.id}`, teamForRedis);
    
    // Add the new team's ID to a set of all teams for easy retrieval
    await redis.sAdd('teams', newTeam.id);

    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    console.error('Team registration failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 