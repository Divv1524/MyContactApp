// src/redux/slices/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Async Thunk: Sign Up
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const usersData = await AsyncStorage.getItem('registeredUsers');
      const users = usersData ? JSON.parse(usersData) : [];

      const userExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return rejectWithValue('An account with this email already exists');
      }

      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('registeredUsers', JSON.stringify([...users, newUser]));

      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (err) {
      return rejectWithValue(err.message || 'Sign up failed');
    }
  }
);

// Async Thunk: Sign In
export const login = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const usersData = await AsyncStorage.getItem('registeredUsers');
      const users = usersData ? JSON.parse(usersData) : [];

      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!found) return rejectWithValue('No account found with this email');
      if (found.password !== password) return rejectWithValue('Incorrect password');

      const { password: _, ...userWithoutPassword } = found;
      return userWithoutPassword;
    } catch (err) {
      return rejectWithValue(err.message || 'Sign in failed');
    }
  }
);

// Async Thunk: Sign Out
export const logout = createAsyncThunk('auth/signOut', async () => {
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signUp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
