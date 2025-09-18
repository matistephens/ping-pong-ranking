import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface LeaderboardState {
  weekly: {
    players: LeaderboardPlayer[];
    loading: boolean;
    error: string | null;
    weekLabel: string;
  };
  monthly: {
    players: LeaderboardPlayer[];
    loading: boolean;
    error: string | null;
    monthLabel: string;
  };
}

const initialState: LeaderboardState = {
  weekly: {
    players: [],
    loading: false,
    error: null,
    weekLabel: '',
  },
  monthly: {
    players: [],
    loading: false,
    error: null,
    monthLabel: '',
  },
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setWeeklyLeaderboard: (state, action: PayloadAction<{ players: LeaderboardPlayer[]; weekLabel: string }>) => {
      state.weekly.players = action.payload.players;
      state.weekly.weekLabel = action.payload.weekLabel;
    },
    setMonthlyLeaderboard: (state, action: PayloadAction<{ players: LeaderboardPlayer[]; monthLabel: string }>) => {
      state.monthly.players = action.payload.players;
      state.monthly.monthLabel = action.payload.monthLabel;
    },
    setWeeklyLoading: (state, action: PayloadAction<boolean>) => {
      state.weekly.loading = action.payload;
    },
    setMonthlyLoading: (state, action: PayloadAction<boolean>) => {
      state.monthly.loading = action.payload;
    },
    setWeeklyError: (state, action: PayloadAction<string | null>) => {
      state.weekly.error = action.payload;
    },
    setMonthlyError: (state, action: PayloadAction<string | null>) => {
      state.monthly.error = action.payload;
    },
  },
});

export const {
  setWeeklyLeaderboard,
  setMonthlyLeaderboard,
  setWeeklyLoading,
  setMonthlyLoading,
  setWeeklyError,
  setMonthlyError,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
