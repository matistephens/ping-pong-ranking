'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createMatch } from '@/lib/actions';
import { useToast } from '@/components/ui/use-toast';
import { PlayerSelector } from '@/components/PlayerSelector';
import { useAppDispatch } from '@/store';
import { triggerRefresh } from '@/store/slices/refreshSlice';

const matchSchema = z.object({
  playerAId: z.string().min(1, 'Player A is required'),
  playerBId: z.string().min(1, 'Player B is required'),
  gamesA: z.number().min(0, 'Games must be non-negative'),
  gamesB: z.number().min(0, 'Games must be non-negative'),
  playedAt: z.string(),
}).refine((data) => data.gamesA !== data.gamesB, {
  message: 'Games cannot be equal (no ties allowed)',
  path: ['gamesA'],
}).refine((data) => data.playerAId !== data.playerBId, {
  message: 'Players must be different',
  path: ['playerBId'],
});

type MatchFormData = z.infer<typeof matchSchema>;

export function AddMatchForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MatchFormData>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      playedAt: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = async (data: MatchFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createMatch({
        ...data,
        playedAt: new Date(data.playedAt),
      });

      if (result.success) {
        toast({
          title: 'Match added successfully!',
          description: `Match recorded - ${data.gamesA}-${data.gamesB}`,
        });
        reset();
        // Trigger a refresh of all components
        dispatch(triggerRefresh());
      } else {
        toast({
          title: 'Error adding match',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error adding match',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Match</CardTitle>
        <CardDescription>
          Record a new ping-pong match result
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <PlayerSelector
              label="Player A"
              value={watch('playerAId')}
              onChange={(playerId) => setValue('playerAId', playerId)}
              excludePlayerId={watch('playerBId')}
            />
            {errors.playerAId && (
              <p className="text-sm text-destructive">{errors.playerAId.message}</p>
            )}
            
            <PlayerSelector
              label="Player B"
              value={watch('playerBId')}
              onChange={(playerId) => setValue('playerBId', playerId)}
              excludePlayerId={watch('playerAId')}
            />
            {errors.playerBId && (
              <p className="text-sm text-destructive">{errors.playerBId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gamesA">Games won by A</Label>
              <Input
                id="gamesA"
                type="number"
                min="0"
                {...register('gamesA', { valueAsNumber: true })}
              />
              {errors.gamesA && (
                <p className="text-sm text-destructive">{errors.gamesA.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gamesB">Games won by B</Label>
              <Input
                id="gamesB"
                type="number"
                min="0"
                {...register('gamesB', { valueAsNumber: true })}
              />
              {errors.gamesB && (
                <p className="text-sm text-destructive">{errors.gamesB.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="playedAt">Played At</Label>
            <Input
              id="playedAt"
              type="datetime-local"
              {...register('playedAt')}
            />
            {errors.playedAt && (
              <p className="text-sm text-destructive">{errors.playedAt.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Adding Match...' : 'Add Match'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
