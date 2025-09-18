import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Player {
  id: string;
  name: string;
  createdAt: string;
  currentRating?: number;
  matchesPlayed?: number;
  wins?: number;
  losses?: number;
}

interface PlayerState {
  players: Player[];
  loading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  players: [],
  loading: false,
  error: null,
};

const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setPlayers, addPlayer, setLoading, setError } = playerSlice.actions;
export default playerSlice.reducer;
