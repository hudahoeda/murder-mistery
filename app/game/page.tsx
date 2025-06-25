'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveTeam, setActiveTeam } from '@/lib/utils/gameUtils';
import { Team } from '@/lib/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { Clock, Users, FileText, Map, LogOut, Loader2, HelpCircle } from 'lucide-react';
import puzzlesData from '@/lib/data/puzzles.json';
import suspectsData from '@/lib/data/suspects.json';
import evidenceData from '@/lib/data/evidence.json';
import cluesData from '@/lib/data/clues.json';
import { Clue } from '@/lib/types/game';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

// Import all puzzle components
import { TrainSchedulePuzzle } from '@/components/puzzles/TrainSchedulePuzzle';
import { LostLuggageCipher } from '@/components/puzzles/LostLuggageCipher';
import { StationEnvironmentRiddle } from '@/components/puzzles/StationEnvironmentRiddle';
import WitnessStatementAnalysis from '@/components/puzzles/WitnessStatementAnalysis';
import CCTVImageAnalysis from '@/components/puzzles/CCTVImageAnalysis';
import MathematicalScheduleAnalysis from '@/components/puzzles/MathematicalScheduleAnalysis';
import { Timer } from '@/components/game/Timer';

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
  const [progressUpdateLoading, setProgressUpdateLoading] = useState(false);
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
        
        // Check for new clues
        const revealedClues = checkForNewClues(updatedTeam);
        if (revealedClues.length > 0) {
          setNewClue(revealedClues[0]); // Show first new clue
          setTimeout(() => setNewClue(null), 5000); // Hide after 5 seconds
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

  const handleHintUsed = () => {
    setHintsUsed(hintsUsed + 1);
    setShowHint(true);
    
    // Optionally save hint usage to Redis
    if (team && currentPuzzle) {
      fetch(`/api/team/${team.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzleId: currentPuzzle.id,
          stepId: currentPuzzle.steps[currentStepIndex].id,
          answer: null,
          isCorrect: false,
          timeSpent: 0,
          attempts: 0,
          hintsUsed: 1,
        }),
      }).catch(console.error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('murder-mystery-active-team-id');
    router.push('/');
  };

  const checkForNewClues = (updatedTeam: Team): Clue[] => {
    const newlyRevealed: Clue[] = [];
    (cluesData.clues as any[]).forEach(clue => {
      // If clue is already discovered, skip it
      if (updatedTeam.discoveredClues.includes(clue.id)) {
        return;
      }

      // Check if this clue's puzzle is completed
      const relevantPuzzleCompletion = updatedTeam.completedPuzzles.find(p => p.puzzleId === clue.revealCondition.puzzleId);
      if (relevantPuzzleCompletion) {
        // If stepId is defined, check if that specific step is complete and correct
        if (clue.revealCondition.stepId) {
          const stepIsComplete = relevantPuzzleCompletion.stepsCompleted.some(s => s.stepId === clue.revealCondition.stepId && s.isCorrect);
          if (stepIsComplete) {
            newlyRevealed.push(clue);
          }
        } else {
          // If no stepId, clue is revealed by completing the puzzle
          const puzzleData = puzzlesData.puzzles.find(p => p.id === clue.revealCondition.puzzleId);
          if (puzzleData && relevantPuzzleCompletion.stepsCompleted.length === puzzleData.steps.length) {
             const allStepsCorrect = puzzleData.steps.every(step => 
                relevantPuzzleCompletion.stepsCompleted.find(cs => cs.stepId === step.id && cs.isCorrect)
             );
             if(allStepsCorrect) newlyRevealed.push(clue);
          }
        }
      }
    });
    
    if (newlyRevealed.length > 0) {
        const newClueIds = newlyRevealed.map(c => c.id);
        const updatedDiscoveredClues = [...updatedTeam.discoveredClues, ...newClueIds];
        setTeam(prevTeam => prevTeam ? {...prevTeam, discoveredClues: updatedDiscoveredClues} : null);
        // Here you would also make an API call to save the new clue discoveries to Redis
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
                  {(evidenceData.evidence as any[]).map(item => (
                    <div key={item.id} className="group relative">
                        <Image src={item.imageUrl} alt={item.name} width={150} height={150} className="rounded-lg object-cover" />
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs text-center p-2">{item.name}</p>
                        </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Main Content - Puzzle Area */}
        <main className="lg:col-span-2">
           <Card className="h-full bg-slate-800/60 border-slate-700">
                <CardHeader>
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
                </CardHeader>
                <CardContent>
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
                        step={currentPuzzle.steps[currentStepIndex]} 
                        onStepComplete={handleStepComplete}
                        onComplete={handleStepComplete}
                        onHintUsed={handleHintUsed}
                      />
                    ) : (
                      <div className="text-center p-8">
                          <p>Could not load puzzle. Please check configuration.</p>
                      </div>
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
                        <ul className="space-y-2">
                            {team.discoveredClues.map(clueId => {
                                const clue = (cluesData.clues as any[]).find(c => c.id === clueId);
                                return clue ? (
                                  <li key={clueId} className="text-sm text-amber-200">
                                    <strong>{clue.title}:</strong> {clue.description}
                                  </li>
                                ) : null;
                            })}
                        </ul>
                    ) : (
                        <p className="text-slate-400 text-sm">No clues discovered yet.</p>
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