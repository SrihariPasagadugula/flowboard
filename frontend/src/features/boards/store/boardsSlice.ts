import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Board, CreateBoardRequest } from "../types/board.types";
import * as boardsApi from "../api/boardsApi";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../shared/types/api";

interface BoardsState {
  boards: Board[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  loading: false,
  error: null,
};

export const fetchBoards = createAsyncThunk<
  Board[],
  void,
  { rejectValue: string }
>("boards/fetchBoards", async (_, { rejectWithValue }) => {
  try {
    return await boardsApi.getBoards();
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch boards",
    );
  }
});

export const createBoardThunk = createAsyncThunk<
  Board,
  CreateBoardRequest,
  { rejectValue: string }
>("boards/createBoard", async (payload, { rejectWithValue }) => {
  try {
    return await boardsApi.createBoard(payload);
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    return rejectWithValue(
      error.response?.data.message || "Failed to create board",
    );
  }
});

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(createBoardThunk.fulfilled, (state, action) => {
        state.boards.push(action.payload);
      });
  },
});

export default boardsSlice.reducer;
