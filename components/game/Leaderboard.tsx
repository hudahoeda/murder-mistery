'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Clock, Target, Brain, Medal } from 'lucide-react';
import { Team } from '@/lib/types/game';

interface LeaderboardEntry {
  teamId: string;
  teamName: string;
  totalScore: number;
  timeToComplete: number; // in minutes
  puzzlesCompleted: number;
  accusationCorrect: boolean;
  rank: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentTeam: Team;
}

export const Leaderboard = ({ entries, currentTeam }: LeaderboardProps) => {
  const currentTeamEntry = entries.find(e => e.teamId === currentTeam.id);
  const topEntries = entries.slice(0, 10);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Card className="bg-slate-800/90 border-amber-500 border-2 shadow-xl">
      <CardHeader className="text-center">
        <Trophy className="w-12 h-12 mx-auto text-amber-400 mb-4" />
        <CardTitle className="text-3xl font-bold text-amber-100">Global Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current Team Highlight */}
        {currentTeamEntry && (
          <div className="mb-6 p-4 bg-amber-900/40 border-2 border-amber-400 rounded-lg">
            <h3 className="text-lg font-bold text-amber-100 mb-2">Your Team's Performance</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-white">Rank: #{currentTeamEntry.rank}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span className="text-white">Score: {currentTeamEntry.totalScore}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-white">Time: {formatTime(currentTeamEntry.timeToComplete)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" />
                <span className="text-white">Puzzles: {currentTeamEntry.puzzlesCompleted}</span>
              </div>
            </div>
          </div>
        )}

        {/* Top 10 Teams */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white mb-3">Top 10 Teams</h3>
          {topEntries.map((entry) => (
            <div
              key={entry.teamId}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                entry.teamId === currentTeam.id
                  ? 'bg-amber-900/30 border-amber-400'
                  : 'bg-slate-700/40 border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div>
                  <p className="font-semibold text-white">{entry.teamName}</p>
                  <p className="text-xs text-slate-400">
                    {entry.accusationCorrect ? 'Case Solved' : 'Case Failed'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-200">{entry.totalScore} pts</p>
                <p className="text-xs text-slate-400">{formatTime(entry.timeToComplete)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* If current team is not in top 10 */}
        {currentTeamEntry && currentTeamEntry.rank > 10 && (
          <div className="mt-4 pt-4 border-t border-slate-600">
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-900/30 border border-amber-400">
              <div className="flex items-center gap-3">
                <div className="w-8 flex justify-center">
                  <span className="text-lg font-bold text-slate-400">#{currentTeamEntry.rank}</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{currentTeam.name}</p>
                  <p className="text-xs text-slate-400">Your Team</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-200">{currentTeamEntry.totalScore} pts</p>
                <p className="text-xs text-slate-400">{formatTime(currentTeamEntry.timeToComplete)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 