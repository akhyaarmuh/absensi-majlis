import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openSidenav: false,
};

export const tailwindSlice = createSlice({
  name: 'tailwind',
  initialState,
  reducers: {
    toggleSidenav: (state) => {
      state.openSidenav = !state.openSidenav;
    },
  },
});

export const { toggleSidenav } = tailwindSlice.actions;

export default tailwindSlice.reducer;
