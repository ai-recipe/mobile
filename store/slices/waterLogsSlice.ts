import {
  addWaterIntake,
  deleteWaterIntake,
  fetchWaterIntake,
  type WaterIntakeSummary,
} from "@/api/nutrition";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface WaterLogsState extends WaterIntakeSummary {
  isLoading: boolean;
  isAdding: boolean;
  error: string | null;
}

const initialState: WaterLogsState = {
  date: "",
  totalIntakeMl: 0,
  dailyGoalMl: 2500,
  progressPercentage: 0,
  entries: [],
  isLoading: false,
  isAdding: false,
  error: null,
};

export const fetchWaterIntakeAsync = createAsyncThunk(
  "waterLogs/fetchWaterIntake",
  async (date: string, { rejectWithValue }) => {
    try {
      const data = await fetchWaterIntake({ date });
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? (error as any).response?.data?.message
          : "Failed to fetch water intake",
      );
    }
  },
);

export const addWaterIntakeAsync = createAsyncThunk(
  "waterLogs/addWaterIntake",
  async (
    payload: { amountMl: number; date: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await addWaterIntake({ amountMl: payload.amountMl });
      await dispatch(fetchWaterIntakeAsync(payload.date));
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? (error as any).response?.data?.message
          : "Failed to add water intake",
      );
    }
  },
);

export const deleteWaterIntakeAsync = createAsyncThunk(
  "waterLogs/deleteWaterIntake",
  async (
    payload: { id: string; date: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      await deleteWaterIntake(payload.id);
      await dispatch(fetchWaterIntakeAsync(payload.date));
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? (error as any).response?.data?.message
          : "Failed to delete water intake",
      );
    }
  },
);

const waterLogsSlice = createSlice({
  name: "waterLogs",
  initialState,
  reducers: {
    clearWaterLogsState: (state) => {
      state.entries = [];
      state.totalIntakeMl = 0;
      state.progressPercentage = 0;
      state.date = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWaterIntakeAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWaterIntakeAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.date = action.payload.date;
        state.totalIntakeMl = action.payload.totalIntakeMl;
        state.dailyGoalMl = action.payload.dailyGoalMl;
        state.progressPercentage = action.payload.progressPercentage;
        state.entries = action.payload.entries;
      })
      .addCase(fetchWaterIntakeAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(addWaterIntakeAsync.pending, (state) => {
        state.isAdding = true;
        state.error = null;
      })
      .addCase(addWaterIntakeAsync.fulfilled, (state) => {
        state.isAdding = false;
      })
      .addCase(addWaterIntakeAsync.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.payload as string;
      });

    builder.addCase(deleteWaterIntakeAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { clearWaterLogsState } = waterLogsSlice.actions;
export default waterLogsSlice.reducer;
