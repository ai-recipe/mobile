import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchCoachInsight, type CoachInsight } from "@/api/coach";
import { fetchPersonalizedRecipes, type RecipeListItem } from "@/api/recipe";

// ─── State ────────────────────────────────────────────────────────────────────

interface CoachState {
  insight: CoachInsight | null;
  isInsightLoading: boolean;
  isInsightLoaded: boolean;

  activeUserCount: number;

  personalizedRecipes: RecipeListItem[];
  isRecipesLoading: boolean;
  isRecipesLoaded: boolean;
}

const initialState: CoachState = {
  insight: null,
  isInsightLoading: false,
  isInsightLoaded: false,

  activeUserCount: 0,

  personalizedRecipes: [],
  isRecipesLoading: false,
  isRecipesLoaded: false,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchInsightAsync = createAsyncThunk(
  "coach/fetchInsight",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCoachInsight();
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error?.code ?? "UNKNOWN");
    }
  },
);

export const fetchCoachRecipesAsync = createAsyncThunk(
  "coach/fetchRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchPersonalizedRecipes({ perPage: 5, page: 1 });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error?.code ?? "UNKNOWN");
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const coachSlice = createSlice({
  name: "coach",
  initialState,
  reducers: {
    setInsight(state, action: PayloadAction<CoachInsight>) {
      state.insight = action.payload;
      state.isInsightLoaded = true;
    },
    setActiveUserCount(state, action: PayloadAction<number>) {
      state.activeUserCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchInsightAsync
      .addCase(fetchInsightAsync.pending, (state) => {
        state.isInsightLoading = true;
      })
      .addCase(fetchInsightAsync.fulfilled, (state, action) => {
        state.isInsightLoading = false;
        state.isInsightLoaded = true;
        state.insight = action.payload;
      })
      .addCase(fetchInsightAsync.rejected, (state) => {
        state.isInsightLoading = false;
        state.isInsightLoaded = true;
      })
      // fetchCoachRecipesAsync
      .addCase(fetchCoachRecipesAsync.pending, (state) => {
        state.isRecipesLoading = true;
      })
      .addCase(fetchCoachRecipesAsync.fulfilled, (state, action) => {
        state.isRecipesLoading = false;
        state.isRecipesLoaded = true;
        state.personalizedRecipes = action.payload;
      })
      .addCase(fetchCoachRecipesAsync.rejected, (state) => {
        state.isRecipesLoading = false;
        state.isRecipesLoaded = true;
      });
  },
});

export const { setInsight, setActiveUserCount } = coachSlice.actions;
export default coachSlice.reducer;
