import { NextResponse } from 'next/server';
import getRedisClient from '@/lib/redis';
import { Team } from '@/lib/types/game';

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

export async function GET(request: Request, { params }: any) {
  try {
    const teamId = params.teamId as string;
    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    await redis.connect();

    const teamData = await redis.hGetAll(`team:${teamId}`);
    
    await redis.quit();

    if (Object.keys(teamData).length === 0) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    const team = rehydrateTeam(teamData);

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.error(`Failed to fetch team ${params.teamId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 