import { createSlice } from '@reduxjs/toolkit';

const initialState = { data: [] };

export const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    setRegion: (state, action) => {
      state.data = action.payload;
    },

    deleteRegion: (state, action) => {
      state.data = state.data.filter((region) => region.value !== action.payload);
    },
  },
});

export const { setRegion, deleteRegion } = regionSlice.actions;

export default regionSlice.reducer;
