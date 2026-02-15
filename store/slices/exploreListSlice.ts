import { PaginationMeta } from "@/api/list";
import { fetchPersonalizedRecipes, type RecipeListItem } from "@/api/recipe";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ExploreListState {
  recipes: RecipeListItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  meta: PaginationMeta;
  hasMore: boolean;
}

const initialState: ExploreListState = {
  recipes: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  hasMore: true,
  meta: {
    page: 1,
    perPage: 20,
    total: 0,
    lastPage: 1,
    from: 0,
    to: 0,
  },
};

// Async thunk for fetching explore recipes (initial load)
export const fetchExploreRecipes = createAsyncThunk(
  "exploreList/fetchExplore",
  async (
    params: {
      page?: number;
      perPage?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchPersonalizedRecipes(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Keşfet tarifleri yüklenemedi",
      );
    }
  },
);

// Async thunk for loading more explore recipes (pagination)
export const loadMoreExploreRecipes = createAsyncThunk(
  "exploreList/loadMoreExplore",
  async (
    params: {
      page?: number;
      perPage?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchPersonalizedRecipes(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Keşfet tarifleri yüklenemedi",
      );
    }
  },
);

export const exploreListSlice = createSlice({
  name: "exploreList",
  initialState,
  reducers: {
    clearExplore: (state) => {
      state.recipes = [];
      state.error = null;
      state.meta = {
        page: 1,
        perPage: 20,
        total: 0,
        lastPage: 1,
        from: 0,
        to: 0,
      };
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    // Fetch Explore (initial load)
    builder.addCase(fetchExploreRecipes.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchExploreRecipes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.recipes = action.payload.data;
      state.meta = action.payload.meta;
      state.hasMore =
        action.payload.meta.from + action.payload.meta.perPage <
        action.payload.meta.total;
    });
    builder.addCase(fetchExploreRecipes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Load More Explore
    builder.addCase(loadMoreExploreRecipes.pending, (state) => {
      state.isLoadingMore = true;
      state.error = null;
    });
    builder.addCase(loadMoreExploreRecipes.fulfilled, (state, action) => {
      state.isLoadingMore = false;
      state.recipes = [...state.recipes, ...action.payload.data];
      state.meta = action.payload.meta;
      state.hasMore =
        action.payload.meta.from + action.payload.meta.perPage <
        action.payload.meta.total;
    });
    builder.addCase(loadMoreExploreRecipes.rejected, (state, action) => {
      state.isLoadingMore = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearExplore } = exploreListSlice.actions;
export default exploreListSlice.reducer;
