import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import dailyLogsReducer from "./slices/dailyLogsSlice";
import exploreListReducer from "./slices/exploreListSlice";
import favoritesListReducer from "./slices/favoritesListSlice";
import goalPlansReducer from "./slices/goalPlansSlice";
import modalReducer from "./slices/modalSlice";
import multiStepFormReducer from "./slices/multiStepFormSlice";
import progressReducer from "./slices/progressSlice";
import recipeListReducer from "./slices/recipeListSlice";
import recipeReducer from "./slices/recipeSlice";
import uiReducer from "./slices/uiSlice";
import userReducer from "./slices/userSlice";
import waterLogsReducer from "./slices/waterLogsSlice";
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    recipe: recipeReducer,
    recipeList: recipeListReducer,
    favoritesList: favoritesListReducer,
    exploreList: exploreListReducer,
    modal: modalReducer,
    app: appReducer,
    multiStepForm: multiStepFormReducer,
    dailyLogs: dailyLogsReducer,
    waterLogs: waterLogsReducer,
    progress: progressReducer,
    user: userReducer,
    goalPlans: goalPlansReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
