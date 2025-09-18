'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';

interface LeaderboardPlayer {
  id: string;
  name: string;
  btRating: number;
  dynamicPoints: number;
  wins: number;
  losses: number;
  prevRank: number | null;
  currentRank: number;
}

interface LeaderboardTableProps {
  title: string;
  description: string;
  players: LeaderboardPlayer[];
  minMatches?: number;
  loading?: boolean;
}

export function LeaderboardTable({
  title,
  description,
  players,
  minMatches = 0,
  loading = false,
}: LeaderboardTableProps) {
  // Filter and sort players
  const qualifiedPlayers = (players || [])
    .filter(p => p && (p.wins + p.losses) >= minMatches)
    .sort((a, b) => {
      // Primary sort by dynamic points
      if ((b?.dynamicPoints ?? 0) !== (a?.dynamicPoints ?? 0)) {
        return (b?.dynamicPoints ?? 0) - (a?.dynamicPoints ?? 0);
      }
      // Secondary sort by BT rating
      return (b?.btRating ?? 0) - (a?.btRating ?? 0);
    });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
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
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Rank</th>
                <th className="text-left py-2">Player</th>
                <th className="text-right py-2">Dynamic Points</th>
                <th className="text-right py-2">BT Rating</th>
                <th className="text-right py-2">W-L</th>
                <th className="text-right py-2">Win%</th>
                <th className="text-right py-2">Prev</th>
                <th className="text-right py-2">Δ</th>
              </tr>
            </thead>
            <tbody>
              {qualifiedPlayers.map((player, index) => {
                const rankChange = player?.prevRank && player?.currentRank
                  ? player.prevRank - player.currentRank 
                  : 0;
                const matches = (player?.wins ?? 0) + (player?.losses ?? 0);
                const winRate = matches > 0 ? ((player?.wins ?? 0) / matches * 100) : 0;

                return (
                  <tr key={player.id} className="border-b last:border-0">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">{player?.name || 'Unknown'}</td>
                    <td className="text-right py-2">{(player?.dynamicPoints ?? 0).toFixed(1)}</td>
                    <td className="text-right py-2">{Math.round(player?.btRating ?? 0)}</td>
                    <td className="text-right py-2">{player?.wins ?? 0}-{player?.losses ?? 0}</td>
                    <td className="text-right py-2">{winRate.toFixed(1)}%</td>
                    <td className="text-right py-2">{player?.prevRank || '-'}</td>
                    <td className="text-right py-2">
                      <div className="flex items-center justify-end">
                        {rankChange > 0 ? (
                          <>
                            <ArrowUpIcon className="w-4 h-4 text-green-500" />
                            <span className="text-green-500">{rankChange}</span>
                          </>
                        ) : rankChange < 0 ? (
                          <>
                            <ArrowDownIcon className="w-4 h-4 text-red-500" />
                            <span className="text-red-500">{Math.abs(rankChange)}</span>
                          </>
                        ) : (
                          <MinusIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {qualifiedPlayers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted-foreground">
                    No qualified players yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
