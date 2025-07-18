import { NextResponse } from 'next/server';
import connectToRedis from '@/lib/redis';
import { Team, CompletedPuzzle } from '@/lib/types/game';
import puzzlesData from '@/lib/data/puzzles.json';

// Helper function to rehydrate team data from Redis
const rehydrateTeam = (redisData: Record<string, string>): Team => {
  return {
    id: redisData.id,
    name: redisData.name,
    members: JSON.parse(redisData.members || '[]'),
    currentPuzzle: parseInt(redisData.currentPuzzle || '1'),
    completedPuzzles: JSON.parse(redisData.completedPuzzles || '[]'),
    discoveredClues: JSON.parse(redisData.discoveredClues || '[]'),
    discoveredEvidence: JSON.parse(redisData.discoveredEvidence || '[]'),
    gameStartTime: new Date(redisData.gameStartTime),
    totalScore: parseInt(redisData.totalScore || '0'),
    isActive: redisData.isActive === 'true',
    finalAccusationMade: redisData.finalAccusationMade === 'true',
    finalAccusationCorrect: redisData.finalAccusationCorrect === 'true',
    accusedSuspectId: redisData.accusedSuspectId || undefined,
    gameCompletedAt: redisData.gameCompletedAt ? new Date(redisData.gameCompletedAt) : undefined,
  };
};

export async function GET() {
  try {
    const redis = await connectToRedis();

    // Get all team keys
    const teamKeys = await redis.keys('team:*');
    
    if (teamKeys.length === 0) {
      return NextResponse.json({ teams: [], summary: { totalTeams: 0, activeTeams: 0, averageProgress: 0, totalScore: 0, averageGameTime: 0 } });
    }

    // Get all team data
    const teamsData = await Promise.all(
      teamKeys.map(async (key: string) => {
        const teamData = await redis.hGetAll(key);
        return Object.keys(teamData).length > 0 ? rehydrateTeam(teamData) : null;
      })
    );

    const validTeams = teamsData.filter((team): team is Team => team !== null);
    
    // Calculate summary statistics
    const activeTeams = validTeams.filter((team: Team) => team.isActive).length;
    const totalProgress = validTeams.reduce((acc: number, team: Team) => {
      const completedPuzzles = team.completedPuzzles.filter((p: CompletedPuzzle) => {
        const puzzleData = puzzlesData.puzzles.find(pd => pd.id === p.puzzleId);
        return puzzleData && p.stepsCompleted.length === puzzleData.steps.length && 
               p.stepsCompleted.every(s => s.isCorrect);
      }).length;
      return acc + (completedPuzzles / puzzlesData.puzzles.length) * 100;
    }, 0);
    
    const averageProgress = validTeams.length > 0 ? totalProgress / validTeams.length : 0;

    // Create team summaries for admin view
    const teamSummaries = validTeams.map(team => {
      const completedPuzzlesCount = team.completedPuzzles.filter(p => {
        const puzzleData = puzzlesData.puzzles.find(pd => pd.id === p.puzzleId);
        return puzzleData && p.stepsCompleted.length === puzzleData.steps.length && 
               p.stepsCompleted.every(s => s.isCorrect);
      }).length;
      
      const currentPuzzleData = puzzlesData.puzzles[team.currentPuzzle - 1];
      const currentPuzzleProgress = team.completedPuzzles.find(p => p.puzzleId === currentPuzzleData?.id);
      const currentStepsCompleted = currentPuzzleProgress ? 
        currentPuzzleProgress.stepsCompleted.filter(s => s.isCorrect).length : 0;
      
      const totalGameTime = Math.floor((new Date().getTime() - team.gameStartTime.getTime()) / 1000 / 60);
      
      return {
        id: team.id,
        name: team.name,
        members: team.members,
        isActive: team.isActive,
        gameStartTime: team.gameStartTime,
        currentPuzzle: team.currentPuzzle,
        currentPuzzleTitle: currentPuzzleData?.title || 'Unknown',
        currentStepsCompleted,
        currentTotalSteps: currentPuzzleData?.steps.length || 0,
        completedPuzzles: completedPuzzlesCount,
        totalPuzzles: puzzlesData.puzzles.length,
        progressPercentage: (completedPuzzlesCount / puzzlesData.puzzles.length) * 100,
        discoveredClues: team.discoveredClues.length,
        totalScore: team.totalScore,
        totalGameTime,
        pointsPerMinute: totalGameTime > 0 ? parseFloat((team.totalScore / totalGameTime).toFixed(1)) : 0,
        lastActivity: team.completedPuzzles.length > 0 ? 
          Math.max(...team.completedPuzzles.flatMap(p => 
            p.stepsCompleted.map(s => new Date(s.completedAt).getTime())
          )) : team.gameStartTime.getTime(),
      };
    });

    // Sort teams by last activity (most recent first)
    teamSummaries.sort((a, b) => b.lastActivity - a.lastActivity);

    const response = {
      teams: teamSummaries,
      summary: {
        totalTeams: validTeams.length,
        activeTeams,
        averageProgress: Math.round(averageProgress * 100) / 100,
        totalScore: validTeams.reduce((acc, team) => acc + team.totalScore, 0),
        averageGameTime: validTeams.length > 0 ? 
          Math.round(validTeams.reduce((acc, team) => {
            const gameTime = Math.floor((new Date().getTime() - team.gameStartTime.getTime()) / 1000 / 60);
            return acc + gameTime;
          }, 0) / validTeams.length) : 0,
      }
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Failed to get teams data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 