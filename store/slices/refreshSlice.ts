import { createSlice } from '@reduxjs/toolkit';

interface RefreshState {
  counter: number;
}

const initialState: RefreshState = {
  counter: 0,
};

const refreshSlice = createSlice({
  name: 'refresh',
  initialState,
  reducers: {
    triggerRefresh: (state) => {
      state.counter += 1;
    },
  },
});

export const { triggerRefresh } = refreshSlice.actions;
export default refreshSlice.reducer;
