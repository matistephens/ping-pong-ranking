'use client';

import { useEffect, useState } from 'react';
import { getWeekStart, getWeekEnd, getWeekLabel } from '@/lib/timezone';
import { getWeeklyLeaderboard } from '@/lib/actions';
import { LeaderboardTable } from './LeaderboardTable';
import { useAppSelector } from '@/store';

interface PlayerStats {
  id: string;
  name: string;
  wins: number;
  losses: number;
  matches: number;
  btRating: number;
  dynamicPoints: number;
  prevRank: number | null;
  currentRank: number;
}

export function WeeklyLeaderboard() {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [weekLabel, setWeekLabel] = useState('');
  const refreshCounter = useAppSelector((state) => state.refresh.counter);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Weekly leaderboard refresh triggered, counter:', refreshCounter);
      setLoading(true);
      try {
        const now = new Date();
        const weekStart = getWeekStart(now);
        const weekEnd = getWeekEnd(now);
        const label = getWeekLabel(now);
        
        console.log('Fetching weekly leaderboard from', weekStart.toISOString(), 'to', weekEnd.toISOString());
        
        const data = await getWeeklyLeaderboard(weekStart, weekEnd);
        console.log('Weekly leaderboard data:', data);
        
        setPlayers(data);
        setWeekLabel(label);
      } catch (error) {
        console.error('Error fetching weekly leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshCounter]);

  return (
    <LeaderboardTable
      title={`This Week (${weekLabel})`}
      description="Weekly leaderboard"
      players={players}
      minMatches={0}
      loading={loading}
    />
  );
}