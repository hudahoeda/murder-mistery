// Core game types for Murder Mystery Game
// Based on enhanced puzzle design and creative phase decisions

export interface Team {
  id: string;
  name: string;
  members: string[];
  currentPuzzle: number;
  completedPuzzles: CompletedPuzzle[];
  discoveredClues: string[];
  discoveredEvidence: string[];
  gameStartTime: Date;
  totalScore: number;
  isActive: boolean;
  finalAccusationMade?: boolean;
  finalAccusationCorrect?: boolean;
  accusedSuspectId?: string;
  gameCompletedAt?: Date;
}

export interface PuzzleStep {
  id: string;
  title: string;
  description: string;
  type: 'multiple-choice' | 'text-input' | 'drag-drop' | 'cipher' | 'image-analysis' | 'timeline' | 'calculation';
  content: any; // Flexible content based on step type
  validation: ValidationRule;
  hintText?: string;
  timeEstimate: number; // minutes
}

export interface Puzzle {
  id: string;
  title: string;
  description: string;
  category: 'investigation' | 'cipher' | 'riddle' | 'analysis' | 'calculation';
  steps: PuzzleStep[];
  totalTimeEstimate: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  cluesRevealed: string[];
  prerequisiteClues?: string[];
}

export interface CompletedPuzzle {
  puzzleId: string;
  teamId: string;
  completedAt: Date;
  timeSpent: number; // minutes
  attempts: number;
  stepsCompleted: CompletedStep[];
  hintsUsed: number;
  finalScore: number;
}

export interface CompletedStep {
  stepId: string;
  completedAt: Date;
  attempts: number;
  timeSpent: number;
  answer: any;
  isCorrect: boolean;
}

export interface ValidationRule {
  type: 'exact' | 'contains' | 'regex' | 'numeric' | 'custom';
  value: any;
  caseSensitive?: boolean;
  allowPartial?: boolean;
}

export interface Clue {
  id: string;
  title: string;
  content: string;
  category: string;
  importance: string;
  revealCondition: {
    puzzleId: string;
    stepId: string;
  };
  relatedSuspects?: string[];
  relatedEvidence?: string[];
}

export interface Suspect {
  id: string;
  name: string;
  age: number;
  occupation: string;
  backstory: string;
  alibi: string;
  motive?: string;
  appearance: string;
  personality: string;
  relationshipToVictim: string;
  suspicionLevel: number; // 1-10
  imageUrl?: string;
  isGuilty: boolean;
}

export interface Evidence {
  id: string;
  name: string;
  description: string;
  location: string;
  discoveredBy?: string;
  category: 'physical' | 'digital' | 'witness' | 'document';
  importance: 'critical' | 'important' | 'supporting';
  relatedSuspects: string[];
  imageUrl?: string;
  analysisResults?: string;
}

export interface GameSession {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  status: 'preparing' | 'active' | 'paused' | 'completed';
  teams: Team[];
  currentRound: number;
  totalRounds: number;
  hostName: string;
  settings: GameSettings;
}

export interface GameSettings {
  maxTeams: number;
  maxMembersPerTeam: number;
  roundDuration: number; // minutes
  hintsEnabled: boolean;
  allowTeamCommunication: boolean;
  shufflePuzzles: boolean;
  difficultyAdjustment: boolean;
  autoProgressToNextRound: boolean;
}

export interface GameProgress {
  sessionId: string;
  teams: TeamProgress[];
  currentPhase: 'briefing' | 'puzzle-solving' | 'discussion' | 'final-accusation' | 'reveal';
  phaseStartTime: Date;
  phaseEndTime?: Date;
  overallProgress: number; // 0-100
}

export interface TeamProgress {
  teamId: string;
  currentPuzzle: number;
  currentStep: number;
  puzzlesCompleted: number;
  totalTimeSpent: number;
  cluesDiscovered: number;
  hintsUsed: number;
  progressPercentage: number;
}

// Component-specific types for our custom interactive elements

export interface CipherWheelState {
  innerRing: string[];
  outerRing: string[];
  rotation: number;
  selectedLetter?: string;
  decodedText: string;
}

export interface DragDropItem {
  id: string;
  content: string | React.ReactNode;
  position: { x: number; y: number };
  isPlaced: boolean;
  targetZone?: string;
}

export interface ImageAnalysisState {
  originalImage: string;
  processedImage: string;
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
  };
  annotations: ImageAnnotation[];
}

export interface ImageAnnotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence?: number;
}

export interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  location: string;
  suspect?: string;
  isConfirmed: boolean;
  category: 'movement' | 'interaction' | 'event' | 'sighting';
}

export interface StationMapState {
  selectedPlatform?: string;
  discoveredLocations: string[];
  interactiveElements: MapElement[];
  userInteractions: MapInteraction[];
}

export interface MapElement {
  id: string;
  type: 'platform' | 'entrance' | 'shop' | 'office' | 'storage';
  position: { x: number; y: number };
  label: string;
  isClickable: boolean;
  hasEvidence: boolean;
}

export interface MapInteraction {
  elementId: string;
  timestamp: Date;
  action: 'click' | 'hover' | 'examine';
  result?: string;
}

// API Response types for external integrations (if needed in future)

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PuzzleSubmission {
  teamId: string;
  puzzleId: string;
  stepId: string;
  answer: any;
  timestamp: Date;
  timeSpent: number;
}

export interface SubmissionResult {
  isCorrect: boolean;
  feedback?: string;
  hintsUnlocked?: string[];
  cluesRevealed?: string[];
  nextStep?: string;
  puzzleCompleted?: boolean;
} 