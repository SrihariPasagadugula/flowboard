import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardMetrics,
  type DashboardMetrics,
} from "../api/dashboardApi";

interface DashboardState {
  metrics: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  metrics: null,
  loading: false,
  error: null,
};

export const loadDashboardMetrics = createAsyncThunk(
  "dashboard/loadMetrics",
  async () => {
    return await fetchDashboardMetrics();
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
      });
  },
});

export default dashboardSlice.reducer;
