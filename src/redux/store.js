import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import songReducer from "./song.slice"

const store = configureStore({
  reducer: {
    profile: profileReducer,
    song:songReducer
  },
});

export default store;
