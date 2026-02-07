import {
  addFavorite,
  discoverRecipes,
  RecipeFromAPI,
  removeFavorite,
  type RecipeSuggestion,
} from "@/api/recipe";
import { scanImage as scanImageAPI } from "@/api/scanImage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setStep } from "./multiStepFormSlice";

// Enum for app step states
export enum AppStep {
  StepScan = "StepScan",
  LoadingScan = "LoadingScan",
  IngredientsSelection = "IngredientsSelection",
  TimePreference = "TimePreference",
  DietPreference = "DietPreference",
  LoadingGenerate = "LoadingGenerate",
  Results = "Results",
}

interface RecipeState {
  appStep: AppStep;
  recipes: RecipeFromAPI[];
  suggestions: RecipeSuggestion | null;
  isLoadingScan: boolean;
  isLoadingRecipes: boolean;
  scannedImage: string | null;
  scanError: string | null;
  analyseError: string | null;

  scannedIngredients: string[]; // From scan API
}

const initialState: RecipeState = {
  appStep: AppStep.StepScan,
  recipes: [],
  suggestions: null,
  isLoadingScan: false,
  isLoadingRecipes: false,
  scannedImage: null,
  scanError: null,
  analyseError: null,
  scannedIngredients: [],
};

// Async thunk for scanning image
export const scanImage = createAsyncThunk(
  "recipe/scanImage",
  async (imageUri: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await scanImageAPI({ imageUri });

      dispatch(setStep(1));
      dispatch(setAppStep(AppStep.IngredientsSelection));
      return response.ingredients;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Tarama başarısız",
      );
    }
  },
);

// Async thunk for fetching recipes
export const discoverRecipesAsync = createAsyncThunk(
  "recipe/discoverRecipesAsync",
  async (
    params: {
      ingredients: string[];
      maxPrepTime: number;
      dietaryPreferences: string[];
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      console.log(
        "params",
        JSON.stringify({
          ingredients: params.ingredients,
          maxPrepTime: params.maxPrepTime,
          dietaryPreferences: params.dietaryPreferences,
        }),
      );
      const response = await discoverRecipes({
        ingredients: params.ingredients,
        maxPrepTime: params.maxPrepTime,
        dietaryPreferences: params.dietaryPreferences,
      });
      console.log("response", JSON.stringify(response, null, 2));
      dispatch(setAppStep(AppStep.Results));
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data.message);
    }
  },
);

export const toggleFavoriteFromScan = createAsyncThunk(
  "recipe/toggleFavorite",
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
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "İşlem başarısız",
      );
    }
  },
);

export const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setImage: (state, action: PayloadAction<string>) => {
      state.scannedImage = action.payload;
    },
    setAppStep: (state, action: PayloadAction<AppStep>) => {
      state.appStep = action.payload;
    },
    setScannedIngredients: (state, action: PayloadAction<string[]>) => {
      state.scannedIngredients = action.payload;
    },
    addIngredient: (state, action: PayloadAction<string>) => {
      if (!state.scannedIngredients.includes(action.payload)) {
        state.scannedIngredients.push(action.payload);
      }
    },
    resetRecipeState: (state) => {
      state.appStep = AppStep.StepScan;
      state.recipes = [];
      state.suggestions = null;
      state.isLoadingScan = false;
      state.isLoadingRecipes = false;
      state.scanError = null;
      state.analyseError = null;
      state.scannedIngredients = [];
      state.scannedImage = null;
    },
    updateRecipeFavoriteStatus: (
      state,
      action: PayloadAction<{ recipeId: string; isFavorite: boolean }>,
    ) => {
      const { recipeId, isFavorite } = action.payload;
      const recipe = state.recipes.find((r) => r.id === recipeId);
      if (recipe) {
        recipe.isFavorite = isFavorite;
      }
    },
  },
  extraReducers: (builder) => {
    // Scan Image
    builder.addCase(scanImage.pending, (state) => {
      state.isLoadingScan = true;
      state.scanError = null;
      state.appStep = AppStep.LoadingScan;
    });
    builder.addCase(scanImage.fulfilled, (state, action) => {
      state.isLoadingScan = false;

      state.scannedIngredients = action.payload;
      state.scannedImage = action.meta.arg;
      state.appStep = AppStep.IngredientsSelection;
    });
    builder.addCase(scanImage.rejected, (state, action) => {
      state.isLoadingScan = false;
      state.scanError = action.payload as string;
      state.appStep = AppStep.StepScan;
    });

    // Fetch Recipes
    builder.addCase(discoverRecipesAsync.pending, (state) => {
      state.isLoadingRecipes = true;
      state.analyseError = null;
      state.appStep = AppStep.LoadingGenerate;
    });
    builder.addCase(discoverRecipesAsync.fulfilled, (state, action) => {
      state.isLoadingRecipes = false;
      state.recipes = action.payload.recipes;
      state.suggestions = action.payload.suggestions;
      state.appStep = AppStep.Results;
    });
    builder.addCase(discoverRecipesAsync.rejected, (state, action) => {
      state.isLoadingRecipes = false;
      state.analyseError = action.payload as string;
      state.appStep = AppStep.DietPreference; // Return to last step
    });

    // Toggle Favorite
    builder.addCase(toggleFavoriteFromScan.fulfilled, (state, action) => {
      const { recipeId, isFavorite } = action.payload;
      const recipe = state.recipes.find((r) => r.id === recipeId);
      if (recipe) {
        recipe.isFavorite = isFavorite;
      }
    });
  },
});

export const {
  setImage,
  setAppStep,
  setScannedIngredients,
  resetRecipeState,
  addIngredient,
  updateRecipeFavoriteStatus,
} = recipeSlice.actions;

export default recipeSlice.reducer;
