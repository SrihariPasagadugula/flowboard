import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { LoginRequest } from "./authApi";
import * as authApi from "./authApi";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../shared/types/api";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk<
  string,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.login(data);
    return response.token;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;

    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        localStorage.setItem("token", action.payload);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
