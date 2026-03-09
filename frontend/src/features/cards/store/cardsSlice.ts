import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Card } from "../types/card.types";
import * as cardsApi from "../api/cardsApi";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../shared/types/api";

interface CardsState {
  cards: Record<number, Card[]>;
  loading: boolean;
  error: string | null;
}

const initialState: CardsState = {
  cards: {},
  loading: false,
  error: null,
};

export const fetchCards = createAsyncThunk<
  { listId: number; cards: Card[] },
  number,
  { rejectValue: string }
>("cards/fetchCards", async (listId, { rejectWithValue }) => {
  try {
    const data = await cardsApi.getCardsByList(listId);
    return { listId, cards: data };
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    return rejectWithValue(
      error.response?.data.message || "Failed to fetch cards",
    );
  }
});

export const createCardThunk = createAsyncThunk<
  { listId: number; card: Card },
  { listId: number; title: string; description?: string },
  { rejectValue: string }
>(
  "cards/createCard",
  async ({ listId, title, description }, { rejectWithValue }) => {
    try {
      const card = await cardsApi.createCard(listId, {
        title,
        description,
      });

      return { listId, card };
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      return rejectWithValue(
        error.response?.data.message || "Failed to create card",
      );
    }
  },
);

export const moveCardThunk = createAsyncThunk<
  void,
  {
    cardId: number;
    sourceListId: number;
    destinationListId: number;
    newPosition: number;
  },
  { rejectValue: string }
>("cards/moveCard", async (payload, { rejectWithValue }) => {
  try {
    await cardsApi.moveCard(payload.cardId, {
      sourceListId: payload.sourceListId,
      destinationListId: payload.destinationListId,
      newPosition: payload.newPosition,
    });
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    return rejectWithValue(
      error.response?.data.message || "Failed to move card",
    );
  }
});

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    clearCards: (state) => {
      state.cards = {};
    },
    reorderCardsInList: (
      state,
      action: {
        payload: {
          listId: number;
          fromIndex: number;
          toIndex: number;
        };
      },
    ) => {
      const { listId, fromIndex, toIndex } = action.payload;

      const listCards = state.cards[listId];
      if (!listCards) return;

      const [moved] = listCards.splice(fromIndex, 1);
      listCards.splice(toIndex, 0, moved);
    },
    moveCardBetweenLists: (
      state,
      action: {
        payload: {
          sourceListId: number;
          destinationListId: number;
          fromIndex: number;
          toIndex: number;
        };
      },
    ) => {
      const { sourceListId, destinationListId, fromIndex, toIndex } =
        action.payload;

      const sourceCards = state.cards[sourceListId];
      const destinationCards = state.cards[destinationListId];

      if (!sourceCards || !destinationCards) return;

      const [moved] = sourceCards.splice(fromIndex, 1);

      destinationCards.splice(toIndex, 0, moved);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.cards[action.payload.listId] = action.payload.cards;
      })
      .addCase(createCardThunk.fulfilled, (state, action) => {
        const { listId, card } = action.payload;

        if (!state.cards[listId]) {
          state.cards[listId] = [];
        }

        state.cards[listId].push(card);
      });
  },
});

export const { clearCards, reorderCardsInList, moveCardBetweenLists } =
  cardsSlice.actions;
export default cardsSlice.reducer;
