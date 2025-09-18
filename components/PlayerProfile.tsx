'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

interface PlayerData {
  id: string;
  name: string;
  currentRating: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  ratingHistory: Array<{
    value: number;
    atTime: string;
  }>;
  recentMatches: Array<{
    id: string;
    opponent: string;
    gamesWon: number;
    gamesLost: number;
    playedAt: string;
    won: boolean;
  }>;
}

interface PlayerProfileProps {
  playerId: string;
}

export function PlayerProfile({ playerId }: PlayerProfileProps) {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // This would need to be implemented as a server action
        // For now, we'll show a placeholder
        setPlayer({
          id: playerId,
          name: 'Player Name',
          currentRating: 1000,
          matchesPlayed: 0,
          wins: 0,
          losses: 0,
          ratingHistory: [],
          recentMatches: [],
        });
      } catch (error) {
        console.error('Error fetching player data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">Loading player profile...</div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">Player not found</div>
        </div>
      </div>
    );
  }

  const winRate = player.matchesPlayed > 0 ? (player.wins / player.matchesPlayed) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">👤 {player.name}</h1>
          <p className="text-center text-muted-foreground">
            Player profile and statistics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Player Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Current performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-md bg-muted/50">
                    <p className="text-2xl font-bold text-primary">{player.currentRating}</p>
                    <p className="text-sm text-muted-foreground">Current Rating</p>
                  </div>
                  <div className="text-center p-4 rounded-md bg-muted/50">
                    <p className="text-2xl font-bold">{player.matchesPlayed}</p>
                    <p className="text-sm text-muted-foreground">Matches Played</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-md bg-muted/50">
                    <p className="text-2xl font-bold text-green-600">{player.wins}</p>
                    <p className="text-sm text-muted-foreground">Wins</p>
                  </div>
                  <div className="text-center p-4 rounded-md bg-muted/50">
                    <p className="text-2xl font-bold text-red-600">{player.losses}</p>
                    <p className="text-sm text-muted-foreground">Losses</p>
                  </div>
                </div>

                <div className="text-center p-4 rounded-md bg-primary/10">
                  <p className="text-2xl font-bold">{winRate.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating History */}
          <Card>
            <CardHeader>
              <CardTitle>Rating History</CardTitle>
              <CardDescription>Elo rating progression over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {player.ratingHistory.length > 0 ? (
                  player.ratingHistory.slice(0, 10).map((rating, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <div>
                        <p className="font-medium">{rating.value}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(rating.atTime), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {index > 0 && (
                          <span className={rating.value > player.ratingHistory[index - 1].value ? 'text-green-600' : 'text-red-600'}>
                            {rating.value > player.ratingHistory[index - 1].value ? '+' : ''}
                            {rating.value - player.ratingHistory[index - 1].value}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No rating history available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Matches */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Matches</CardTitle>
              <CardDescription>Latest match results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {player.recentMatches.length > 0 ? (
                  player.recentMatches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${match.won ? 'text-green-600' : 'text-red-600'}`}>
                          {match.won ? 'W' : 'L'}
                        </span>
                        <span className="font-medium">vs {match.opponent}</span>
                        <span className="text-sm text-muted-foreground">
                          {match.gamesWon}-{match.gamesLost}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(match.playedAt), 'MMM d, HH:mm')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No recent matches
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
