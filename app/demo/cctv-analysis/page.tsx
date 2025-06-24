'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Camera, Settings, Search, Users } from 'lucide-react'
import Link from 'next/link'
import CCTVImageAnalysis from '@/components/puzzles/CCTVImageAnalysis'
import { Puzzle as PuzzleType, PuzzleStep } from '@/lib/types/game';
import puzzlesData from '@/lib/data/puzzles.json';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

export default function CCTVAnalysisDemoPage() {
  const [puzzle, setPuzzle] = useState<PuzzleType | null>(null);
  const [currentStep, setCurrentStep] = useState<PuzzleStep | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);

  useEffect(() => {
    // More robust puzzle finding with better error handling
    const allPuzzles = puzzlesData?.puzzles || [];
    const cctvPuzzle = allPuzzles.find((p: any) => p.id === 'cctv-image-analysis');
    
    if (cctvPuzzle && cctvPuzzle.steps && cctvPuzzle.steps.length > 0) {
      setPuzzle(cctvPuzzle as PuzzleType);
      setCurrentStep(cctvPuzzle.steps[0] as PuzzleStep);
      setStepIndex(0);
    } else {
      console.error('❌ CCTV puzzle not found or invalid structure!');
      console.error('Available puzzle IDs:', allPuzzles.map((p: any) => p.id));
    }
  }, []);

  const handleStepComplete = (answer: any, isCorrect: boolean) => {
    if (isCorrect) {
      if (puzzle && stepIndex < puzzle.steps.length - 1) {
        const nextStepIndex = stepIndex + 1;
        setStepIndex(nextStepIndex);
        setCurrentStep(puzzle.steps[nextStepIndex]);
      } else {
        alert(`🎉 Puzzle completed successfully!`);
        setPuzzleCompleted(true);
      }
    } else {
      alert('❌ Incorrect answer. Please try again.');
    }
  };

  const handleHintUsed = () => {
    console.log('Hint requested in CCTV Analysis demo')
  }

  if (!puzzle || !currentStep) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Loading puzzle...</p>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold text-amber-100">CCTV Image Analysis Demo</h1>
              <p className="text-sm text-slate-400">Canvas-based Image Enhancement System</p>
            </div>
          </div>
          
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            Interactive Demo
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Demo Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-amber-100 flex items-center gap-3">
              <Camera className="w-6 h-6 text-blue-500" />
              CCTV Image Analysis Puzzle Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
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
              <Progress value={((stepIndex + 1) / puzzle.steps.length) * 100} className="w-full" />
              <p className="text-sm text-slate-400 mt-1 text-center">Step {stepIndex + 1} of {puzzle.steps.length}: {currentStep.title}</p>
            </div>
          </CardContent>
        </Card>

        {/* Puzzle Demo */}
        {!puzzleCompleted ? (
           <CCTVImageAnalysis 
            step={currentStep}
            onStepComplete={handleStepComplete}
            onHintUsed={handleHintUsed}
          />
        ) : (
            <Card>
                <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-green-400 mb-4">Demo Complete!</h2>
                <p className="text-slate-300">You successfully tested the CCTV analysis puzzle.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
} 