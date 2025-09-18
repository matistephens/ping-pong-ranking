'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecentMatches } from '@/lib/actions';
import { format } from 'date-fns';

interface Match {
  id: string;
  playerA: { name: string };
  playerB: { name: string };
  gamesA: number;
  gamesB: number;
  playedAt: string;
}

export function RecentMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentMatches = async () => {
      try {
        const data = await getRecentMatches(10);
        setMatches(data);
      } catch (error) {
        console.error('Error fetching recent matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMatches();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
          <CardDescription>Latest match results</CardDescription>
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
        <CardTitle>Recent Matches</CardTitle>
        <CardDescription>Latest match results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {matches.map((match) => {
            const winner = match.gamesA > match.gamesB ? match.playerA.name : match.playerB.name;
            const isPlayerAWinner = match.gamesA > match.gamesB;
            
            return (
              <div key={match.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {match.playerA.name} vs {match.playerB.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {match.gamesA}-{match.gamesB}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">
                    {format(new Date(match.playedAt), 'MMM d, HH:mm')}
                  </span>
                  <span className={`font-medium ${isPlayerAWinner ? 'text-primary' : 'text-muted-foreground'}`}>
                    {winner}
                  </span>
                </div>
              </div>
            );
          })}
          {matches.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No matches yet. Add a match to get started!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
