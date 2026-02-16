import { PaginationMeta } from "@/api/list";
import { fetchPersonalizedRecipes, type RecipeListItem } from "@/api/recipe";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ExploreListState {
  recommendedRecipes: RecipeListItem[];
  isRecommendedRecipesLoading: boolean;
  isRecommendedRecipesLoadingMore: boolean;
  recommendedRecipesMeta: PaginationMeta;
  hasMoreRecommendedRecipes: boolean;
  errorRecommendedRecipes: string | null;
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
  },
});

export const { clearExplore } = exploreListSlice.actions;
export default exploreListSlice.reducer;
