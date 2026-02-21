/**
 * {
  "success": true,
  "data": {
    "id": "c2f53d25-c7f4-416d-89b2-39a97a96a4b2",
    "userId": "e7fd42d2-bee4-4455-ac35-64a6cf753e37",
    "effectiveFrom": "2026-02-19T12:55:51.924+00:00",
    "effectiveTo": null,
    "targetWeightKg": null,
    "targetCalories": 2718,
    "targetProteinG": 151,
    "targetCarbsG": 389,
    "targetFatG": 62,
    "targetWaterMl": 4350,
    "metadata": {
      "source": "survey",
      "calorieGoal": "maintain",
      "activityLevel": "moderately_active",
      "goalIntensity": "standard"
    },
    "createdAt": "2026-02-19T12:55:51.925+00:00"
  },
  "statusCode": 200,
  "timestamp": "2026-02-19T16:45:17.248+00:00"
}

 */

import {
  getGoalPlanActiveAPI,
  GoalPlan,
  postGoalPlanLog,
} from "@/api/goalPlan";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchRecentMealsAsync } from "./dailyLogsSlice";
import { setTargetWeightKgProgressSlice } from "./progressSlice";

interface GoalPlanState {
  goalPlan: GoalPlan | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GoalPlanState = {
  goalPlan: null,
  isLoading: false,
  error: null,
};

export const fetchGoalPlanActiveAsync = createAsyncThunk(
  "goalPlans/fetchGoalPlanActive",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getGoalPlanActiveAPI();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Goal plan yüklenemedi",
      );
    }
  },
);
/**
 *  "targetWeightKg": 70,
  "targetCalories": 2200,
  "targetProteinG": 150,
  "targetCarbsG": 250,
  "targetFatG": 70,
  "targetWaterMl": 2500,
 */
export const postGoalPlanLogAsync = createAsyncThunk(
  "goalPlans/postGoalPlanLog",
  async (
    payload: {
      from: "progress" | "profile";
      targetWeightKg?: number;
      targetCalories?: number;
      targetProteinG?: number;
      targetCarbsG?: number;
      targetFatG?: number;
      targetWaterMl?: number;
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const { from, ...rest } = payload;
      if (from === "progress") {
        dispatch(setTargetWeightKgProgressSlice(rest.targetWeightKg));
      } else if (from === "profile") {
        dispatch(setGoalPlan(rest));
        dispatch(fetchRecentMealsAsync() as any);
      }

      const response = await postGoalPlanLog(rest);

      return response.data;
    } catch (error: any) {
      console.log("error", JSON.stringify(error?.response?.data, null, 2));
      return rejectWithValue(
        error.response?.data?.message || "Goal plan log not saved",
      );
    }
  },
);

const goalPlansSlice = createSlice({
  name: "goalPlans",
  initialState,
  reducers: {
    setGoalPlan: (state, action) => {
      state.goalPlan = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGoalPlanActiveAsync.fulfilled, (state, action) => {
      state.goalPlan = action.payload;
    });
  },
});

export default goalPlansSlice.reducer;
export const { setGoalPlan } = goalPlansSlice.actions;
