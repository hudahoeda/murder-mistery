'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, Trophy, Home } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TeamSummary {
  id: string;
  name: string;
  totalScore: number;
  progressPercentage: number;
  totalGameTime: number; // in minutes
  pointsPerMinute: number;
}

const LeaderboardPage = () => {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/teams');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data. The game might be starting.');
      }
      const data = await response.json();
      const sortedTeams = data.teams.sort((a: TeamSummary, b: TeamSummary) => b.totalScore - a.totalScore);
      setTeams(sortedTeams);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const formatTime = (minutes: number): string => {
    if (minutes < 1) return '< 1m';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTrophyColor = (index: number) => {
    if (index === 0) return 'text-yellow-400';
    if (index === 1) return 'text-slate-400';
    if (index === 2) return 'text-amber-600';
    return 'text-transparent';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-lg">Loading Live Leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
      <header className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-100">Live Leaderboard</h1>
          <p className="text-slate-400 mt-1">Team rankings are updated automatically every 10 seconds.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </header>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button onClick={fetchData} variant="link" className="ml-2 p-0 h-auto text-white">Retry</Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-slate-800/60 border-slate-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800">
                  <TableHead className="w-20 text-center">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="w-48">Progress</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                  <TableHead className="text-right">Efficiency (Pts/Min)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.length > 0 ? (
                  teams.map((team, index) => (
                    <TableRow key={team.id} className="border-slate-800 hover:bg-slate-700/50">
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center font-bold text-lg">
                          <Trophy className={`w-5 h-5 mr-2 ${getTrophyColor(index)}`} />
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-amber-200">{team.name}</TableCell>
                      <TableCell className="text-right font-mono text-lg">{team.totalScore.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={team.progressPercentage} className="h-2 w-full" />
                          <span className="text-xs text-slate-400 font-mono">
                            {team.progressPercentage.toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">{formatTime(team.totalGameTime)}</TableCell>
                      <TableCell className="text-right font-mono text-green-400">
                        {team.pointsPerMinute.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                      No teams have registered yet. The leaderboard will appear once the game starts.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;