import { createSlice } from '@reduxjs/toolkit';

const initialState = { _id: '', full_name: '', role: '', exp: 0 };

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state._id = action.payload._id;
      state.full_name = action.payload.full_name;
      state.role = action.payload.role;
      state.exp = action.payload.exp;
    },

    setExpiredToken: (state, action) => {
      state.exp = action.payload;
    },

    logout: (state) => {
      state._id = '';
      state.full_name = '';
      state.role = '';
      state.exp = 0;
    },
  },
});

export const { login, setExpiredToken, logout } = userSlice.actions;

export default userSlice.reducer;
