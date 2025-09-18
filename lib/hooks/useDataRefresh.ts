'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setMatches } from '@/store/slices/matchSlice';
import { setPlayers } from '@/store/slices/playerSlice';
import { setWeeklyLeaderboard, setMonthlyLeaderboard } from '@/store/slices/leaderboardSlice';
import { getCurrentRatings, getRecentMatches, getWeeklyLeaderboard, getMonthlyLeaderboard } from '@/lib/actions';
import { getWeekStart, getWeekEnd, getWeekLabel, getMonthLabel } from '@/lib/timezone';

export function useDataRefresh() {
  const dispatch = useAppDispatch();
  const refreshCounter = useAppSelector((state) => state.refresh.counter);

  const refreshData = useCallback(async () => {
    try {
      const now = new Date();
      const weekStart = getWeekStart(now);
      const weekEnd = getWeekEnd(now);
      const weekLabel = getWeekLabel(now);
      const monthLabel = getMonthLabel(now);

      // Fetch all data in parallel
      const [ratings, matches, weeklyData, monthlyData] = await Promise.all([
        getCurrentRatings(),
        getRecentMatches(10),
        getWeeklyLeaderboard(weekStart, weekEnd),
        getMonthlyLeaderboard(now.getFullYear(), now.getMonth() + 1),
      ]);

      // Update Redux store
      dispatch(setPlayers(ratings));
      dispatch(setMatches(matches));
      dispatch(setWeeklyLeaderboard({ players: weeklyData, weekLabel }));
      dispatch(setMonthlyLeaderboard({ players: monthlyData, monthLabel }));
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [dispatch]);

  // Refresh data whenever the refresh counter changes
  useEffect(() => {
    refreshData();
  }, [refreshCounter, refreshData]);

  return { refreshData };
}
