import { PaginationMeta } from "@/api/list";
import { fetchPersonalizedRecipes, type RecipeListItem } from "@/api/recipe";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ExploreListState {
  trendingRecipes: RecipeListItem[];
  isTrendingRecipesLoading: boolean;
  trendingRecipesMeta: PaginationMeta;
  hasMoreTrendingRecipes: boolean;
  errorTrendingRecipes: string | null;

  recommendedRecipes: RecipeListItem[];
  recommendedRecipesMeta: PaginationMeta;
  hasMoreRecommendedRecipes: boolean;
  errorRecommendedRecipes: string | null;

  isRecommendedRecipesLoading: boolean;
  error: string | null;
  hasMore: boolean;
  meta: PaginationMeta;
}

const initialState: ExploreListState = {
  trendingRecipes: [],
  isTrendingRecipesLoading: false,
  trendingRecipesMeta: {
    page: 1,
    perPage: 20,
    total: 0,
    lastPage: 1,
    from: 0,
    to: 0,
  },
  hasMoreTrendingRecipes: false,
  errorTrendingRecipes: null,

  recommendedRecipes: [],
  recommendedRecipesMeta: {
    page: 1,
    perPage: 20,
    total: 0,
    lastPage: 1,
    from: 0,
    to: 0,
  },
  hasMoreRecommendedRecipes: false,
  errorRecommendedRecipes: null,

  isRecommendedRecipesLoading: false,
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
export const fetchTrendingRecipes = createAsyncThunk(
  "exploreList/fetchTrending",
  async (
    params: {
      page?: number;
      perPage?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchPersonalizedRecipes({
        isTrending: true,
        ...params,
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Keşfet tarifleri yüklenemedi",
      );
    }
  },
);

export const fetchRecommendedRecipes = createAsyncThunk(
  "exploreList/fetchRecommended",
  async (
    params: {
      page?: number;
      perPage?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchPersonalizedRecipes({
        isTrending: false,
        ...params,
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Keşfet tarifleri yüklenemedi",
      );
    }
  },
);

export const loadMoreRecommendedRecipes = createAsyncThunk(
  "exploreList/loadMoreRecommended",
  async (
    params: {
      page?: number;
      perPage?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchPersonalizedRecipes({
        isTrending: false,
        ...params,
      });
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
      state.trendingRecipes = [];
      state.recommendedRecipes = [];
      state.errorTrendingRecipes = null;
      state.errorRecommendedRecipes = null;
      state.meta = {
        page: 1,
        perPage: 20,
        total: 0,
        lastPage: 1,
        from: 0,
        to: 0,
      };
      state.hasMore = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTrendingRecipes.pending, (state) => {
      state.isTrendingRecipesLoading = true;
      state.errorTrendingRecipes = null;
    });
    builder.addCase(fetchTrendingRecipes.fulfilled, (state, action) => {
      state.isTrendingRecipesLoading = false;
      state.trendingRecipes = action.payload.data;
      state.trendingRecipesMeta = action.payload.meta;
      state.hasMoreTrendingRecipes =
        action.payload.meta.from + action.payload.meta.perPage <
        action.payload.meta.total;
    });
    builder.addCase(fetchTrendingRecipes.rejected, (state, action) => {
      state.isTrendingRecipesLoading = false;
      state.errorTrendingRecipes = action.payload as string;
    });

    builder.addCase(fetchRecommendedRecipes.pending, (state) => {
      state.isRecommendedRecipesLoading = true;
      state.errorRecommendedRecipes = null;
    });
    builder.addCase(fetchRecommendedRecipes.fulfilled, (state, action) => {
      state.isRecommendedRecipesLoading = false;
      state.recommendedRecipes = action.payload.data;
      state.recommendedRecipesMeta = action.payload.meta;
      state.hasMoreRecommendedRecipes =
        action.payload.meta.from + action.payload.meta.perPage <
        action.payload.meta.total;
    });
    builder.addCase(fetchRecommendedRecipes.rejected, (state, action) => {
      state.isRecommendedRecipesLoading = false;
      state.errorRecommendedRecipes = action.payload as string;
    });
    builder.addCase(loadMoreRecommendedRecipes.pending, (state) => {
      state.isRecommendedRecipesLoading = true;
      state.errorRecommendedRecipes = null;
    });
    builder.addCase(loadMoreRecommendedRecipes.fulfilled, (state, action) => {
      state.isRecommendedRecipesLoading = false;
      state.recommendedRecipes = [
        ...state.recommendedRecipes,
        ...action.payload.data,
      ];
      state.recommendedRecipesMeta = action.payload.meta;
      state.hasMoreRecommendedRecipes =
        action.payload.meta.from + action.payload.meta.perPage <
        action.payload.meta.total;
    });
    builder.addCase(loadMoreRecommendedRecipes.rejected, (state, action) => {
      state.isRecommendedRecipesLoading = false;
      state.errorRecommendedRecipes = action.payload as string;
    });
  },
});

export const { clearExplore } = exploreListSlice.actions;
export default exploreListSlice.reducer;
