// src/redux/slices/locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: null,
  isTracking: false,
  error: null,
  loading: false,
  logs: [],
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
    addLocationLog: (state, action) => {
      state.logs.push(action.payload); 
      // payload = { timestamp, latitude, longitude }
    },
    clearLogs: (state) => {
      state.logs = [];
    },
    setLogs: (state, action) => {
      state.logs = action.payload; 
      // replace entire log array
    },
  },
});

export const {
  setCurrentLocation,
  setLocationError,
  setLocationLoading,
  setLocationTracking,
  clearLocationError,
  addLocationLog,
  clearLogs,
  setLogs,
} = locationSlice.actions;

export default locationSlice.reducer;
