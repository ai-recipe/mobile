import {
  fetchFavorites,
  fetchRecipeList,
  type FavoriteItem,
  type FavoritesResponse,
  type RecipeListItem,
} from "@/api/recipe";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RecipeListState {
  recipes: RecipeListItem[];
  favorites: FavoriteItem[];
  isLoadingRecipes: boolean;
  isLoadingFavorites: boolean;
  recipeError: string | null;
  favoriteError: string | null;
  totalFavorites: number;
}

const initialState: RecipeListState = {
  recipes: [],
  favorites: [],
  isLoadingRecipes: false,
  isLoadingFavorites: false,
  recipeError: null,
  favoriteError: null,
  totalFavorites: 0,
};

// Async thunk for fetching recipe list
export const fetchRecipes = createAsyncThunk(
  "recipeList/fetchRecipes",
  async (
    params: { query: string; limit?: number; offset?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchRecipeList(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Tarifler yüklenemedi",
      );
    }
  },
);

// Async thunk for fetching favorites
export const fetchUserFavorites = createAsyncThunk(
  "recipeList/fetchFavorites",
  async (
    params: { limit?: number; offset?: number } | undefined,
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchFavorites(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Favoriler yüklenemedi",
      );
    }
  },
);

export const recipeListSlice = createSlice({
  name: "recipeList",
  initialState,
  reducers: {
    clearRecipes: (state) => {
      state.recipes = [];
      state.recipeError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Recipes
    builder.addCase(fetchRecipes.pending, (state) => {
      state.isLoadingRecipes = true;
      state.recipeError = null;
    });
    builder.addCase(fetchRecipes.fulfilled, (state, action) => {
      state.isLoadingRecipes = false;
      state.recipes = action.payload;
    });
    builder.addCase(fetchRecipes.rejected, (state, action) => {
      state.isLoadingRecipes = false;
      state.recipeError = action.payload as string;
    });

    // Fetch Favorites
    builder.addCase(fetchUserFavorites.pending, (state) => {
      state.isLoadingFavorites = true;
      state.favoriteError = null;
    });
    builder.addCase(
      fetchUserFavorites.fulfilled,
      (state, action: PayloadAction<FavoritesResponse>) => {
        state.isLoadingFavorites = false;
        state.favorites = action.payload.items;
        state.totalFavorites = action.payload.total;
      },
    );
    builder.addCase(fetchUserFavorites.rejected, (state, action) => {
      state.isLoadingFavorites = false;
      state.favoriteError = action.payload as string;
    });
  },
});

export const { clearRecipes } = recipeListSlice.actions;
export default recipeListSlice.reducer;
