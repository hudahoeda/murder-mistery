'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TeamRegistrationForm } from '@/components/game/TeamRegistrationForm';
import { Users, LogIn } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const RegistrationPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Button asChild variant="outline">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-2xl bg-slate-800/60 border-slate-700">
        <CardHeader className="text-center">
          <div className="mx-auto bg-slate-700 rounded-full p-3 w-fit mb-4">
            <Users className="w-10 h-10 text-amber-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-amber-100">
            Assemble Your Investigation Team
          </CardTitle>
          <CardDescription className="text-slate-400 text-lg mt-2">
            Register your team to begin the investigation. Every second counts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamRegistrationForm />
        </CardContent>
      </Card>
      <div className="mt-6 text-center">
        <p className="text-slate-400">Already have a team?</p>
        <Button asChild variant="link" className="text-amber-400">
          <Link href="/game/login">
             <LogIn className="w-4 h-4 mr-2" />
            Join an existing team session
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RegistrationPage; 