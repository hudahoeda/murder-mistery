import { NextResponse } from 'next/server';
import { z } from 'zod';
import getRedisClient from '@/lib/redis';
import { updateTeamProgress } from '@/lib/utils/gameUtils';
import { Team } from '@/lib/types/game';
import cluesData from '@/lib/data/clues.json';
import puzzlesData from '@/lib/data/puzzles.json';

const progressUpdateSchema = z.object({
  puzzleId: z.string(),
  stepId: z.string(),
  answer: z.any().optional(),
  isCorrect: z.boolean(),
  timeSpent: z.number().min(0),
  attempts: z.number().min(0),
  hintsUsed: z.number().min(0).optional().default(0),
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

// Helper function to check for new clues
const checkForNewClues = (team: Team): string[] => {
  const newlyRevealed: string[] = [];
  (cluesData.clues as any[]).forEach(clue => {
    // If clue is already discovered, skip it
    if (team.discoveredClues.includes(clue.id)) {
      return;
    }

    // Check if this clue's puzzle is completed
    const relevantPuzzleCompletion = team.completedPuzzles.find(p => p.puzzleId === clue.revealCondition.puzzleId);
    if (relevantPuzzleCompletion) {
      // If stepId is defined, check if that specific step is complete and correct
      if (clue.revealCondition.stepId) {
        const stepIsComplete = relevantPuzzleCompletion.stepsCompleted.some(s => s.stepId === clue.revealCondition.stepId && s.isCorrect);
        if (stepIsComplete) {
          newlyRevealed.push(clue.id);
        }
      } else {
        // If no stepId, clue is revealed by completing the puzzle
        const puzzleData = puzzlesData.puzzles.find(p => p.id === clue.revealCondition.puzzleId);
        if (puzzleData && relevantPuzzleCompletion.stepsCompleted.length === puzzleData.steps.length) {
           const allStepsCorrect = puzzleData.steps.every(step => 
              relevantPuzzleCompletion.stepsCompleted.find(cs => cs.stepId === step.id && cs.isCorrect)
           );
           if(allStepsCorrect) newlyRevealed.push(clue.id);
        }
      }
    }
  });
  
  return newlyRevealed;
};

export async function POST(request: Request, { params }: any) {
  const resolvedParams = await params;
  const teamId = resolvedParams.teamId as string;
  
  try {
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
    
    const { puzzleId, stepId, answer, isCorrect, timeSpent, attempts, hintsUsed } = validation.data;
    
    // Handle hint-only updates (when only tracking hint usage)
    if (hintsUsed > 0 && attempts === 0 && !answer) {
      // Find or create completed puzzle entry for hint tracking
      let completedPuzzle = currentTeam.completedPuzzles.find(cp => cp.puzzleId === puzzleId);
      
      if (!completedPuzzle) {
        completedPuzzle = {
          puzzleId,
          teamId: currentTeam.id,
          completedAt: new Date(),
          timeSpent: 0,
          attempts: 0,
          stepsCompleted: [],
          hintsUsed: 0,
          finalScore: 0
        };
        currentTeam.completedPuzzles.push(completedPuzzle);
      }
      
      completedPuzzle.hintsUsed += hintsUsed;
      
      // Flatten the updated team object for Redis
      const teamForRedis = {
          ...currentTeam,
          members: JSON.stringify(currentTeam.members),
          completedPuzzles: JSON.stringify(currentTeam.completedPuzzles),
          discoveredClues: JSON.stringify(currentTeam.discoveredClues),
          gameStartTime: currentTeam.gameStartTime.toISOString(),
          isActive: currentTeam.isActive.toString()
      };

      await redis.hSet(`team:${currentTeam.id}`, teamForRedis);
      await redis.quit();

      return NextResponse.json(currentTeam, { status: 200 });
    }
    
    const updatedTeam = updateTeamProgress(currentTeam, puzzleId, stepId, answer, isCorrect, timeSpent, attempts);
    
    // Add hint usage to the completed puzzle
    if (hintsUsed > 0) {
      const completedPuzzle = updatedTeam.completedPuzzles.find(cp => cp.puzzleId === puzzleId);
      if (completedPuzzle) {
        completedPuzzle.hintsUsed += hintsUsed;
      }
    }

    // Check for new clues and add them to discovered clues
    const newClues = checkForNewClues(updatedTeam);
    if (newClues.length > 0) {
      updatedTeam.discoveredClues = [...updatedTeam.discoveredClues, ...newClues];
    }

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
    
    // Store performance analytics in Redis
    const analyticsKey = `analytics:team:${teamId}`;
    const analyticsData = {
      teamId,
      lastUpdated: new Date().toISOString(),
      totalTimeSpent: updatedTeam.completedPuzzles.reduce((acc, p) => acc + p.timeSpent, 0),
      totalAttempts: updatedTeam.completedPuzzles.reduce((acc, p) => acc + p.attempts, 0),
      totalHintsUsed: updatedTeam.completedPuzzles.reduce((acc, p) => acc + p.hintsUsed, 0),
      completedSteps: updatedTeam.completedPuzzles.reduce((acc, p) => acc + p.stepsCompleted.filter(s => s.isCorrect).length, 0),
      discoveredCluesCount: updatedTeam.discoveredClues.length,
    };
    
    await redis.hSet(analyticsKey, analyticsData);
    await redis.quit();

    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error) {
    console.error(`Failed to update progress for team ${teamId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 