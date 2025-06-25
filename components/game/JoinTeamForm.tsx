'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn } from 'lucide-react';
import { setActiveTeam } from '@/lib/utils/gameUtils';

export const JoinTeamForm = () => {
  const router = useRouter();
  const [teamId, setTeamId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId.trim()) {
      setError('Please enter a Team ID.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if team exists by fetching it
      const response = await fetch(`/api/team/${teamId.trim()}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No team found with that ID. Please check and try again.');
        }
        throw new Error('Failed to connect to the server. Please try again later.');
      }

      // If team exists, set it as active and redirect
      setActiveTeam(teamId.trim());
      router.push('/game');
      
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="teamId" className="text-slate-300">
          Team ID
        </Label>
        <Input
          id="teamId"
          type="text"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          placeholder="Enter the ID provided by your team leader"
          className="bg-slate-900 border-slate-600"
          required
        />
        <p className="text-xs text-slate-500">
          Your unique Team ID is used to access your saved game session.
        </p>
      </div>
      <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Join Game Session
          </>
        )}
      </Button>
    </form>
  );
}; 