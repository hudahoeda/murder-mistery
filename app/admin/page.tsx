'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Activity, 
  RefreshCw, 
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Timer,
  Target,
  Trash2
} from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

interface TeamSummary {
  id: string;
  name: string;
  members: string[];
  isActive: boolean;
  gameStartTime: Date;
  currentPuzzle: number;
  currentPuzzleTitle: string;
  currentStepsCompleted: number;
  currentTotalSteps: number;
  completedPuzzles: number;
  totalPuzzles: number;
  progressPercentage: number;
  discoveredClues: number;
  totalScore: number;
  totalGameTime: number;
  lastActivity: number;
}

interface AdminSummary {
  totalTeams: number;
  activeTeams: number;
  averageProgress: number;
  totalScore: number;
  averageGameTime: number;
}

interface AdminData {
  teams: TeamSummary[];
  summary: AdminSummary;
}

const AdminDashboard = () => {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/teams');
      if (!response.ok) {
        throw new Error('Failed to fetch admin data');
      }
      const adminData: AdminData = await response.json();
      setData(adminData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/reset', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reset game state');
      }

      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred on reset');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = (team: TeamSummary): string => {
    if (!team.isActive) return 'bg-gray-500';
    if (team.progressPercentage === 100) return 'bg-green-500';
    if (team.progressPercentage > 50) return 'bg-blue-500';
    if (team.progressPercentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLastActivityTime = (timestamp: number): string => {
    const minutes = Math.floor((Date.now() - timestamp) / 1000 / 60);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const exportData = () => {
    if (!data) return;
    
    const csvContent = [
      ['Team Name', 'Members', 'Progress %', 'Current Puzzle', 'Score', 'Game Time', 'Status'],
      ...data.teams.map(team => [
        team.name,
        team.members.join('; '),
        team.progressPercentage.toFixed(1),
        team.currentPuzzleTitle,
        team.totalScore.toString(),
        formatTime(team.totalGameTime),
        team.isActive ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `murder-mystery-admin-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <Alert className="bg-red-500/20 border-red-500 text-red-100">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchData} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 text-center">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-amber-100">Murder Mystery Admin Dashboard</h1>
          <p className="text-slate-400">Real-time team monitoring and analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
          >
            <Activity className="w-4 h-4 mr-2" />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset Game
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-700">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-amber-100">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                        This action cannot be undone. This will permanently delete all team data, progress, and scores from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={handleResetGame}>Continue</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalTeams}</div>
            <p className="text-xs text-muted-foreground">
              {data.summary.activeTeams} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.averageProgress.toFixed(1)}%</div>
            <Progress value={data.summary.averageProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalScore.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Combined score
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Game Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(data.summary.averageGameTime)}</div>
            <p className="text-xs text-muted-foreground">
              Per team
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{data.summary.activeTeams}</div>
            <p className="text-xs text-muted-foreground">
              Currently playing
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-slate-800/60 border-slate-700">
            <CardHeader>
              <CardTitle>Team Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Current Puzzle</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Game Time</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>{team.members.length} members</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{team.currentPuzzleTitle}</div>
                          <div className="text-sm text-slate-400">
                            Step {team.currentStepsCompleted}/{team.currentTotalSteps}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{team.completedPuzzles}/{team.totalPuzzles} puzzles</span>
                            <span>{team.progressPercentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={team.progressPercentage} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{formatTime(team.totalGameTime)}</TableCell>
                      <TableCell>{getLastActivityTime(team.lastActivity)}</TableCell>
                      <TableCell>
                        <Badge 
                          className={`${getStatusColor(team)} text-white`}
                          variant="secondary"
                        >
                          {team.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTeam(team.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="bg-slate-800/60 border-slate-700">
            <CardHeader>
              <CardTitle>Team Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Efficiency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.teams
                    .sort((a, b) => b.totalScore - a.totalScore)
                    .map((team, index) => (
                      <TableRow key={team.id}>
                        <TableCell>
                          <div className="flex items-center">
                            {index < 3 && (
                              <Trophy className={`w-4 h-4 mr-2 ${
                                index === 0 ? 'text-yellow-500' : 
                                index === 1 ? 'text-gray-400' : 'text-amber-600'
                              }`} />
                            )}
                            #{index + 1}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{team.name}</TableCell>
                        <TableCell>{team.totalScore.toLocaleString()}</TableCell>
                        <TableCell>{team.progressPercentage.toFixed(1)}%</TableCell>
                        <TableCell>{formatTime(team.totalGameTime)}</TableCell>
                        <TableCell>
                          {team.totalGameTime > 0 ? 
                            (team.totalScore / team.totalGameTime).toFixed(1) : '0'} pts/min
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle>Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[0, 25, 50, 75, 100].map(threshold => {
                    const count = data.teams.filter(t => t.progressPercentage >= threshold).length;
                    const percentage = data.teams.length > 0 ? (count / data.teams.length) * 100 : 0;
                    return (
                      <div key={threshold} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{threshold}%+ Complete</span>
                          <span>{count} teams ({percentage.toFixed(0)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {data.teams.filter(t => t.progressPercentage === 100).length}
                    </div>
                    <div className="text-sm text-slate-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {data.teams.filter(t => t.progressPercentage > 0 && t.progressPercentage < 100).length}
                    </div>
                    <div className="text-sm text-slate-400">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {data.teams.length > 0 ? 
                        (data.teams.reduce((acc, t) => acc + t.discoveredClues, 0) / data.teams.length).toFixed(1) : '0'}
                    </div>
                    <div className="text-sm text-slate-400">Avg Clues</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {data.teams.length > 0 ? 
                        (data.teams.reduce((acc, t) => acc + t.members.length, 0) / data.teams.length).toFixed(1) : '0'}
                    </div>
                    <div className="text-sm text-slate-400">Avg Team Size</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 