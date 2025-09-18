import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import matchSlice from './slices/matchSlice';
import playerSlice from './slices/playerSlice';
import refreshSlice from './slices/refreshSlice';
import leaderboardSlice from './slices/leaderboardSlice';

export const store = configureStore({
  reducer: {
    matches: matchSlice,
    players: playerSlice,
    refresh: refreshSlice,
    leaderboard: leaderboardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
