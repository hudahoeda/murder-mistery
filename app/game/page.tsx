'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveTeam, setActiveTeam, updateTeamHintUsage } from '@/lib/utils/gameUtils';
import { Team } from '@/lib/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { Clock, Users, FileText, Map, LogOut, Loader2, HelpCircle, Lock, Copy, Check, Trophy } from 'lucide-react';
import puzzlesData from '@/lib/data/puzzles.json';
import suspectsData from '@/lib/data/suspects.json';
import evidenceData from '@/lib/data/evidence.json';
import cluesData from '@/lib/data/clues.json';
import { Clue } from '@/lib/types/game';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';

// Import all puzzle components
import { TrainSchedulePuzzle } from '@/components/puzzles/TrainSchedulePuzzle';
import { LostLuggageCipher } from '@/components/puzzles/LostLuggageCipher';
import { StationEnvironmentRiddle } from '@/components/puzzles/StationEnvironmentRiddle';
import WitnessStatementAnalysis from '@/components/puzzles/WitnessStatementAnalysis';
import CCTVImageAnalysis from '@/components/puzzles/CCTVImageAnalysis';
import MathematicalScheduleAnalysis from '@/components/puzzles/MathematicalScheduleAnalysis';
import { Timer } from '@/components/game/Timer';
import { FinalAccusationForm } from '@/components/game/FinalAccusationForm';
import { Leaderboard } from '@/components/game/Leaderboard';
import { CelebrationScreen } from '@/components/game/CelebrationScreen';

interface LeaderboardEntry {
  teamId: string;
  teamName: string;
  totalScore: number;
  timeToComplete: number;
  puzzlesCompleted: number;
  accusationCorrect: boolean;
  rank: number;
}

const puzzleComponentMap: { [key: string]: React.FC<any> } = {
  'train-schedule-investigation': TrainSchedulePuzzle,
  'lost-luggage-cipher': LostLuggageCipher,
  'station-environment-riddle': StationEnvironmentRiddle,
  'witness-statement-analysis': WitnessStatementAnalysis,
  'cctv-image-analysis': CCTVImageAnalysis,
  'mathematical-schedule-analysis': MathematicalScheduleAnalysis,
};

const GameDashboard = () => {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepStartTime, setStepStartTime] = useState<Date>(new Date());
  const [stepAttempts, setStepAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [newClue, setNewClue] = useState<Clue | null>(null);
  const [newEvidence, setNewEvidence] = useState<any>(null);
  const [progressUpdateLoading, setProgressUpdateLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const progressUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const activeTeamId = localStorage.getItem('murder-mystery-active-team-id');

    if (!activeTeamId) {
      router.push('/game/register');
      return;
    }

    const fetchTeamData = async () => {
      try {
        const response = await fetch(`/api/team/${activeTeamId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch team data');
        }
        const data: Team = await response.json();
        setTeam(data);
        
        // Reset step timing when loading team data
        setStepStartTime(new Date());
        setStepAttempts(0);
        setHintsUsed(0);
      } catch (error) {
        console.error(error);
        // If team not found on server, clear local storage and redirect
        localStorage.removeItem('murder-mystery-active-team-id');
        router.push('/game/register');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();

    // Set up periodic progress updates (every 30 seconds)
    progressUpdateInterval.current = setInterval(fetchTeamData, 30000);

    return () => {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    };
  }, [router]);

  useEffect(() => {
    if (team) {
      const progress = calculateOverallProgress();
      if (progress >= 100) {
        setIsGameComplete(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team]);

  const handleStepComplete = async (answer: any, isCorrect: boolean) => {
    if (!team || !currentPuzzle || progressUpdateLoading) return;
    
    setProgressUpdateLoading(true);
    const timeSpent = Math.floor((new Date().getTime() - stepStartTime.getTime()) / 1000 / 60); // minutes
    const attempts = stepAttempts + 1;
    
    try {
      const response = await fetch(`/api/team/${team.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzleId: currentPuzzle.id,
          stepId: currentPuzzle.steps[currentStepIndex].id,
          answer,
          isCorrect,
          timeSpent: Math.max(timeSpent, 1), // Minimum 1 minute
          attempts,
          hintsUsed,
        }),
      });

      if (!response.ok) throw new Error('Failed to save progress');
      
      const updatedTeam: Team = await response.json();
      setTeam(updatedTeam);

      if (isCorrect) {
        // Move to next step or next puzzle
        const currentPuzzleDetails = puzzlesData.puzzles[team.currentPuzzle - 1];
        if (currentPuzzleDetails && currentStepIndex < currentPuzzleDetails.steps.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1);
          // Reset tracking for new step
          setStepStartTime(new Date());
          setStepAttempts(0);
          setHintsUsed(0);
          setShowHint(false);
        } else {
          // Puzzle complete, server should have updated team.currentPuzzle
          alert('Puzzle Complete! 🎉');
          setCurrentStepIndex(0); // Reset for next puzzle
          setStepStartTime(new Date());
          setStepAttempts(0);
          setHintsUsed(0);
          setShowHint(false);
        }
        
        // Check for new clues and evidence
        const newlyRevealedClues = checkForNewItems(updatedTeam, 'clues');
        if (newlyRevealedClues.length > 0) {
          setNewClue(newlyRevealedClues[0]); // Show first new clue
          setTimeout(() => setNewClue(null), 5000); // Hide after 5 seconds
        }

        const newlyRevealedEvidence = checkForNewItems(updatedTeam, 'evidence');
        if (newlyRevealedEvidence.length > 0) {
          setNewEvidence(newlyRevealedEvidence[0]); // Show first new evidence
          setTimeout(() => setNewEvidence(null), 5000); // Hide after 5 seconds
        }
      } else {
        setStepAttempts(attempts);
        alert('Incorrect. Try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving progress.');
    } finally {
      setProgressUpdateLoading(false);
    }
  };

  const handleHintUsed = async () => {
    if (!team || !currentPuzzle) return;

    setHintsUsed(hintsUsed + 1);
    setShowHint(true);
    
    try {
      const updatedTeamData = updateTeamHintUsage(team, currentPuzzle.id);
      setTeam(updatedTeamData);

      await fetch(`/api/team/${team.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzleId: currentPuzzle.id,
          stepId: currentPuzzle.steps[currentStepIndex].id,
          isCorrect: false,
          timeSpent: 0,
          attempts: 0,
          hintsUsed: 1, // Signal to backend that a hint was used
        }),
      });
    } catch (error) {
      console.error('Failed to update hint usage:', error);
      // Optionally revert state if API call fails
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('murder-mystery-active-team-id');
    router.push('/');
  };

  const handleCopyId = () => {
    if (team?.id) {
      navigator.clipboard.writeText(team.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFinalAccusation = async (suspectId: string) => {
    if (!team || team.finalAccusationMade) return;

    const guiltySuspect = suspectsData.suspects.find(s => s.isGuilty);
    const isCorrect = guiltySuspect?.id === suspectId;
    
    // Calculate time to complete
    const timeToComplete = Math.floor((new Date().getTime() - new Date(team.gameStartTime).getTime()) / 1000 / 60);
    
    try {
      // Save final accusation to server
      const response = await fetch(`/api/team/${team.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalAccusationMade: true,
          finalAccusationCorrect: isCorrect,
          accusedSuspectId: suspectId,
          gameCompletedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to save final accusation');
      
      const updatedTeam: Team = await response.json();
      setTeam(updatedTeam);

      if (isCorrect) {
        // Trigger confetti celebration
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#d97706', '#dc2626', '#991b1b'],
        });

        // Wait a moment for confetti to start, then show more
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#fbbf24', '#f59e0b', '#d97706'],
          });
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#fbbf24', '#f59e0b', '#d97706'],
          });
        }, 250);

        // Fetch leaderboard data
        const leaderboardResponse = await fetch('/api/team/leaderboard');
        if (leaderboardResponse.ok) {
          const leaderboard: LeaderboardEntry[] = await leaderboardResponse.json();
          setLeaderboardData(leaderboard);
          setShowLeaderboard(true);
        }
      }
    } catch (error) {
      console.error('Error saving final accusation:', error);
      alert('Error saving your accusation. Please try again.');
    }
  };

  const checkForNewItems = (updatedTeam: Team, itemType: 'clues' | 'evidence'): any[] => {
    const data = itemType === 'clues' ? cluesData.clues : evidenceData.evidence;
    const discoveredItems = itemType === 'clues' ? updatedTeam.discoveredClues : updatedTeam.discoveredEvidence || [];
    const newlyRevealed: any[] = [];

    (data as any[]).forEach(item => {
      // If item or its reveal condition is missing, or already discovered, skip it
      if (!item || !item.revealCondition || discoveredItems.includes(item.id)) {
        return;
      }

      // Check if this item's puzzle is completed
      const relevantPuzzleCompletion = updatedTeam.completedPuzzles.find(p => p.puzzleId === item.revealCondition.puzzleId);
      if (relevantPuzzleCompletion) {
        // If stepId is defined, check if that specific step is complete and correct
        if (item.revealCondition.stepId) {
          const stepIsComplete = relevantPuzzleCompletion.stepsCompleted.some(s => s.stepId === item.revealCondition.stepId && s.isCorrect);
          if (stepIsComplete) {
            newlyRevealed.push(item);
          }
        } else {
          // If no stepId, item is revealed by completing the puzzle
          const puzzleData = puzzlesData.puzzles.find(p => p.id === item.revealCondition.puzzleId);
          if (puzzleData && relevantPuzzleCompletion.stepsCompleted.length === puzzleData.steps.length) {
             const allStepsCorrect = puzzleData.steps.every(step => 
                relevantPuzzleCompletion.stepsCompleted.find(cs => cs.stepId === step.id && cs.isCorrect)
             );
             if(allStepsCorrect) newlyRevealed.push(item);
          }
        }
      }
    });
    
    if (newlyRevealed.length > 0) {
        const newItemIds = newlyRevealed.map(c => c.id);
        if (itemType === 'clues') {
            const updatedDiscoveredClues = [...updatedTeam.discoveredClues, ...newItemIds];
            setTeam(prevTeam => prevTeam ? {...prevTeam, discoveredClues: updatedDiscoveredClues} : null);
        } else {
            const updatedDiscoveredEvidence = [...(updatedTeam.discoveredEvidence || []), ...newItemIds];
            setTeam(prevTeam => prevTeam ? {...prevTeam, discoveredEvidence: updatedDiscoveredEvidence} : null);
        }
        // Here you would also make an API call to save the new discoveries to Redis
    }
    
    return newlyRevealed;
  };

  const calculateOverallProgress = (): number => {
    if (!team) return 0;
    const totalPuzzles = puzzlesData.puzzles.length;
    const completedPuzzles = team.completedPuzzles.filter(p => {
      const puzzleData = puzzlesData.puzzles.find(pd => pd.id === p.puzzleId);
      if (!puzzleData) return false;
      return p.stepsCompleted.length === puzzleData.steps.length && 
             p.stepsCompleted.every(s => s.isCorrect);
    }).length;
    return (completedPuzzles / totalPuzzles) * 100;
  };

  const calculatePuzzleProgress = (): number => {
    if (!team || !currentPuzzle) return 0;
    const completedPuzzle = team.completedPuzzles.find(p => p.puzzleId === currentPuzzle.id);
    if (!completedPuzzle) return 0;
    const correctSteps = completedPuzzle.stepsCompleted.filter(s => s.isCorrect).length;
    return (correctSteps / currentPuzzle.steps.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-16 h-16 animate-spin text-amber-500" />
        <p className="mt-4 text-lg">Loading your investigation...</p>
      </div>
    );
  }

  if (!team) {
    // This state should ideally not be reached due to the redirect, but it's good practice.
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
            <p>No active team found. Redirecting to registration...</p>
        </div>
    )
  }
  
  const currentPuzzle = puzzlesData.puzzles[team.currentPuzzle - 1];
  const PuzzleComponent = puzzleComponentMap[currentPuzzle?.id];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-amber-100">{team.name}</h1>
          <p className="text-slate-400">Investigation in Progress</p>
          {team && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-slate-500">Team ID:</span>
              <code className="text-xs bg-slate-700 text-amber-200 px-2 py-1 rounded font-mono">
                {team.id}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-white"
                onClick={handleCopyId}
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                <Timer startTime={team.gameStartTime} />
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                End Session
            </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-sm text-slate-400">
          <span>Overall Progress</span>
          <span>{Math.round(calculateOverallProgress())}%</span>
        </div>
        <Progress value={calculateOverallProgress()} className="h-2" />
        
        {currentPuzzle && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Current Puzzle: {currentPuzzle.title}</span>
              <span>{Math.round(calculatePuzzleProgress())}%</span>
            </div>
            <Progress value={calculatePuzzleProgress()} className="h-2 bg-amber-900" />
          </div>
        )}
      </div>

      {/* New Clue Alert */}
      {newClue && (
        <Alert className="mb-4 bg-amber-500/20 border-amber-500 text-amber-100">
          <HelpCircle className="h-4 w-4" />
          <AlertDescription>
            New clue discovered: <strong>{newClue.title}</strong>
          </AlertDescription>
        </Alert>
      )}

      {/* New Evidence Alert */}
      {newEvidence && (
        <Alert className="mb-4 bg-green-500/20 border-green-500 text-green-100">
          <FileText className="h-4 w-4" />
          <AlertDescription>
            New evidence unlocked: <strong>{newEvidence.name}</strong>
          </AlertDescription>
        </Alert>
      )}

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Suspects & Evidence */}
        <aside className="lg:col-span-1 space-y-6">
          <Tabs defaultValue="suspects" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="suspects"><Users className="w-4 h-4 mr-2"/>Suspects</TabsTrigger>
              <TabsTrigger value="evidence"><FileText className="w-4 h-4 mr-2"/>Evidence</TabsTrigger>
            </TabsList>
            <TabsContent value="suspects">
              <Card className="bg-slate-800/60 border-slate-700">
                <CardHeader>
                  <CardTitle>Suspect Profiles</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-y-auto">
                  <Accordion type="single" collapsible>
                    {suspectsData.suspects.map(suspect => (
                      <AccordionItem value={suspect.id} key={suspect.id}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-3">
                            <Image src={suspect.imageUrl} alt={suspect.name} width={40} height={40} className="rounded-full" />
                            {suspect.name}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-slate-300">{suspect.backstory}</p>
                          <p className="text-xs text-slate-400 mt-2">Occupation: {suspect.occupation}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="evidence">
              <Card className="bg-slate-800/60 border-slate-700">
                <CardHeader>
                  <CardTitle>Evidence Board</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-y-auto grid grid-cols-2 gap-4">
                  {(evidenceData.evidence as any[]).map(item => {
                    const isDiscovered = team.discoveredEvidence?.includes(item.id);
                    return isDiscovered ? (
                      <div key={item.id} className="group relative">
                          <Image src={item.imageUrl} alt={item.name} width={150} height={150} className="rounded-lg object-cover" />
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-xs text-center p-2">{item.name}</p>
                          </div>
                      </div>
                    ) : (
                      <div key={item.id} className="w-full h-[150px] bg-slate-700/50 rounded-lg flex flex-col items-center justify-center text-center p-2 border-2 border-dashed border-slate-600">
                        <Lock className="w-6 h-6 text-slate-500 mb-2" />
                        <p className="text-xs text-slate-500">Evidence Locked</p>
                        <p className="text-xxs text-slate-600">Complete puzzles to reveal</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Main Content - Puzzle Area */}
        <main className="lg:col-span-2">
           <Card className="h-full bg-slate-800/60 border-slate-700">
                <CardHeader>
                  {isGameComplete ? (
                    <>
                      <CardTitle className="text-amber-100 text-2xl">Make Your Final Accusation</CardTitle>
                      <CardDescription>The case is in your hands. Review the evidence and choose the killer.</CardDescription>
                    </>
                  ) : (
                    <>
                      <CardTitle className="text-amber-100">{currentPuzzle?.title || "Investigation Hub"}</CardTitle>
                      <CardDescription>{currentPuzzle?.description || "Select a puzzle to begin."}</CardDescription>
                      {currentPuzzle && (
                        <div className="mt-4 flex gap-4 text-sm text-slate-400">
                          <span>Step {currentStepIndex + 1} of {currentPuzzle.steps.length}</span>
                          <span>•</span>
                          <span>Attempts: {stepAttempts}</span>
                          <span>•</span>
                          <span>Hints Used: {hintsUsed}</span>
                        </div>
                      )}
                    </>
                  )}
                </CardHeader>
                <CardContent>
                  {isGameComplete ? (
                    showLeaderboard && team.finalAccusationMade && team.finalAccusationCorrect ? (
                      <CelebrationScreen 
                        team={team} 
                        leaderboardData={leaderboardData} 
                        murdererName={suspectsData.suspects.find(s => s.isGuilty)?.name || ''} 
                        murdererImage={suspectsData.suspects.find(s => s.isGuilty)?.imageUrl || ''}
                        onHomeClick={() => router.push('/')}
                      />
                    ) : (
                      <FinalAccusationForm suspects={suspectsData.suspects} team={team} onSubmit={handleFinalAccusation} />
                    )
                  ) : (
                    <>
                      {/* Hint Display */}
                      {showHint && currentPuzzle && (
                        <Alert className="mb-4 bg-blue-500/20 border-blue-500">
                          <HelpCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Hint:</strong> {currentPuzzle.steps[currentStepIndex].hintText || "No hint available for this step."}
                          </AlertDescription>
                        </Alert>
                      )}

                      {PuzzleComponent ? (
                        <PuzzleComponent
                          key={`${currentPuzzle.id}-${currentStepIndex}-${stepAttempts}`}
                          step={currentPuzzle.steps[currentStepIndex]}
                          onStepComplete={handleStepComplete}
                          onHintUsed={handleHintUsed}
                        />
                      ) : (
                        <div className="text-center p-8">
                            <p>Could not load puzzle. Please check configuration.</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
           </Card>
        </main>

        {/* Right Sidebar - Clues & Map */}
        <aside className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-800/60 border-slate-700">
                <CardHeader>
                    <CardTitle>Discovered Clues</CardTitle>
                </CardHeader>
                <CardContent>
                    {team.discoveredClues.length > 0 ? (
                        <ul className="space-y-3">
                            {team.discoveredClues.map(clueId => {
                                const clue = (cluesData.clues as any[]).find(c => c.id === clueId);
                                return clue ? (
                                  <li key={clueId} className="text-sm text-slate-300 leading-relaxed">
                                    <strong className="text-amber-200 block">{clue.title}</strong>
                                    {clue.content}
                                  </li>
                                ) : null;
                            })}
                        </ul>
                    ) : (
                        <p className="text-slate-400 text-sm italic">No clues discovered yet.</p>
                    )}
                </CardContent>
            </Card>
            
            {/* Analytics Card */}
            <Card className="bg-slate-800/60 border-slate-700">
                <CardHeader>
                    <CardTitle>Team Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Puzzles Completed:</span>
                        <span className="text-amber-200">{team.completedPuzzles.filter(p => {
                          const puzzleData = puzzlesData.puzzles.find(pd => pd.id === p.puzzleId);
                          return puzzleData && p.stepsCompleted.length === puzzleData.steps.length && 
                                 p.stepsCompleted.every(s => s.isCorrect);
                        }).length} / {puzzlesData.puzzles.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Total Score:</span>
                        <span className="text-amber-200">{team.totalScore}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Clues Found:</span>
                        <span className="text-amber-200">{team.discoveredClues.length} / {cluesData.clues.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Team Members:</span>
                        <span className="text-amber-200">{team.members.length}</span>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="bg-slate-800/60 border-slate-700">
                <CardHeader>
                    <CardTitle>Station Map</CardTitle>
                </CardHeader>
                <CardContent>
                    <Image src="/images/station/manggarai-station-map.svg" alt="Station Map" width={500} height={300} className="rounded-lg bg-slate-700 p-2" />
                </CardContent>
            </Card>
        </aside>
      </main>
    </div>
  );
};

export default GameDashboard;