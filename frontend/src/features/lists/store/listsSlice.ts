import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { List } from "../types/list.types";
import * as listsApi from "../api/listsApi";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../shared/types/api";

interface ListsState {
  lists: List[];
  loading: boolean;
  error: string | null;
}

const initialState: ListsState = {
  lists: [],
  loading: false,
  error: null,
};

export const fetchLists = createAsyncThunk<
  List[],
  number,
  { rejectValue: string }
>("lists/fetchLists", async (boardId, { rejectWithValue }) => {
  try {
    return await listsApi.getListsByBoard(boardId);
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    return rejectWithValue(
      error.response?.data.message || "Failed to fetch lists",
    );
  }
});

export const createListThunk = createAsyncThunk<
  List,
  { boardId: number; title: string },
  { rejectValue: string }
>("lists/createList", async ({ boardId, title }, { rejectWithValue }) => {
  try {
    return await listsApi.createList(boardId, { title });
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    return rejectWithValue(
      error.response?.data.message || "Failed to create list",
    );
  }
});

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    clearLists: (state) => {
      state.lists = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(createListThunk.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      });
  },
});

export const { clearLists } = listsSlice.actions;
export default listsSlice.reducer;
