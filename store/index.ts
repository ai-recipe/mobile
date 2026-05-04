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
import scanMealReducer from "./slices/scanMealSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import uiReducer from "./slices/uiSlice";
import userReducer from "./slices/userSlice";
import waterLogsReducer from "./slices/waterLogsSlice";
import gamificationReducer from "./slices/gamificationSlice";
import badgesReducer from "./slices/badgesSlice";
import coachReducer from "./slices/coachSlice";

import { injectDispatch } from "@/api/axios";
import { analyticsListenerMiddleware } from "./middleware/analyticsMiddleware";

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
    scanMeal: scanMealReducer,
    subscription: subscriptionReducer,
    gamification: gamificationReducer,
    badges: badgesReducer,
    coach: coachReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(analyticsListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
injectDispatch(store.dispatch);
