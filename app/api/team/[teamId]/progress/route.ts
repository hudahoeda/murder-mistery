import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectToRedis from '@/lib/redis';
import { updateTeamProgress } from '@/lib/utils/gameUtils';
import { Team, CompletedPuzzle, CompletedStep } from '@/lib/types/game';
import cluesData from '@/lib/data/clues.json';
import puzzlesData from '@/lib/data/puzzles.json';
import evidenceData from '@/lib/data/evidence.json';

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

// Helper function to check for new clues and evidence
const checkForNewItems = (
  team: Team,
  items: any[],
  discoveredItemIds: string[]
): string[] => {
  const newlyRevealed: string[] = [];
  items.forEach(item => {
    // If item is already discovered, skip it
    if (!item.revealCondition || discoveredItemIds.includes(item.id)) {
      return;
    }

    // Check if this item's puzzle is completed
    const relevantPuzzleCompletion = team.completedPuzzles.find(p => p.puzzleId === item.revealCondition.puzzleId);
    if (relevantPuzzleCompletion) {
      // If stepId is defined, check if that specific step is complete and correct
      if (item.revealCondition.stepId) {
        const stepIsComplete = relevantPuzzleCompletion.stepsCompleted.some(s => s.stepId === item.revealCondition.stepId && s.isCorrect);
        if (stepIsComplete) {
          newlyRevealed.push(item.id);
        }
      } else {
        // If no stepId, item is revealed by completing the puzzle
        const puzzleData = puzzlesData.puzzles.find(p => p.id === item.revealCondition.puzzleId);
        if (puzzleData && relevantPuzzleCompletion.stepsCompleted.length === puzzleData.steps.length) {
           const allStepsCorrect = puzzleData.steps.every(step => 
              relevantPuzzleCompletion.stepsCompleted.find(cs => cs.stepId === step.id && cs.isCorrect)
           );
           if(allStepsCorrect) newlyRevealed.push(item.id);
        }
      }
    }
  });
  
  return newlyRevealed;
};

const dehydrateTeamForRedis = (team: Team) => {
  return {
    id: team.id,
    name: team.name,
    members: JSON.stringify(team.members),
    currentPuzzle: team.currentPuzzle.toString(),
    completedPuzzles: JSON.stringify(team.completedPuzzles),
    discoveredClues: JSON.stringify(team.discoveredClues),
    discoveredEvidence: JSON.stringify(team.discoveredEvidence || []),
    gameStartTime: team.gameStartTime.toISOString(),
    totalScore: team.totalScore.toString(),
    isActive: team.isActive.toString(),
    finalAccusationMade: (team.finalAccusationMade || false).toString(),
    finalAccusationCorrect: (team.finalAccusationCorrect || false).toString(),
    accusedSuspectId: team.accusedSuspectId || '',
    gameCompletedAt: team.gameCompletedAt ? new Date(team.gameCompletedAt).toISOString() : '',
  };
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

    const redis = await connectToRedis();

    const teamData = await redis.hGetAll(`team:${teamId}`);
    if (Object.keys(teamData).length === 0) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    const currentTeam = rehydrateTeam(teamData);
    
    const { puzzleId, stepId, answer, isCorrect, timeSpent, attempts, hintsUsed } = validation.data;
    
    if (hintsUsed > 0 && attempts === 0 && !answer) {
      // This is a hint-only update
      const teamWithHintUpdate = { ...currentTeam };

      // Find or create a completed puzzle entry to track the hint
      let completedPuzzle = teamWithHintUpdate.completedPuzzles.find(cp => cp.puzzleId === puzzleId);
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
        teamWithHintUpdate.completedPuzzles.push(completedPuzzle);
      }
      
      // Increment hints used and deduct points
      completedPuzzle.hintsUsed += hintsUsed;
      teamWithHintUpdate.totalScore = Math.max(0, teamWithHintUpdate.totalScore - (50 * hintsUsed));
      
      const teamForRedis = dehydrateTeamForRedis(teamWithHintUpdate);
      await redis.hSet(`team:${currentTeam.id}`, teamForRedis);

      return NextResponse.json(teamWithHintUpdate, { status: 200 });
    }
    
    // This is a regular progress update
    const updatedTeam = updateTeamProgress(currentTeam, puzzleId, stepId, answer, isCorrect, timeSpent, attempts);
    
    // The front-end sends hintsUsed on the next step submission, so we don't need to double-count here
    // as it's factored into the puzzle's final score calculation.

    // Check for new clues and add them to discovered clues
    const newClues = checkForNewItems(updatedTeam, cluesData.clues, updatedTeam.discoveredClues);
    if (newClues.length > 0) {
      updatedTeam.discoveredClues = [...new Set([...updatedTeam.discoveredClues, ...newClues])];
    }

    // Check for new evidence and add it to discovered evidence
    const newEvidence = checkForNewItems(updatedTeam, evidenceData.evidence, updatedTeam.discoveredEvidence || []);
    if (newEvidence.length > 0) {
      updatedTeam.discoveredEvidence = [...new Set([...(updatedTeam.discoveredEvidence || []), ...newEvidence])];
    }

    const teamForRedis = dehydrateTeamForRedis(updatedTeam);

    await redis.hSet(`team:${updatedTeam.id}`, teamForRedis);
    
    // Store performance analytics in Redis
    const analyticsKey = `analytics:team:${teamId}`;
    const analyticsData = {
      teamId,
      lastUpdated: new Date().toISOString(),
      totalTimeSpent: updatedTeam.completedPuzzles.reduce((acc, p) => acc + p.timeSpent, 0).toString(),
      totalAttempts: updatedTeam.completedPuzzles.reduce((acc, p) => acc + p.attempts, 0).toString(),
      totalHintsUsed: updatedTeam.completedPuzzles.reduce((acc, p) => acc + p.hintsUsed, 0).toString(),
      completedSteps: updatedTeam.completedPuzzles.reduce((acc, p) => acc + p.stepsCompleted.filter(s => s.isCorrect).length, 0).toString(),
      discoveredCluesCount: updatedTeam.discoveredClues.length.toString(),
    };
    
    await redis.hSet(analyticsKey, analyticsData);

    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error) {
    console.error(`Failed to update progress for team ${teamId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 