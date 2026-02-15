import { PaginationMeta } from "@/api/list";
import {
  fetchFavorites,
  removeFavorite,
  type RecipeListItem,
} from "@/api/recipe";
import { toggleFavorite } from "@/store/slices/recipeListSlice";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface FavoritesListState {
  favorites: RecipeListItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  meta: PaginationMeta;
  hasMore: boolean;
}

const initialState: FavoritesListState = {
  favorites: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  meta: {
    page: 1,
    perPage: 20,
    total: 0,
    lastPage: 1,
    from: 0,
    to: 0,
  },
  hasMore: false,
};

// Async thunk for fetching favorites (initial load)
export const fetchFavoriteRecipes = createAsyncThunk(
  "favoritesList/fetchFavorites",
  async (
    params: {
      perPage?: PaginationMeta["perPage"];
      page?: PaginationMeta["page"];
    },
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

// Async thunk for loading more favorites (pagination)
export const loadMoreFavorites = createAsyncThunk(
  "favoritesList/loadMoreFavorites",
  async (
    params: {
      perPage?: PaginationMeta["perPage"];
      page?: PaginationMeta["page"];
    },
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

export const unfavoriteFromList = createAsyncThunk(
  "favoritesList/unfavorite",
  async (recipeId: string, { rejectWithValue }) => {
    try {
      await removeFavorite(recipeId);
      return recipeId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "İşlem başarısız",
      );
    }
  },
);

export const favoritesListSlice = createSlice({
  name: "favoritesList",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
      state.error = null;
      state.meta = {
        currentPage: 1,
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
    // Fetch Favorites (initial load)
    builder.addCase(fetchFavoriteRecipes.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFavoriteRecipes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.favorites = action.payload.data;
      state.meta = action.payload.meta;
      state.hasMore =
        action.payload.meta.page * action.payload.meta.perPage <
        action.payload.meta.total;
    });
    builder.addCase(fetchFavoriteRecipes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Load More Favorites
    builder.addCase(loadMoreFavorites.pending, (state) => {
      state.isLoadingMore = true;
      state.error = null;
    });
    builder.addCase(loadMoreFavorites.fulfilled, (state, action) => {
      state.isLoadingMore = false;
      state.favorites = [...state.favorites, ...action.payload.data];
      state.meta = action.payload.meta;
      state.hasMore =
        action.payload.meta.page * action.payload.meta.perPage <
        action.payload.meta.total;
    });
    builder.addCase(loadMoreFavorites.rejected, (state, action) => {
      state.isLoadingMore = false;
      state.error = action.payload as string;
    });

    // Unfavorite from list
    builder.addCase(unfavoriteFromList.fulfilled, (state, action) => {
      const recipeId = action.payload;
      state.favorites = state.favorites.filter((r) => r.id !== recipeId);
      state.meta.total = Math.max(0, state.meta.total - 1);
    });

    // Handle toggleFavorite from recipeListSlice
    builder.addCase(toggleFavorite.fulfilled, (state, action) => {
      const { recipeId, isFavorite } = action.payload;
      if (!isFavorite) {
        state.favorites = state.favorites.filter((r) => r.id !== recipeId);
        state.meta.total = Math.max(0, state.meta.total - 1);
      }
    });
  },
});

export const { clearFavorites } = favoritesListSlice.actions;
export default favoritesListSlice.reducer;
