'use client';

import { useEffect, useState } from 'react';
import { getMonthLabel } from '@/lib/timezone';
import { getMonthlyLeaderboard } from '@/lib/actions';
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

export function MonthlyLeaderboard() {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [monthLabel, setMonthLabel] = useState('');
  const refreshCounter = useAppSelector((state) => state.refresh.counter);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Monthly leaderboard refresh triggered, counter:', refreshCounter);
      setLoading(true);
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const label = getMonthLabel(now);
        
        console.log('Fetching monthly leaderboard for', year, month);
        
        const data = await getMonthlyLeaderboard(year, month);
        console.log('Monthly leaderboard data:', data);
        
        setPlayers(data);
        setMonthLabel(label);
      } catch (error) {
        console.error('Error fetching monthly leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshCounter]);

  return (
    <LeaderboardTable
      title={`This Month (${monthLabel})`}
      description="Monthly leaderboard"
      players={players}
      minMatches={0}
      loading={loading}
    />
  );
}