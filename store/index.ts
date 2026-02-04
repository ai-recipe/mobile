import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import multiStepFormReducer from "./slices/multiStepFormSlice";
import recipeReducer from "./slices/recipeSlice";
import surveyReducer from "./slices/surveySlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    recipe: recipeReducer,
    app: appReducer,
    survey: surveyReducer,
    multiStepForm: multiStepFormReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
