'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2, User, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { setActiveTeam } from '@/lib/utils/gameUtils';

const teamRegistrationSchema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters').max(50, 'Team name cannot exceed 50 characters'),
  members: z.array(z.object({ name: z.string().min(2, 'Member name must be at least 2 characters') })).min(1, 'You must add at least one team member').max(4, 'You can add a maximum of 4 members'),
});

type TeamRegistrationFormValues = z.infer<typeof teamRegistrationSchema>;

export const TeamRegistrationForm = () => {
  const router = useRouter();
  const form = useForm<TeamRegistrationFormValues>({
    resolver: zodResolver(teamRegistrationSchema),
    defaultValues: {
      teamName: '',
      members: [{ name: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'members',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: TeamRegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/team/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName: data.teamName,
          members: data.members.map(m => m.name),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register team');
      }

      const newTeam = await response.json();
      
      // We still use local storage on the client to remember the *active* team ID
      setActiveTeam(newTeam.id);

      console.log('Team registered successfully:', newTeam);
      router.push('/game');

    } catch (error) {
      console.error(error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-slate-300 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Team Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., The Shadow Detectives" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label className="text-lg text-slate-300 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Investigation Team Members
            </Label>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`members.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input placeholder={`Detective #${index + 1}`} {...field} />
                          {fields.length > 1 && (
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
             {form.formState.errors.members && !form.formState.errors.members.root && (
               <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.members.message}</p>
             )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => append({ name: '' })} disabled={fields.length >= 4 || isSubmitting}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Member
          </Button>
          <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Start Investigation'}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}; 