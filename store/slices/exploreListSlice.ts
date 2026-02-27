import { PaginationMeta } from "@/api/list";
import {
  fetchPersonalizedRecipes,
  fetchRecipeList,
  type RecipeListItem,
} from "@/api/recipe";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ExploreListState {
  recommendedRecipes: RecipeListItem[];
  isRecommendedRecipesLoading: boolean;
  isRecommendedRecipesLoadingMore: boolean;
  recommendedRecipesMeta: PaginationMeta;
  hasMoreRecommendedRecipes: boolean;
  errorRecommendedRecipes: string | null;

  trendingRecipes: RecipeListItem[];
  isTrendingRecipesLoading: boolean;
  isTrendingRecipesLoadingMore: boolean;
  trendingRecipesMeta: PaginationMeta;
  hasMoreTrendingRecipes: boolean;
  errorTrendingRecipes: string | null;
}

const initialState: ExploreListState = {
  recommendedRecipes: [],
  isRecommendedRecipesLoading: false,
  isRecommendedRecipesLoadingMore: false,
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

  trendingRecipes: [],
  isTrendingRecipesLoading: false,
  isTrendingRecipesLoadingMore: false,
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
};

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
        ...params,
      });
      return response;
    } catch (error) {
      console.log(error?.response?.data?.message);
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
      const response = await fetchRecipeList({
        isTrending: true,
        ...params,
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Trend tarifler yüklenemedi",
      );
    }
  },
);

export const loadMoreTrendingRecipes = createAsyncThunk(
  "exploreList/loadMoreTrending",
  async (
    params: {
      page?: number;
      perPage?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchRecipeList({
        isTrending: true,
        ...params,
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Trend tarifler yüklenemedi",
      );
    }
  },
);

export const exploreListSlice = createSlice({
  name: "exploreList",
  initialState,
  reducers: {
    clearExplore: (state) => {
      state.recommendedRecipes = [];
      state.errorRecommendedRecipes = null;
      state.recommendedRecipesMeta = {
        page: 1,
        perPage: 20,
        total: 0,
        lastPage: 1,
        from: 0,
        to: 0,
      };
      state.hasMoreRecommendedRecipes = false;
    },
  },
  extraReducers: (builder) => {
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
      state.isRecommendedRecipesLoadingMore = true;
      state.errorRecommendedRecipes = null;
    });
    builder.addCase(loadMoreRecommendedRecipes.fulfilled, (state, action) => {
      state.isRecommendedRecipesLoadingMore = false;
      state.recommendedRecipes = [
        ...state.recommendedRecipes,
        ...action.payload.data,
      ];
      state.recommendedRecipesMeta = action.payload.meta;
      state.hasMoreRecommendedRecipes =
        action.payload.meta.page < action.payload.meta.lastPage;
    });
    builder.addCase(loadMoreRecommendedRecipes.rejected, (state, action) => {
      state.isRecommendedRecipesLoadingMore = false;
      state.errorRecommendedRecipes = action.payload as string;
    });

    // Trending Recipes
    builder.addCase(fetchTrendingRecipes.pending, (state) => {
      state.isTrendingRecipesLoading = true;
      state.errorTrendingRecipes = null;
    });
    builder.addCase(fetchTrendingRecipes.fulfilled, (state, action) => {
      state.isTrendingRecipesLoading = false;
      state.trendingRecipes = action.payload.data;
      state.trendingRecipesMeta = action.payload.meta;
      state.hasMoreTrendingRecipes =
        action.payload.meta.page < action.payload.meta.lastPage;
    });
    builder.addCase(fetchTrendingRecipes.rejected, (state, action) => {
      state.isTrendingRecipesLoading = false;
      state.errorTrendingRecipes = action.payload as string;
    });

    builder.addCase(loadMoreTrendingRecipes.pending, (state) => {
      state.isTrendingRecipesLoadingMore = true;
      state.errorTrendingRecipes = null;
    });
    builder.addCase(loadMoreTrendingRecipes.fulfilled, (state, action) => {
      state.isTrendingRecipesLoadingMore = false;
      state.trendingRecipes = [
        ...state.trendingRecipes,
        ...action.payload.data,
      ];
      state.trendingRecipesMeta = action.payload.meta;
      state.hasMoreTrendingRecipes =
        action.payload.meta.page < action.payload.meta.lastPage;
    });
    builder.addCase(loadMoreTrendingRecipes.rejected, (state, action) => {
      state.isTrendingRecipesLoadingMore = false;
      state.errorTrendingRecipes = action.payload as string;
    });
  },
});

export const { clearExplore } = exploreListSlice.actions;
export default exploreListSlice.reducer;
