import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCardsPerDay,
  fetchDashboardMetrics,
  type CardsPerDay,
  type DashboardMetrics,
} from "../api/dashboardApi";

interface DashboardState {
  metrics: DashboardMetrics | null;
  cardsPerDay: CardsPerDay[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  metrics: null,
  cardsPerDay: [],
  loading: false,
  error: null,
};

export const loadDashboardMetrics = createAsyncThunk(
  "dashboard/loadMetrics",
  async () => {
    return await fetchDashboardMetrics();
  },
);

export const loadCardsPerDay = createAsyncThunk(
  "dashboard/loadCardsPerDay",
  async () => {
    return await fetchCardsPerDay();
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardMetrics.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(loadDashboardMetrics.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load dashboard metrics";
      })
      .addCase(loadCardsPerDay.fulfilled, (state, action) => {
        state.cardsPerDay = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
