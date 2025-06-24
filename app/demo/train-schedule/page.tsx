'use client';

import React from 'react';
import { TrainSchedulePuzzle } from '@/components/puzzles/TrainSchedulePuzzle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Train, CheckCircle } from 'lucide-react';

export default function TrainScheduleDemoPage() {
  const handlePuzzleComplete = (success: boolean, timeSpent: number) => {
    if (success) {
      alert(`🎉 Puzzle completed successfully in ${timeSpent} seconds!`);
    } else {
      alert('❌ Puzzle not completed correctly. Try again!');
    }
  };

  const handleHintUsed = () => {
    console.log('Hint used - tracking for analytics');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-slate-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
            <div>
              <h1 className="text-xl font-bold text-amber-100">Puzzle Demo: Train Schedule Investigation</h1>
              <p className="text-sm text-slate-400">Multi-step puzzle progression testing</p>
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
              <Train className="w-6 h-6 text-blue-500" />
              Puzzle 1/6: Train Schedule Investigation Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">3</div>
                <div className="text-sm text-slate-400">Interactive Steps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">22</div>
                <div className="text-sm text-slate-400">Estimated Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">4/5</div>
                <div className="text-sm text-slate-400">Difficulty Level</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-200 text-sm">
                <strong>Features:</strong> Text highlighting, evidence cross-referencing, interactive timeline construction, 
                and alibi contradiction detection with multi-source evidence validation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Puzzle Component */}
        <div className="p-8 text-center">
          <p className="text-slate-300">Train Schedule Investigation puzzle component will be integrated here.</p>
        </div>
        
        {/* Development Notes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-amber-100">Development Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <strong className="text-amber-200">Step 1:</strong> Text extraction from Rahman's security statement with highlighting system for times, locations, and key information.
              </div>
              <div>
                <strong className="text-amber-200">Step 2:</strong> Evidence cross-referencing with CCTV footage, witness accounts, and security logs to identify contradictions.
              </div>
              <div>
                <strong className="text-amber-200">Step 3:</strong> Timeline construction showing Rahman's unaccounted time period overlapping with the estimated time of death.
              </div>
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-200">
                  <strong>Validation:</strong> Multi-level validation system with partial credit for text extraction, 
                  exact matching for contradiction identification, and flexible time format acceptance for timeline answers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 