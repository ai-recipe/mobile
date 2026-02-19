import { fetchProgressData, ProgressData } from "@/api/progress";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ProgressDataState {
  startDate: string;
  endDate: string;
  progressData: ProgressData;
  isProgressDataLoading: boolean;
}
const initialState: ProgressDataState = {
  startDate: "",
  endDate: "",
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
};

export const fetchProgressDataAsync = createAsyncThunk(
  "progress/fetchProgressData",
  async (
    payload: { startDate: string; endDate: string },
    { rejectWithValue },
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

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
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
  },
});

export default progressSlice.reducer;
