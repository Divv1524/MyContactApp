// src/redux/slices/locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: null,
  isTracking: false,
  error: null,
  loading: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
      state.error = null;
    },
    setLocationError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLocationLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLocationTracking: (state, action) => {
      state.isTracking = action.payload;
    },
    clearLocationError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCurrentLocation,
  setLocationError,
  setLocationLoading,
  setLocationTracking,
  clearLocationError,
} = locationSlice.actions;

export default locationSlice.reducer;
