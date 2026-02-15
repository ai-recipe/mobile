import { PaginationMeta } from "@/api/list";
import {
  addFavorite,
  fetchRecipeList,
  removeFavorite,
  type FavoriteItem,
  type RecipeListItem,
} from "@/api/recipe";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface RecipeListState {
  recipes: RecipeListItem[];
  favorites: FavoriteItem[];
  isLoadingRecipes: boolean;
  isLoadingMore: boolean;
  isLoadingFavorites: boolean;
  recipeError: string | null;
  favoriteError: string | null;
  meta: PaginationMeta;
  hasMore: boolean;
}

const initialState: RecipeListState = {
  recipes: [],
  favorites: [],
  isLoadingRecipes: false,
  isLoadingMore: false,
  isLoadingFavorites: false,
  recipeError: null,
  favoriteError: null,
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

// Async thunk for fetching recipe list (initial load)
export const fetchRecipes = createAsyncThunk(
  "recipeList/fetchRecipes",
  async (
    params: {
      title?: string;
      description?: string;
      page?: number;
      perPage?: number;
    },
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

// Async thunk for loading more recipes (pagination)
export const loadMoreRecipes = createAsyncThunk(
  "recipeList/loadMoreRecipes",
  async (
    params: {
      title?: string;
      description?: string;
      page?: PaginationMeta["page"];
      perPage?: PaginationMeta["perPage"];
    },
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

export const toggleFavorite = createAsyncThunk(
  "recipeList/toggleFavorite",
  async (
    { recipeId, isFavorite }: { recipeId: string; isFavorite: boolean },
    { rejectWithValue },
  ) => {
    try {
      if (isFavorite) {
        await removeFavorite(recipeId);
      } else {
        await addFavorite(recipeId);
      }
      return { recipeId, isFavorite: !isFavorite };
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      return rejectWithValue(
        error instanceof Error ? error.message : "İşlem başarısız",
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
      state.meta = {
        page: 1,
        perPage: 20,
        total: 0,
        lastPage: 1,
        from: 0,
        to: 0,
      };
    },
    updateRecipeFavoriteStatus: (
      state,
      action: { payload: { recipeId: string; isFavorite: boolean } },
    ) => {
      const { recipeId, isFavorite } = action.payload;
      const recipe = state.recipes.find((r) => r.id === recipeId);
      if (recipe) {
        recipe.isFavorite = isFavorite;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Recipes (initial load)
    builder.addCase(fetchRecipes.pending, (state) => {
      state.isLoadingRecipes = true;
      state.recipeError = null;
    });
    builder.addCase(fetchRecipes.fulfilled, (state, action) => {
      state.isLoadingRecipes = false;
      state.recipes = action.payload.data;
      state.meta = action.payload.meta;
    });
    builder.addCase(fetchRecipes.rejected, (state, action) => {
      state.isLoadingRecipes = false;
      state.recipeError = action.payload as string;
    });

    // Load More Recipes (pagination)
    builder.addCase(loadMoreRecipes.pending, (state) => {
      state.isLoadingMore = true;
      state.recipeError = null;
    });
    builder.addCase(loadMoreRecipes.fulfilled, (state, action) => {
      state.isLoadingMore = false;
      state.recipes = [...state.recipes, ...action.payload.data];
      state.meta = action.payload.meta;
    });
    builder.addCase(loadMoreRecipes.rejected, (state, action) => {
      state.isLoadingMore = false;
      state.recipeError = action.payload as string;
    });

    // Toggle Favorite
    builder.addCase(toggleFavorite.fulfilled, (state, action) => {
      const { recipeId, isFavorite } = action.payload;
      const recipe = state.recipes.find((r) => r.id === recipeId);
      if (recipe) {
        recipe.isFavorite = isFavorite;
      }
    });
  },
});

export const { clearRecipes, updateRecipeFavoriteStatus } =
  recipeListSlice.actions;
export default recipeListSlice.reducer;
