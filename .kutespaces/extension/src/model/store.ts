import { configureStore } from '@reduxjs/toolkit'
import missionReducer from './mission-slice';

export const store = configureStore({
  reducer: {
    mission: missionReducer,
  },
})

export type Store = typeof store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
