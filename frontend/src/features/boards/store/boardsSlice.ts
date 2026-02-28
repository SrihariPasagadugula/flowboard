import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Board, CreateBoardRequest } from "../types/board.types";
import * as boardsApi from "../api/boardsApi";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../shared/types/api";

interface BoardsState {
  boards: Board[];
  selectedBoard: Board | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  selectedBoard: null,
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

export const fetchBoardById = createAsyncThunk<
  Board,
  number,
  { rejectValue: string }
>("boards/fetchBoardById", async (id, { rejectWithValue }) => {
  try {
    return await boardsApi.getBoardById(id);
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    return rejectWithValue(
      error.response?.data.message || "Failed to fetch board",
    );
  }
});

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    clearSelectedBoard: (state) => {
      state.selectedBoard = null;
    },
  },
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
      })
      .addCase(fetchBoardById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBoard = action.payload;
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearSelectedBoard } = boardsSlice.actions;
export default boardsSlice.reducer;
