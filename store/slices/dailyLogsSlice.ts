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
  recentMeals: FoodLogEntry[];
  summary: DailySummary | null;
  isLoading: boolean;
  isRecentLoading: boolean;
  error: string | null;
}

const initialState: DailyLogsState = {
  entries: [],
  recentMeals: [],
  summary: null,
  isLoading: false,
  isRecentLoading: false,
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
  async (
    { id, date }: { id: string; date?: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await deleteFoodLog(id);
      dispatch(
        fetchFoodLogsAsync(
          date ? { startDate: date, endDate: date } : undefined,
        ),
      );
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

export const fetchRecentMealsAsync = createAsyncThunk(
  "dailyLogs/fetchRecentMeals",
  async (_, { rejectWithValue }) => {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      const startDate = thirtyDaysAgo.toISOString().split("T")[0];
      const endDate = now.toISOString().split("T")[0];

      const response = await fetchFoodLogs({ startDate, endDate });

      // Extract all entries from all days and get unique ones by mealName
      const allEntries = response.data.days.flatMap((day) => day.entries);
      const uniqueMealsMap = new Map<string, FoodLogEntry>();

      allEntries.forEach((entry) => {
        // Keep the most recent version of the meal (first encounter in flatMap if sorted)
        if (!uniqueMealsMap.has(entry.mealName)) {
          uniqueMealsMap.set(entry.mealName, entry);
        }
      });

      return Array.from(uniqueMealsMap.values()).slice(0, 15); // Return top 15 unique recent meals
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? (error as any).response?.data?.message
          : "Failed to fetch recent meals",
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

    // Fetch Recent Meals
    builder.addCase(fetchRecentMealsAsync.pending, (state) => {
      state.isRecentLoading = true;
    });
    builder.addCase(fetchRecentMealsAsync.fulfilled, (state, action) => {
      state.isRecentLoading = false;
      state.recentMeals = action.payload;
    });
    builder.addCase(fetchRecentMealsAsync.rejected, (state) => {
      state.isRecentLoading = false;
    });
  },
});

export const { clearDailyLogsState } = dailyLogsSlice.actions;
export default dailyLogsSlice.reducer;
