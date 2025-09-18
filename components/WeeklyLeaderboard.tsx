'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getWeeklyLeaderboard } from '@/lib/actions';
import { getWeekStart, getWeekEnd, getWeekLabel } from '@/lib/timezone';

interface WeeklyPlayer {
  name: string;
  wins: number;
  losses: number;
  matches: number;
}

export function WeeklyLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<WeeklyPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekLabel, setWeekLabel] = useState('');

  useEffect(() => {
    const fetchWeeklyLeaderboard = async () => {
      try {
        const now = new Date();
        const weekStart = getWeekStart(now);
        const weekEnd = getWeekEnd(now);
        const week = getWeekLabel(now);
        
        setWeekLabel(week);
        const data = await getWeeklyLeaderboard(weekStart, weekEnd);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching weekly leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyLeaderboard();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>This Week</CardTitle>
          <CardDescription>Weekly leaderboard (min 2 matches)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const winner = leaderboard[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>This Week ({weekLabel})</CardTitle>
        <CardDescription>Weekly leaderboard (min 2 matches)</CardDescription>
      </CardHeader>
      <CardContent>
        {winner ? (
          <div className="space-y-3">
            <div className="p-3 rounded-md bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">🏆 {winner.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {winner.wins}-{winner.losses} ({winner.matches} matches)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {((winner.wins / winner.matches) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            
            {leaderboard.slice(1).length > 0 && (
              <div className="space-y-1">
                {leaderboard.slice(1).map((player, index) => (
                  <div key={player.name} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 2}</span>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <span>{player.wins}-{player.losses}</span>
                      <span>{((player.wins / player.matches) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No matches this week yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
