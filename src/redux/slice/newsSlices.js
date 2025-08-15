import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  articles: [],
  loading: false,
  error: null,
  page: 1,
  pageSize:10,
  hasMore: true,
  fromDate: '',
  toDate: '',
};

// Create slice
const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    // Triggered to fetch news
    fetchNewsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    // On success, append new articles
    fetchNewsSuccess: (state, action) => {
      const { articles, hasMore } = action.payload;

      // Append if not first page, else replace
      state.articles = state.page === 1 ? articles : [...state.articles, ...articles];
      state.hasMore = hasMore;
      state.loading = false;
    },

    // On failure
    fetchNewsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Load next page (pagination)
    loadMoreNews: (state) => {
      if (state.hasMore) {
        state.page += 1;
      }
    },

    // Reset everything
    resetNews: (state) => {
      state.articles = [];
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },

    // Set date filter values
    setDateFilter: (state, action) => {
      state.fromDate = action.payload.fromDate;
      state.toDate = action.payload.toDate;
      state.page = 1; // Reset page on filter change
    },
  },
});

export const {
  fetchNewsRequest,
  fetchNewsSuccess,
  fetchNewsFailure,
  resetNews,
  setDateFilter,
  loadMoreNews,
} = newsSlice.actions;

export default newsSlice.reducer;
