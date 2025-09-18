'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/store';
import { useDataRefresh } from '@/lib/hooks/useDataRefresh';

interface Rating {
  id: string;
  name: string;
  currentRating: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
}

export function CurrentRatings() {
  const { loading } = useAppSelector(state => state.players);
  const players = useAppSelector(state => state.players.players);
  
  // Initialize data refresh hook
  useDataRefresh();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Ratings</CardTitle>
          <CardDescription>Elo-based player rankings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Ratings</CardTitle>
        <CardDescription>Elo-based player rankings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {players.slice(0, 20).map((player, index) => (
            <div key={player.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                <span className="font-medium">{player.name}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{player.currentRating}</span>
                <span>{player.matchesPlayed} matches</span>
                <span>{player.wins}-{player.losses}</span>
              </div>
            </div>
          ))}
          {players.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No players yet. Add a match to get started!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
