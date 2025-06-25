'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, CheckCircle, Share2, Home } from 'lucide-react';
import { Team } from '@/lib/types/game';
import { Leaderboard } from './Leaderboard';
import Image from 'next/image';

interface CelebrationScreenProps {
  team: Team;
  leaderboardData: any[];
  murdererName: string;
  murdererImage: string;
  onHomeClick: () => void;
}

export const CelebrationScreen = ({ 
  team, 
  leaderboardData, 
  murdererName,
  murdererImage,
  onHomeClick 
}: CelebrationScreenProps) => {
  const timeToComplete = team.gameCompletedAt 
    ? Math.floor((new Date(team.gameCompletedAt).getTime() - new Date(team.gameStartTime).getTime()) / 1000 / 60)
    : 0;

  const shareResult = () => {
    const text = `I solved the Murder Mystery at Manggarai Station! 🎉\n\nTeam: ${team.name}\nScore: ${team.totalScore}\nTime: ${timeToComplete} minutes\n\nCan you solve it faster?`;
    if (navigator.share) {
      navigator.share({
        title: 'Murder Mystery Solved!',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="bg-gradient-to-br from-amber-900/40 to-green-900/40 border-amber-400 border-2 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4 relative">
            <Trophy className="w-20 h-20 text-amber-400 animate-bounce" />
            <Star className="w-8 h-8 text-yellow-300 absolute -top-2 -left-2 animate-pulse" />
            <Star className="w-6 h-6 text-yellow-300 absolute -bottom-1 -right-3 animate-pulse" />
          </div>
          <CardTitle className="text-4xl font-bold text-amber-100">Case Solved!</CardTitle>
          <CardDescription className="text-xl text-amber-200 mt-2">
            Congratulations, Detective {team.name}!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-900/60 rounded-lg p-6 text-center">
            <p className="text-lg text-white mb-4">You correctly identified the murderer:</p>
            <div className="flex items-center justify-center gap-4">
              <Image 
                src={murdererImage} 
                alt={murdererName} 
                width={100} 
                height={100} 
                className="rounded-full border-4 border-red-600"
              />
              <div className="text-left">
                <p className="text-2xl font-bold text-red-400">{murdererName}</p>
                <p className="text-slate-300">The killer has been brought to justice!</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-800/60 rounded-lg p-4">
              <Trophy className="w-8 h-8 mx-auto text-amber-400 mb-2" />
              <p className="text-2xl font-bold text-amber-200">{team.totalScore}</p>
              <p className="text-sm text-slate-400">Total Score</p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-4">
              <CheckCircle className="w-8 h-8 mx-auto text-green-400 mb-2" />
              <p className="text-2xl font-bold text-green-200">{team.completedPuzzles.length}</p>
              <p className="text-sm text-slate-400">Puzzles Solved</p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-4">
              <Star className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
              <p className="text-2xl font-bold text-yellow-200">{timeToComplete}m</p>
              <p className="text-sm text-slate-400">Time Taken</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={shareResult}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Result
            </Button>
            <Button 
              onClick={onHomeClick}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Leaderboard entries={leaderboardData} currentTeam={team} />
    </div>
  );
}; 