import { NextResponse } from 'next/server';
import { z } from 'zod';
import getRedisClient from '@/lib/redis';
import { updateTeamProgress } from '@/lib/utils/gameUtils';
import { Team } from '@/lib/types/game';

const progressUpdateSchema = z.object({
  puzzleId: z.string(),
  stepId: z.string(),
  answer: z.any(),
  isCorrect: z.boolean(),
  timeSpent: z.number().min(0),
  attempts: z.number().min(1),
});

// Helper function to rehydrate team data from Redis
const rehydrateTeam = (redisData: Record<string, string>): Team => {
    return {
      id: redisData.id,
      name: redisData.name,
      members: JSON.parse(redisData.members),
      currentPuzzle: parseInt(redisData.currentPuzzle, 10),
      completedPuzzles: JSON.parse(redisData.completedPuzzles),
      discoveredClues: JSON.parse(redisData.discoveredClues),
      gameStartTime: new Date(redisData.gameStartTime),
      totalScore: parseInt(redisData.totalScore, 10),
      isActive: redisData.isActive === 'true',
    };
  };

export async function POST(request: Request, { params }: any) {
  try {
    const teamId = params.teamId as string;
    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const validation = progressUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const redis = getRedisClient();
    await redis.connect();

    const teamData = await redis.hGetAll(`team:${teamId}`);
    if (Object.keys(teamData).length === 0) {
      await redis.quit();
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    const currentTeam = rehydrateTeam(teamData);
    
    const { puzzleId, stepId, answer, isCorrect, timeSpent, attempts } = validation.data;
    
    const updatedTeam = updateTeamProgress(currentTeam, puzzleId, stepId, answer, isCorrect, timeSpent, attempts);

    // Flatten the updated team object for Redis
    const teamForRedis = {
        ...updatedTeam,
        members: JSON.stringify(updatedTeam.members),
        completedPuzzles: JSON.stringify(updatedTeam.completedPuzzles),
        discoveredClues: JSON.stringify(updatedTeam.discoveredClues),
        gameStartTime: updatedTeam.gameStartTime.toISOString(),
        isActive: updatedTeam.isActive.toString()
    };

    await redis.hSet(`team:${updatedTeam.id}`, teamForRedis);
    await redis.quit();

    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error) {
    console.error(`Failed to update progress for team ${params.teamId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 