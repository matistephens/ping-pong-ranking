'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/store';
import { useDataRefresh } from '@/lib/hooks/useDataRefresh';

interface MonthlyPlayer {
  name: string;
  wins: number;
  losses: number;
  matches: number;
}

export function MonthlyLeaderboard() {
  const { loading, players: leaderboard, monthLabel } = useAppSelector(state => state.leaderboard.monthly);
  
  // Initialize data refresh hook
  useDataRefresh();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>This Month</CardTitle>
          <CardDescription>Monthly leaderboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const champion = leaderboard[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>This Month ({monthLabel})</CardTitle>
        <CardDescription>Monthly leaderboard (min 4 matches)</CardDescription>
      </CardHeader>
      <CardContent>
        {champion ? (
          <div className="space-y-3">
            <div className="p-3 rounded-md bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">👑 {champion.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {champion.wins}-{champion.losses} ({champion.matches} matches)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {((champion.wins / champion.matches) * 100).toFixed(1)}%
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
            No matches this month yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
