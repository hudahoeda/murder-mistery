'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { UserCheck, ShieldAlert } from 'lucide-react';
import { Suspect } from '@/lib/types/game';

interface FinalAccusationFormProps {
  suspects: Suspect[];
  onSubmit: (suspectId: string) => void;
}

export const FinalAccusationForm = ({ suspects, onSubmit }: FinalAccusationFormProps) => {
  const [selectedSuspect, setSelectedSuspect] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSuspect) {
      onSubmit(selectedSuspect);
    }
  };

  return (
    <Card className="bg-slate-800/80 border-amber-500 border-2 shadow-lg shadow-amber-500/10">
      <CardHeader className="text-center">
        <UserCheck className="w-12 h-12 mx-auto text-amber-400 mb-4" />
        <CardTitle className="text-3xl font-bold text-amber-100">Final Accusation</CardTitle>
        <CardDescription className="text-slate-300 text-lg mt-2">
          The investigation is complete. Review the evidence and make your final decision. There's no going back.
        </CardDescription>
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
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6" disabled={!selectedSuspect}>
            <ShieldAlert className="w-5 h-5 mr-2" />
            Submit Final Accusation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 