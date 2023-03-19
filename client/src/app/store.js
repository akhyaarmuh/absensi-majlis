import { configureStore } from '@reduxjs/toolkit';

import regionReducer from '../features/region';
import tailwindReducer from '../features/tailwind';
import userReducer from '../features/user';

export const store = configureStore({
  reducer: {
    region: regionReducer,
    tailwind: tailwindReducer,
    user: userReducer,
  },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;
