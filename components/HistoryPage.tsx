'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getWeekWinnersHistory, getMonthlyChampionsHistory, getCupsLeaderboard } from '@/lib/actions';

interface WeekWinner {
  week: string;
  winner: string;
  record: string;
  totalPlayers: number;
}

interface MonthlyChampion {
  month: string;
  champion: string;
  record: string;
}

interface CupsLeader {
  name: string;
  cups: number;
}

export function HistoryPage() {
  const [weekWinners, setWeekWinners] = useState<WeekWinner[]>([]);
  const [monthlyChampions, setMonthlyChampions] = useState<MonthlyChampion[]>([]);
  const [cupsLeaders, setCupsLeaders] = useState<CupsLeader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [weeks, months, cups] = await Promise.all([
          getWeekWinnersHistory(),
          getMonthlyChampionsHistory(),
          getCupsLeaderboard(),
        ]);
        
        setWeekWinners(weeks);
        setMonthlyChampions(months);
        setCupsLeaders(cups);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">Loading history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">🏆 History</h1>
          <p className="text-center text-muted-foreground">
            Weekly winners, monthly champions, and cups leaderboard
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Week Winners */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Winners</CardTitle>
              <CardDescription>Historical weekly champions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weekWinners.map((winner, index) => (
                  <div key={winner.week} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{winner.winner}</p>
                        <p className="text-sm text-muted-foreground">{winner.week}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{winner.record}</p>
                      <p>{winner.totalPlayers} players</p>
                    </div>
                  </div>
                ))}
                {weekWinners.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No weekly winners yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Champions */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Champions</CardTitle>
              <CardDescription>Historical monthly champions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {monthlyChampions.map((champion, index) => (
                  <div key={champion.month} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{champion.champion}</p>
                        <p className="text-sm text-muted-foreground">{champion.month}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{champion.record}</p>
                    </div>
                  </div>
                ))}
                {monthlyChampions.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No monthly champions yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cups Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Cups Leaderboard</CardTitle>
              <CardDescription>Total monthly championships won</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cupsLeaders.map((leader, index) => (
                  <div key={leader.name} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <span className="font-medium">{leader.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg">🏆</span>
                      <span className="font-medium">{leader.cups}</span>
                    </div>
                  </div>
                ))}
                {cupsLeaders.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No cups won yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
