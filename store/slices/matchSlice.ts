import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Match {
  id: string;
  playerAId: string;
  playerBId: string;
  gamesA: number;
  gamesB: number;
  playedAt: string;
  createdAt: string;
  playerA: {
    id: string;
    name: string;
  };
  playerB: {
    id: string;
    name: string;
  };
}

interface MatchState {
  matches: Match[];
  loading: boolean;
  error: string | null;
}

const initialState: MatchState = {
  matches: [],
  loading: false,
  error: null,
};

const matchSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<Match[]>) => {
      state.matches = action.payload;
    },
    addMatch: (state, action: PayloadAction<Match>) => {
      state.matches.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMatches, addMatch, setLoading, setError } = matchSlice.actions;
export default matchSlice.reducer;
