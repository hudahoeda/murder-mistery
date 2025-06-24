'use client';

import React, { useState, useEffect } from 'react';
import { StationEnvironmentRiddle } from '@/components/puzzles/StationEnvironmentRiddle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, CheckCircle } from 'lucide-react';
import { Puzzle as PuzzleType, PuzzleStep } from '@/lib/types/game';
import puzzlesData from '@/lib/data/puzzles.json';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

export default function StationRiddleDemoPage() {
  const [puzzle, setPuzzle] = useState<PuzzleType | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);

  useEffect(() => {
    const riddlePuzzle = (puzzlesData.puzzles as any as PuzzleType[]).find(p => p.id === 'station-environment-riddle');
    if (riddlePuzzle) {
      setPuzzle(riddlePuzzle);
      setCurrentStepIndex(0);
      setStartTime(Date.now());
    }
  }, []);

  const handleStepComplete = (answer: any, isCorrect: boolean) => {
    if (isCorrect) {
      if (puzzle && currentStepIndex < puzzle.steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        alert(`🎉 Puzzle completed successfully in ${timeSpent} seconds!`);
        setPuzzleCompleted(true);
      }
    } else {
      alert('❌ Incorrect answer. Please try again.');
    }
  };

  if (!puzzle) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Loading puzzle...</p>
      </div>
    );
  }

  const currentStep = puzzle.steps[currentStepIndex];
  const puzzleNumber = puzzlesData.puzzles.findIndex(p => p.id === 'station-environment-riddle') + 1;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="sm" className="text-slate-400" asChild>
              <Link href="/demo">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Demos
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-amber-100">Puzzle Demo: Station Environment Riddle</h1>
              <p className="text-sm text-slate-400">SVG and 360 viewer interactions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-400">Ready for Testing</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Demo Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-amber-100 flex items-center gap-3">
              <Eye className="w-6 h-6 text-indigo-500" />
              Puzzle {puzzleNumber}/{puzzlesData.puzzles.length}: {puzzle.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{puzzle.steps.length}</div>
                <div className="text-sm text-slate-400">Interactive Steps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{puzzle.totalTimeEstimate}</div>
                <div className="text-sm text-slate-400">Estimated Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{puzzle.difficulty}/5</div>
                <div className="text-sm text-slate-400">Difficulty Level</div>
              </div>
            </div>
            
            <div className="mt-4">
              <Label>Progress</Label>
              <Progress value={((currentStepIndex + 1) / puzzle.steps.length) * 100} className="w-full" />
              <p className="text-sm text-slate-400 mt-1 text-center">Step {currentStepIndex + 1} of {puzzle.steps.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Puzzle Component */}
        {!puzzleCompleted ? (
          <StationEnvironmentRiddle
            step={currentStep}
            onStepComplete={handleStepComplete}
          />
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-green-400 mb-4">Puzzle Complete!</h2>
              <p className="text-slate-300">You successfully solved the station riddle.</p>
            </CardContent>
          </Card>
        )}
        
        {/* Development Notes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-amber-100">Development Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <strong className="text-amber-200">Step 1:</strong> Location riddle to identify the maintenance depot.
              </div>
              <div>
                <strong className="text-amber-200">Step 2:</strong> Interactive SVG station map to pinpoint the correct depot area.
              </div>
              <div>
                <strong className="text-amber-200">Step 3:</strong> 360° panoramic evidence discovery within the selected depot.
              </div>
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-200">
                  <strong>Validation:</strong> The component for this puzzle now correctly receives a step object. The demo page now manages the step state and progression.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 