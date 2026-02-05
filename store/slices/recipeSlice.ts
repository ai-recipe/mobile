import {
  discoverRecipes,
  RecipeFromAPI,
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
  formData: {
    image: string;
    scannedIngredients: string[]; // From scan API
    selectedIngredients: string[]; // User-modified selection
    timePreference: number;
    dietPreferences: string[];
    name: string;
    estimatedTime: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    shortSteps: string[];
  };
  recipes: RecipeFromAPI[];
  suggestions: RecipeSuggestion | null;
  isLoadingScan: boolean;
  isLoadingRecipes: boolean;
  scannedImage: string | null;
  scanError: string | null;
  analyseError: string | null;
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
  formData: {
    image: "",
    scannedIngredients: [],
    selectedIngredients: [],
    timePreference: 30,
    dietPreferences: [],
    name: "",
    estimatedTime: "",
    difficulty: "EASY",
    shortSteps: [],
  },
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
      ingredientIds: string[];
      maxPrepTime: number;
      dietaryPreferences: string[];
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await discoverRecipes({
        ingredientIds: params.ingredientIds,
        maxPrepTime: params.maxPrepTime,
        dietaryPreferences: params.dietaryPreferences,
        locale: "tr", // Default locale as per requirements
      });
      dispatch(setAppStep(AppStep.Results));
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Tarif oluşturma başarısız",
      );
    }
  },
);

export const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setImage: (state, action: PayloadAction<string>) => {
      state.formData.image = action.payload;
    },
    setAppStep: (state, action: PayloadAction<AppStep>) => {
      state.appStep = action.payload;
    },
    setScannedIngredients: (state, action: PayloadAction<string[]>) => {
      state.formData.scannedIngredients = action.payload;
      state.formData.selectedIngredients = action.payload; // Initialize selection
    },
    setSelectedIngredients: (state, action: PayloadAction<string[]>) => {
      state.formData.selectedIngredients = action.payload;
    },
    toggleIngredient: (state, action: PayloadAction<string>) => {
      const ingredient = action.payload;
      const index = state.formData.selectedIngredients.indexOf(ingredient);
      if (index > -1) {
        state.formData.selectedIngredients.splice(index, 1);
      } else {
        state.formData.selectedIngredients.push(ingredient);
      }
    },
    addCustomIngredient: (state, action: PayloadAction<string>) => {
      const ingredient = action.payload.trim();
      if (
        ingredient &&
        !state.formData.selectedIngredients.includes(ingredient)
      ) {
        state.formData.selectedIngredients.push(ingredient);
        state.formData.scannedIngredients.push(ingredient);
      }
    },
    setTimePreference: (state, action: PayloadAction<number>) => {
      state.formData.timePreference = action.payload;
    },
    setDietPreferences: (state, action: PayloadAction<string[]>) => {
      state.formData.dietPreferences = action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<Partial<typeof initialState.formData>>,
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetRecipeState: (state) => {
      state.appStep = AppStep.StepScan;
      state.recipes = [];
      state.suggestions = null;
      state.isLoadingScan = false;
      state.isLoadingRecipes = false;
      state.scanError = null;
      state.analyseError = null;
      state.formData.scannedIngredients = [];
      state.formData.selectedIngredients = [];
      state.formData.dietPreferences = [];
      state.scannedImage = null;
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

      state.formData.scannedIngredients = action.payload;
      state.formData.selectedIngredients = action.payload;
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
  },
});

export const {
  setImage,
  setAppStep,
  setScannedIngredients,
  setSelectedIngredients,
  toggleIngredient,
  addCustomIngredient,
  setTimePreference,
  setDietPreferences,
  setFormData,
  resetRecipeState,
} = recipeSlice.actions;

export default recipeSlice.reducer;
