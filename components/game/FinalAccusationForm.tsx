'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { UserCheck, ShieldAlert, AlertTriangle, X } from 'lucide-react';
import { Suspect, Team } from '@/lib/types/game';

interface FinalAccusationFormProps {
  suspects: Suspect[];
  team: Team;
  onSubmit: (suspectId: string) => void;
}

export const FinalAccusationForm = ({ suspects, team, onSubmit }: FinalAccusationFormProps) => {
  const [selectedSuspect, setSelectedSuspect] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSuspect && !team.finalAccusationMade) {
      onSubmit(selectedSuspect);
    }
  };

  // If team has already made an accusation
  if (team.finalAccusationMade) {
    if (team.finalAccusationCorrect) {
      // This case is handled in the main page with confetti
      return null;
    } else {
      // Wrong accusation - show consequences
      const accusedSuspect = suspects.find(s => s.id === team.accusedSuspectId);
      const actualMurderer = suspects.find(s => s.isGuilty);
      
      return (
        <Card className="bg-red-900/40 border-red-600 border-2 shadow-lg shadow-red-600/20">
          <CardHeader className="text-center">
            <X className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <CardTitle className="text-3xl font-bold text-red-100">Case Failed</CardTitle>
            <CardDescription className="text-red-200 text-lg mt-2">
              Your accusation was incorrect. The consequences are severe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-red-800/40 border-red-600">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription className="text-red-100">
                <strong>You accused:</strong> {accusedSuspect?.name || 'Unknown'} - {accusedSuspect?.occupation}
                <br />
                <strong>Result:</strong> The accused has fled the country after being falsely accused. The real murderer remains at large.
              </AlertDescription>
            </Alert>
            
            <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700">
              <h3 className="text-xl font-bold text-amber-100 mb-3">The Truth Revealed</h3>
              <div className="flex items-center gap-4">
                <Image 
                  src={actualMurderer?.imageUrl || ''} 
                  alt={actualMurderer?.name || 'Unknown'} 
                  width={80} 
                  height={80} 
                  className="rounded-full border-2 border-amber-500"
                />
                <div>
                  <p className="text-lg font-semibold text-white">{actualMurderer?.name}</p>
                  <p className="text-slate-400">{actualMurderer?.occupation}</p>
                  <p className="text-sm text-amber-200 mt-1">Was the real murderer</p>
                </div>
              </div>
            </div>
            
            <div className="text-center text-slate-300">
              <p className="mb-2">The investigation has failed. Justice was not served.</p>
              <p className="text-sm text-slate-400">Your team's final score: {team.totalScore}</p>
            </div>
          </CardContent>
        </Card>
      );
    }
  }

  // First time making accusation
  return (
    <Card className="bg-slate-800/80 border-amber-500 border-2 shadow-lg shadow-amber-500/10">
      <CardHeader className="text-center">
        <UserCheck className="w-12 h-12 mx-auto text-amber-400 mb-4" />
        <CardTitle className="text-3xl font-bold text-amber-100">Final Accusation</CardTitle>
        <CardDescription className="text-slate-300 text-lg mt-2">
          The investigation is complete. Review the evidence and make your final decision.
        </CardDescription>
        <Alert className="mt-4 bg-amber-900/40 border-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-amber-100">
            <strong>WARNING:</strong> You only have ONE chance. If you accuse the wrong person, they will flee and the real murderer will escape justice. Choose wisely.
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup value={selectedSuspect} onValueChange={setSelectedSuspect}>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto p-2">
              {suspects.map(suspect => (
                <Label
                  key={suspect.id}
                  htmlFor={suspect.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedSuspect === suspect.id
                      ? 'border-amber-400 bg-amber-900/40'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <RadioGroupItem value={suspect.id} id={suspect.id} />
                  <Image src={suspect.imageUrl || ''} alt={suspect.name} width={50} height={50} className="rounded-full" />
                  <div className="flex-1">
                    <p className="font-bold text-lg text-white">{suspect.name}</p>
                    <p className="text-sm text-slate-400">{suspect.occupation}</p>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6" 
            disabled={!selectedSuspect}
          >
            <ShieldAlert className="w-5 h-5 mr-2" />
            Submit Final Accusation (No Going Back!)
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 