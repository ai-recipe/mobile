import { fetchProgressData, postWeightLog, ProgressData } from "@/api/progress";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

interface ProgressDataState {
  startDate: string;
  endDate: string;
  progressData: ProgressData;
  isProgressDataLoading: boolean;
  isPostingWeightLog: boolean;
}
const initialState: ProgressDataState = {
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  progressData: {
    startDate: "",
    endDate: "",
    calorieIntake: {
      avgPerDay: 0,
      targetPerDay: 0,
      changePercentage: 0,
      dailyBreakdown: [],
    },
    waterIntake: {
      avgPerDayMl: 0,
      dailyGoalMl: 0,
      goalAchievementPercentage: 0,
      dailyBreakdown: [],
    },
    weightTrend: {
      currentKg: 0,
      targetKg: 0,
      changeKg: 0,
      bmi: 0,
      heightCm: 0,
      dailyBreakdown: [],
    },
  },
  isProgressDataLoading: false,
  isPostingWeightLog: false,
};

export const fetchProgressDataAsync = createAsyncThunk(
  "progress/fetchProgressData",
  async (
    payload: { startDate: string; endDate: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await fetchProgressData({
        startDate: payload.startDate,
        endDate: payload.endDate,
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Progress data not found",
      );
    }
  },
);

export const postWeightLogAsync = createAsyncThunk(
  "progress/postWeightLog",
  async (
    payload: { weightKg: number },
    { rejectWithValue, getState, dispatch },
  ) => {
    try {
      const response = await postWeightLog({
        weightKg: payload.weightKg,
      });
      const state = getState() as RootState;
      const { startDate, endDate } = state.progress;
      dispatch(fetchProgressDataAsync({ startDate, endDate }) as any);
      return response.data;
    } catch (error: any) {
      console.log("error", JSON.stringify(error?.response?.data, null, 2));
      return rejectWithValue(
        error.response?.data?.message || "Weight log not saved",
      );
    }
  },
);

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },

    setTargetWeightKgProgressSlice: (state, action) => {
      state.progressData.weightTrend.targetKg = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProgressDataAsync.pending, (state) => {
      state.isProgressDataLoading = true;
    });
    builder.addCase(fetchProgressDataAsync.fulfilled, (state, action) => {
      state.progressData = action.payload;
      state.isProgressDataLoading = false;
    });
    builder.addCase(fetchProgressDataAsync.rejected, (state) => {
      state.isProgressDataLoading = false;
    });

    builder.addCase(postWeightLogAsync.pending, (state, action) => {
      state.progressData.weightTrend.currentKg = action.meta.arg.weightKg;
      state.isPostingWeightLog = true;
    });
    builder.addCase(postWeightLogAsync.fulfilled, (state) => {
      state.isPostingWeightLog = false;
    });
    builder.addCase(postWeightLogAsync.rejected, (state) => {
      state.isPostingWeightLog = false;
    });
  },
});

export default progressSlice.reducer;
export const { setTargetWeightKgProgressSlice } = progressSlice.actions;
