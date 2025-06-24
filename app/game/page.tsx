'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveTeam, setActiveTeam } from '@/lib/utils/gameUtils';
import { Team } from '@/lib/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { Clock, Users, FileText, Map, LogOut, Loader2 } from 'lucide-react';
import puzzlesData from '@/lib/data/puzzles.json';
import suspectsData from '@/lib/data/suspects.json';
import evidenceData from '@/lib/data/evidence.json';
import cluesData from '@/lib/data/clues.json';
import { Clue } from '@/lib/types/game';

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
  }, [router]);

  const handleStepComplete = async (answer: any, isCorrect: boolean) => {
    if (!team || !currentPuzzle) return;
    
    try {
      const response = await fetch(`/api/team/${team.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzleId: currentPuzzle.id,
          stepId: currentPuzzle.steps[currentStepIndex].id,
          answer,
          isCorrect,
          timeSpent: 1, // Placeholder for actual time tracking
          attempts: 1, // Placeholder for attempt tracking
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
        } else {
          // Puzzle complete, server should have updated team.currentPuzzle
          alert('Puzzle Complete!');
          setCurrentStepIndex(0); // Reset for next puzzle
        }
        
        // Check for new clues
        const revealedClues = checkForNewClues(updatedTeam);
        if (revealedClues.length > 0) {
            alert(`New clue(s) discovered: ${revealedClues.map(c => c.title).join(', ')}`);
        }

      } else {
        alert('Incorrect. Try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving progress.');
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
  }

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
                </CardHeader>
                <CardContent>
                    {PuzzleComponent ? (
                      <PuzzleComponent
                        step={currentPuzzle.steps[currentStepIndex]} 
                        onStepComplete={handleStepComplete}
                        onComplete={handleStepComplete}
                        onHintUsed={() => console.log('Hint used')}
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
                                return <li key={clueId} className="text-sm text-amber-200">{clue?.title || 'Unknown Clue'}</li>
                            })}
                        </ul>
                    ) : (
                        <p className="text-slate-400 text-sm">No clues discovered yet.</p>
                    )}
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