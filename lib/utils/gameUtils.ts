import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Team, Puzzle, PuzzleStep, ValidationRule, CompletedPuzzle, SubmissionResult, CompletedStep } from '../types/game'
import puzzles from '@/lib/data/puzzles.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Game State Management Utilities
 */

export function generateTeamId(): string {
  return `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Calculate team progress percentage based on completed puzzles and steps
 */
export function calculateTeamProgress(team: Team, totalPuzzles: number): number {
  const completedPuzzles = team.completedPuzzles.length
  const currentPuzzleProgress = team.currentPuzzle <= totalPuzzles ? 
    (team.currentPuzzle - 1) / totalPuzzles * 100 : 100
  
  return Math.round((completedPuzzles / totalPuzzles) * 100)
}

/**
 * Calculate team score based on completion time, attempts, and hints used
 */
export function calculatePuzzleScore(
  timeSpent: number, 
  attempts: number, 
  hintsUsed: number, 
  difficulty: number
): number {
  const baseScore = 1000 * difficulty
  const timeDeduction = Math.min(timeSpent * 5, baseScore * 0.3) // Max 30% deduction for time
  const attemptDeduction = (attempts - 1) * 50 // 50 points per extra attempt
  const hintDeduction = hintsUsed * 100 // 100 points per hint
  
  return Math.max(baseScore - timeDeduction - attemptDeduction - hintDeduction, 100)
}

/**
 * Puzzle Validation Utilities
 */

export function validateAnswer(answer: any, validation: ValidationRule): boolean {
  switch (validation.type) {
    case 'exact':
      return validation.caseSensitive ? 
        answer === validation.value : 
        String(answer).toLowerCase() === String(validation.value).toLowerCase()
    
    case 'contains':
      const answerStr = String(answer)
      const expectedStr = String(validation.value)
      return validation.caseSensitive ?
        answerStr.includes(expectedStr) :
        answerStr.toLowerCase().includes(expectedStr.toLowerCase())
    
    case 'regex':
      const regex = new RegExp(validation.value, validation.caseSensitive ? 'g' : 'gi')
      return regex.test(String(answer))
    
    case 'numeric':
      const numAnswer = parseFloat(answer)
      const numExpected = parseFloat(validation.value)
      return !isNaN(numAnswer) && !isNaN(numExpected) && numAnswer === numExpected
    
    case 'custom':
      // Custom validation logic would be handled by specific puzzle components
      return false
    
    default:
      return false
  }
}

/**
 * Time Management Utilities
 */

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta'
  }).format(date)
}

export function calculateElapsedTime(startTime: Date, endTime?: Date): number {
  const end = endTime || new Date()
  return Math.floor((end.getTime() - startTime.getTime()) / (1000 * 60)) // Return minutes
}

/**
 * Local Storage Utilities for game persistence
 */

const STORAGE_KEYS = {
  TEAMS: 'murder-mystery-teams',
  GAME_SESSION: 'murder-mystery-session',
  TEAM_PROGRESS: 'murder-mystery-progress',
  ACTIVE_TEAM_ID: 'murder-mystery-active-team-id'
} as const

export function saveTeamData(team: Team): void {
  try {
    const teams = getTeamsFromStorage()
    const existingIndex = teams.findIndex(t => t.id === team.id)
    
    if (existingIndex >= 0) {
      teams[existingIndex] = team
    } else {
      teams.push(team)
    }
    
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams))
  } catch (error) {
    console.error('Failed to save team data:', error)
  }
}

export function getTeamsFromStorage(): Team[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEAMS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load teams from storage:', error)
    return []
  }
}

export function getTeamById(teamId: string): Team | null {
  const teams = getTeamsFromStorage()
  return teams.find(team => team.id === teamId) || null
}

export function setActiveTeam(teamId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TEAM_ID, teamId);
  } catch (error) {
    console.error('Failed to set active team:', error);
  }
}

export function getActiveTeam(): Team | null {
  try {
    const activeTeamId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TEAM_ID);
    if (!activeTeamId) return null;
    return getTeamById(activeTeamId);
  } catch (error) {
    console.error('Failed to get active team:', error);
    return null;
  }
}

export function clearGameData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error('Failed to clear game data:', error)
  }
}

/**
 * Clue and Evidence Management
 */

export function shouldRevealClue(
  puzzleId: string, 
  stepId: string | undefined, 
  completedPuzzles: CompletedPuzzle[]
): boolean {
  const completedPuzzle = completedPuzzles.find(cp => cp.puzzleId === puzzleId)
  
  if (!completedPuzzle) return false
  
  if (!stepId) {
    // Clue is revealed when puzzle is completed
    return true
  }
  
  // Clue is revealed when specific step is completed
  return completedPuzzle.stepsCompleted.some(step => 
    step.stepId === stepId && step.isCorrect
  )
}

/**
 * Puzzle Step Navigation
 */

export function getNextStep(puzzle: Puzzle, currentStepIndex: number): PuzzleStep | null {
  return puzzle.steps[currentStepIndex + 1] || null
}

export function getPreviousStep(puzzle: Puzzle, currentStepIndex: number): PuzzleStep | null {
  return currentStepIndex > 0 ? puzzle.steps[currentStepIndex - 1] : null
}

export function getCurrentStep(puzzle: Puzzle, stepIndex: number): PuzzleStep | null {
  return puzzle.steps[stepIndex] || null
}

/**
 * Team Management Utilities
 */

export function createNewTeam(name: string, members: string[]): Team {
  return {
    id: generateTeamId(),
    name,
    members,
    currentPuzzle: 1,
    completedPuzzles: [],
    discoveredClues: [],
    gameStartTime: new Date(),
    totalScore: 0,
    isActive: true
  }
}

export function updateTeamProgress(
  team: Team, 
  puzzleId: string, 
  stepId: string, 
  answer: any, 
  isCorrect: boolean,
  timeSpent: number,
  attempts: number
): Team {
  const updatedTeam = { ...team }
  
  // Find or create completed puzzle entry
  let completedPuzzle = updatedTeam.completedPuzzles.find(cp => cp.puzzleId === puzzleId)
  
  if (!completedPuzzle) {
    completedPuzzle = {
      puzzleId,
      teamId: team.id,
      completedAt: new Date(),
      timeSpent: 0,
      attempts: 0,
      stepsCompleted: [],
      hintsUsed: 0,
      finalScore: 0
    }
    updatedTeam.completedPuzzles.push(completedPuzzle)
  }
  
  // Update step completion
  const existingStepIndex = completedPuzzle.stepsCompleted.findIndex(s => s.stepId === stepId)
  const stepCompletion = {
    stepId,
    completedAt: new Date(),
    attempts,
    timeSpent,
    answer,
    isCorrect
  }
  
  if (existingStepIndex >= 0) {
    completedPuzzle.stepsCompleted[existingStepIndex] = stepCompletion
  } else {
    completedPuzzle.stepsCompleted.push(stepCompletion)
  }
  
  // Update puzzle totals
  completedPuzzle.timeSpent += timeSpent
  completedPuzzle.attempts += attempts

  // Check if the whole puzzle is complete
  const puzzleData = puzzles.puzzles.find(p => p.id === puzzleId);
  if (puzzleData && isCorrect && completedPuzzle.stepsCompleted.length === puzzleData.steps.length) {
    // Check if all steps are correct
    const allStepsCorrect = puzzleData.steps.every(step => 
      completedPuzzle.stepsCompleted.find(cs => cs.stepId === step.id && cs.isCorrect)
    );

    if (allStepsCorrect) {
      updatedTeam.currentPuzzle += 1;
      // Optionally calculate final score for this puzzle
      completedPuzzle.finalScore = calculatePuzzleScore(completedPuzzle.timeSpent, completedPuzzle.attempts, completedPuzzle.hintsUsed, puzzleData.difficulty);
    }
  }
  
  return updatedTeam
}

/**
 * Data Loading Utilities
 */

export async function loadGameData() {
  try {
    const [suspectsData, puzzlesData, cluesData] = await Promise.all([
      import('../data/suspects.json'),
      import('../data/puzzles.json'),
      import('../data/clues.json')
    ])
    
    return {
      suspects: suspectsData.suspects,
      puzzles: puzzlesData.puzzles,
      clues: cluesData.clues
    }
  } catch (error) {
    console.error('Failed to load game data:', error)
    throw new Error('Unable to load game data')
  }
} 