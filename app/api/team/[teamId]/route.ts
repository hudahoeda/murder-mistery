import { NextRequest, NextResponse } from 'next/server';
import connectToRedis from '@/lib/redis';
import { Team } from '@/lib/types/game';

// Helper function to rehydrate team data from Redis
const rehydrateTeam = (teamData: Record<string, string>): Team => {
  return {
    id: teamData.id,
    name: teamData.name,
    members: JSON.parse(teamData.members || '[]'),
    currentPuzzle: parseInt(teamData.currentPuzzle || '1'),
    completedPuzzles: JSON.parse(teamData.completedPuzzles || '[]'),
    discoveredClues: JSON.parse(teamData.discoveredClues || '[]'),
    discoveredEvidence: JSON.parse(teamData.discoveredEvidence || '[]'),
    gameStartTime: new Date(teamData.gameStartTime),
    totalScore: parseInt(teamData.totalScore || '0'),
    isActive: teamData.isActive === 'true',
    finalAccusationMade: teamData.finalAccusationMade === 'true',
    finalAccusationCorrect: teamData.finalAccusationCorrect === 'true',
    accusedSuspectId: teamData.accusedSuspectId || undefined,
    gameCompletedAt: teamData.gameCompletedAt ? new Date(teamData.gameCompletedAt) : undefined,
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    
    const redis = await connectToRedis();
    
    const teamData = await redis.hGetAll(`team:${teamId}`);
    
    if (Object.keys(teamData).length === 0) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const team = rehydrateTeam(teamData);

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const updates = await request.json();

    const redis = await connectToRedis();

    // Fetch existing team data
    const existingData = await redis.hGetAll(`team:${teamId}`);
    if (Object.keys(existingData).length === 0) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const team = rehydrateTeam(existingData);

    // Update team with final accusation data
    const updatedTeam = {
      ...team,
      ...updates,
    };

    // Save updated team data
    const teamDataToSave = {
      id: updatedTeam.id,
      name: updatedTeam.name,
      members: JSON.stringify(updatedTeam.members),
      currentPuzzle: updatedTeam.currentPuzzle.toString(),
      completedPuzzles: JSON.stringify(updatedTeam.completedPuzzles),
      discoveredClues: JSON.stringify(updatedTeam.discoveredClues),
      discoveredEvidence: JSON.stringify(updatedTeam.discoveredEvidence || []),
      gameStartTime: updatedTeam.gameStartTime.toISOString(),
      totalScore: updatedTeam.totalScore.toString(),
      isActive: updatedTeam.isActive.toString(),
      finalAccusationMade: (updatedTeam.finalAccusationMade || false).toString(),
      finalAccusationCorrect: (updatedTeam.finalAccusationCorrect || false).toString(),
      accusedSuspectId: updatedTeam.accusedSuspectId || '',
      gameCompletedAt: updatedTeam.gameCompletedAt ? new Date(updatedTeam.gameCompletedAt).toISOString() : '',
    };

    await redis.hSet(`team:${teamId}`, teamDataToSave);

    // If this is a completed game, add to leaderboard
    if (updates.finalAccusationMade && updates.gameCompletedAt) {
      const completionTime = Math.floor(
        (new Date(updates.gameCompletedAt).getTime() - new Date(team.gameStartTime).getTime()) / 1000 / 60
      );

      const leaderboardEntry = {
        teamId: team.id,
        teamName: team.name,
        totalScore: team.totalScore,
        timeToComplete: completionTime,
        puzzlesCompleted: team.completedPuzzles.length,
        accusationCorrect: updates.finalAccusationCorrect || false,
        completedAt: updates.gameCompletedAt,
      };

      // Add to sorted set (sorted by score, then by time)
      const sortScore = updates.finalAccusationCorrect 
        ? team.totalScore * 1000000 - completionTime 
        : team.totalScore * 1000 - completionTime;

      await redis.zAdd('leaderboard', { score: sortScore, value: JSON.stringify(leaderboardEntry) });
    }

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 