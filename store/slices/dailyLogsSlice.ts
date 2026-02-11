import {
  addFoodLog,
  deleteFoodLog,
  fetchFoodLogs,
  updateFoodLog,
  type AddFoodLogParams,
  type DailySummary,
  type FoodLogEntry,
} from "@/api/nutrition";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DailyLogsState {
  entries: FoodLogEntry[];
  summary: DailySummary | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DailyLogsState = {
  entries: [],
  summary: null,
  isLoading: false,
  error: null,
};

export const fetchFoodLogsAsync = createAsyncThunk(
  "dailyLogs/fetchFoodLogs",
  async (
    params: { startDate?: string; endDate?: string } | undefined,
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchFoodLogs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? (error as any).response?.data?.message
          : "Failed to fetch food logs",
      );
    }
  },
);

export const addFoodLogAsync = createAsyncThunk(
  "dailyLogs/addFoodLog",
  async (data: AddFoodLogParams, { rejectWithValue, dispatch }) => {
    try {
      console.log("Adding food log:", data);
      const response = await addFoodLog(data);
      const date = data.loggedAt?.split("T")[0];
      dispatch(fetchFoodLogsAsync({ startDate: date, endDate: date }));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? (error as any).response?.data?.message
          : "Failed to add food log",
      );
    }
  },
);

export const updateFoodLogAsync = createAsyncThunk(
  "dailyLogs/updateFoodLog",
  async (
    { id, data }: { id: string; data: Partial<AddFoodLogParams> },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await updateFoodLog(id, data);
      dispatch(fetchFoodLogsAsync());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? (error as any).response?.data?.message
          : "Failed to update food log",
      );
    }
  },
);

export const deleteFoodLogAsync = createAsyncThunk(
  "dailyLogs/deleteFoodLog",
  async ({ id }: { id: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await deleteFoodLog(id);
      dispatch(fetchFoodLogsAsync());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? (error as any).response?.data?.message
          : "Failed to delete food log",
      );
    }
  },
);

const dailyLogsSlice = createSlice({
  name: "dailyLogs",
  initialState,
  reducers: {
    clearDailyLogsState: (state) => {
      state.entries = [];
      state.summary = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Food Logs
    builder.addCase(fetchFoodLogsAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFoodLogsAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      // Map entries from the first day in the days array
      state.entries = action.payload.days[0]?.entries || [];
      state.summary = action.payload.summary;
    });
    builder.addCase(fetchFoodLogsAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Add Food Log
    builder.addCase(addFoodLogAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addFoodLogAsync.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addFoodLogAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearDailyLogsState } = dailyLogsSlice.actions;
export default dailyLogsSlice.reducer;
