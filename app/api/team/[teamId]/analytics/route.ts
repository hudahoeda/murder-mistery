import { NextResponse } from 'next/server';
import getRedisClient from '@/lib/redis';
import { Team, CompletedPuzzle, CompletedStep } from '@/lib/types/game';
import puzzlesData from '@/lib/data/puzzles.json';

// Helper function to rehydrate team data from Redis
const rehydrateTeam = (redisData: Record<string, string>): Team => {
  return {
    id: redisData.id,
    name: redisData.name,
    members: JSON.parse(redisData.members),
    currentPuzzle: parseInt(redisData.currentPuzzle, 10),
    completedPuzzles: redisData.completedPuzzles ? JSON.parse(redisData.completedPuzzles) : [],
    discoveredClues: redisData.discoveredClues ? JSON.parse(redisData.discoveredClues) : [],
    discoveredEvidence: redisData.discoveredEvidence ? JSON.parse(redisData.discoveredEvidence) : [],
    gameStartTime: new Date(redisData.gameStartTime),
    totalScore: parseInt(redisData.totalScore, 10),
    isActive: redisData.isActive === 'true',
  };
};

export async function GET(request: Request, { params }: any) {
  const resolvedParams = await params;
  const teamId = resolvedParams.teamId as string;
  
  try {
    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    await redis.connect();

    const teamData = await redis.hGetAll(`team:${teamId}`);
    if (Object.keys(teamData).length === 0) {
      await redis.quit();
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    const team = rehydrateTeam(teamData);
    
    // Calculate detailed analytics
    const totalGameTime = Math.floor((new Date().getTime() - team.gameStartTime.getTime()) / 1000 / 60); // minutes
    const completedPuzzlesCount = team.completedPuzzles.filter(p => {
      const puzzleData = puzzlesData.puzzles.find(pd => pd.id === p.puzzleId);
      return puzzleData && p.stepsCompleted.length === puzzleData.steps.length && 
             p.stepsCompleted.every(s => s.isCorrect);
    }).length;
    
    const totalStepsCompleted = team.completedPuzzles.reduce((acc, puzzle) => {
      return acc + puzzle.stepsCompleted.filter(s => s.isCorrect).length;
    }, 0);
    
    const totalAttempts = team.completedPuzzles.reduce((acc, puzzle) => {
      return acc + puzzle.stepsCompleted.reduce((stepAcc, step) => stepAcc + step.attempts, 0);
    }, 0);
    
    const totalHintsUsed = team.completedPuzzles.reduce((acc, puzzle) => {
      return acc + puzzle.hintsUsed;
    }, 0);
    
    const averageTimePerPuzzle = completedPuzzlesCount > 0 ? 
      team.completedPuzzles.reduce((acc, p) => acc + p.timeSpent, 0) / completedPuzzlesCount : 0;
    
    const successRate = totalAttempts > 0 ? (totalStepsCompleted / totalAttempts) * 100 : 0;
    
    // Puzzle-specific analytics
    const puzzleAnalytics = team.completedPuzzles.map(completedPuzzle => {
      const puzzleData = puzzlesData.puzzles.find(p => p.id === completedPuzzle.puzzleId);
      const isComplete = puzzleData && 
        completedPuzzle.stepsCompleted.length === puzzleData.steps.length &&
        completedPuzzle.stepsCompleted.every(s => s.isCorrect);
      
      return {
        puzzleId: completedPuzzle.puzzleId,
        puzzleTitle: puzzleData?.title || 'Unknown Puzzle',
        isComplete,
        timeSpent: completedPuzzle.timeSpent,
        attempts: completedPuzzle.attempts,
        hintsUsed: completedPuzzle.hintsUsed,
        score: completedPuzzle.finalScore,
        stepsCompleted: completedPuzzle.stepsCompleted.length,
        totalSteps: puzzleData?.steps.length || 0,
        completionRate: puzzleData ? 
          (completedPuzzle.stepsCompleted.filter(s => s.isCorrect).length / puzzleData.steps.length) * 100 : 0,
        stepDetails: completedPuzzle.stepsCompleted.map(step => ({
          stepId: step.stepId,
          attempts: step.attempts,
          timeSpent: step.timeSpent,
          isCorrect: step.isCorrect,
          completedAt: step.completedAt,
        }))
      };
    });
    
    await redis.quit();

    const analytics = {
      teamInfo: {
        id: team.id,
        name: team.name,
        members: team.members,
        isActive: team.isActive,
        gameStartTime: team.gameStartTime,
      },
      overallProgress: {
        currentPuzzle: team.currentPuzzle,
        totalPuzzles: puzzlesData.puzzles.length,
        completedPuzzles: completedPuzzlesCount,
        progressPercentage: (completedPuzzlesCount / puzzlesData.puzzles.length) * 100,
        totalGameTime,
        discoveredClues: team.discoveredClues.length,
        totalClues: 12, // Based on clues.json
      },
      performance: {
        totalScore: team.totalScore,
        totalStepsCompleted,
        totalAttempts,
        totalHintsUsed,
        averageTimePerPuzzle: Math.round(averageTimePerPuzzle),
        successRate: Math.round(successRate * 100) / 100,
        efficiency: totalHintsUsed > 0 ? Math.round((totalStepsCompleted / totalHintsUsed) * 100) / 100 : totalStepsCompleted,
      },
      puzzleBreakdown: puzzleAnalytics,
      recentActivity: team.completedPuzzles
        .flatMap(p => p.stepsCompleted)
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 10)
        .map(step => ({
          stepId: step.stepId,
          completedAt: step.completedAt,
          attempts: step.attempts,
          timeSpent: step.timeSpent,
          isCorrect: step.isCorrect,
        }))
    };

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error(`Failed to get analytics for team ${teamId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 