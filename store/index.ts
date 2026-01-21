import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import authReducer from "./slices/authSlice";
import recipeReducer from "./slices/recipeSlice";
import appReducer from "./slices/appSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    recipe: recipeReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
