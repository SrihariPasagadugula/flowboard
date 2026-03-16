import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import boardsReducer from "../features/boards/store/boardsSlice";
import listsReducer from "../features/lists/store/listsSlice";
import cardsReducer from "../features/cards/store/cardsSlice";
import dashboardReducer from "../features/dashboard/store/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
    lists: listsReducer,
    cards: cardsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
