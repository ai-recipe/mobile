import {
  addFoodLog,
  deleteFoodLog,
  fetchFoodLogs,
  scanFood,
  updateFoodLog,
  type AddFoodLogParams,
  type DailySummary,
  type FoodLogEntry,
} from "@/api/nutrition";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface DailyLogsState {
  entries: FoodLogEntry[];
  recentMeals: FoodLogEntry[];
  summary: DailySummary;
  isLoading: boolean;
  isRecentLoading: boolean;
  error: string | null;
}

const initialState: DailyLogsState = {
  entries: [],
  recentMeals: [],
  summary: {
    totalCalories: 0,
    totalProteinGrams: 0,
    totalCarbsGrams: 0,
    totalFatGrams: 0,
    targetCalories: 0,
    targetProteinGrams: 0,
    targetCarbsGrams: 0,
    targetFatGrams: 0,
  },
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
      dispatch(
        fetchFoodLogsAsync({
          startDate: data.loggedAt?.split("T")[0],
          endDate: data.loggedAt?.split("T")[0],
        }),
      );
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

export const scanFoodAsync = createAsyncThunk(
  "dailyLogs/scanFood",
  async (image: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await scanFood(image);
      // add temporary food log
      // not deletable
      // listen sockets when scanning is done
      // when scanning is done,update the log

      dispatch(addTemporaryFoodLog({ imageUri: image }));
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? (error as any).response?.data?.message
          : "Failed to scan food",
      );
    }
  },
);

export const fetchRecentMealsAsync = createAsyncThunk(
  "dailyLogs/fetchRecentMeals",
  async (_, { rejectWithValue }) => {
    try {
      const now = new Date();
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(now.getDate() - 3);

      const startDate = threeDaysAgo.toISOString().split("T")[0];
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
    addTemporaryFoodLog: (
      state,
      action: PayloadAction<{
        imageUri: string;
      }>,
    ) => {
      const temporaryFoodLog: FoodLogEntry = {
        imageUri: action.payload.imageUri,
        id: uuidv4(),
        type: "scan",
        isTemporary: true,
        mealName: "",
        calories: 0,
        proteinGrams: 0,
        carbsGrams: 0,
        fatGrams: 0,
        quantity: 0,
        loggedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.entries.push(temporaryFoodLog);
    },
    clearDailyLogsState: (state) => {
      state.entries = [];
      state.summary = {
        totalCalories: 0,
        totalProteinGrams: 0,
        totalCarbsGrams: 0,
        totalFatGrams: 0,
        targetCalories: 0,
        targetProteinGrams: 0,
        targetCarbsGrams: 0,
        targetFatGrams: 0,
      };
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
      state.summary = action.payload.days[0]?.summary;
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

    // Update Food Log
    builder.addCase(updateFoodLogAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateFoodLogAsync.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateFoodLogAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Food Log
    builder.addCase(deleteFoodLogAsync.pending, (state, payload) => {
      state.entries = state.entries.filter(
        (entry) => entry.id !== payload.meta.arg.id,
      );
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

export const { clearDailyLogsState, addTemporaryFoodLog } =
  dailyLogsSlice.actions;
export default dailyLogsSlice.reducer;
