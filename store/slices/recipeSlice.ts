import type { RecipeFromAPI } from "@/api/recipe";
import { analyseImage } from "@/api/recipe";
import { scanImage as scanImageAPI } from "@/api/scanImage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  isLoadingScan: boolean;
  isLoadingRecipes: boolean;
  scanError: string | null;
  analyseError: string | null;
}

const initialState: RecipeState = {
  appStep: AppStep.StepScan,
  recipes: [],
  isLoadingScan: false,
  isLoadingRecipes: false,
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
  async (imageUrl: string, { rejectWithValue }) => {
    try {
      const response = await scanImageAPI({ imageUrl });
      return response.ingredients;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Tarama başarısız",
      );
    }
  },
);

// Async thunk for fetching recipes
export const fetchRecipes = createAsyncThunk(
  "recipe/fetchRecipes",
  async (
    params: {
      imageUrl: string;
      ingredients: string[];
      timeMinutes: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await analyseImage({
        imageUrl: params.imageUrl,
        ingredients: params.ingredients,
        timeMinutes: params.timeMinutes,
      });
      return response.recipes;
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
      state.isLoadingScan = false;
      state.isLoadingRecipes = false;
      state.scanError = null;
      state.analyseError = null;
      state.formData.scannedIngredients = [];
      state.formData.selectedIngredients = [];
      state.formData.dietPreferences = [];
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
      state.appStep = AppStep.IngredientsSelection;
    });
    builder.addCase(scanImage.rejected, (state, action) => {
      state.isLoadingScan = false;
      state.scanError = action.payload as string;
      state.appStep = AppStep.StepScan;
    });

    // Fetch Recipes
    builder.addCase(fetchRecipes.pending, (state) => {
      state.isLoadingRecipes = true;
      state.analyseError = null;
      state.appStep = AppStep.LoadingGenerate;
    });
    builder.addCase(fetchRecipes.fulfilled, (state, action) => {
      state.isLoadingRecipes = false;
      state.recipes = action.payload;
      state.appStep = AppStep.Results;
    });
    builder.addCase(fetchRecipes.rejected, (state, action) => {
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
