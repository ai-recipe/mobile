import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import dailyLogsReducer from "./slices/dailyLogsSlice";
import dashboardReducer from "./slices/dashboardSlice";
import waterLogsReducer from "./slices/waterLogsSlice";
import exploreListReducer from "./slices/exploreListSlice";
import favoritesListReducer from "./slices/favoritesListSlice";
import multiStepFormReducer from "./slices/multiStepFormSlice";
import recipeListReducer from "./slices/recipeListSlice";
import recipeReducer from "./slices/recipeSlice";
import surveyReducer from "./slices/surveySlice";
import uiReducer from "./slices/uiSlice";
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    recipe: recipeReducer,
    recipeList: recipeListReducer,
    favoritesList: favoritesListReducer,
    exploreList: exploreListReducer,
    app: appReducer,
    survey: surveyReducer,
    multiStepForm: multiStepFormReducer,
    dashboard: dashboardReducer,
    dailyLogs: dailyLogsReducer,
    waterLogs: waterLogsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
