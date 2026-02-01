import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RecipeFromAPI } from "@/api/recipe";

interface RecipeState {
  formData: {
    image: string;
    ingredients: string[];
    timePreference: number;
    name: string;
    estimatedTime: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    shortSteps: string[];
  };
  recipes: RecipeFromAPI[];
  isLoading: boolean;
  analyseError: string | null;
}

const initialState: RecipeState = {
  recipes: [],
  isLoading: false,
  analyseError: null,
  formData: {
    image: "",
    ingredients: [],
    timePreference: 30,
    name: "",
    estimatedTime: "",
    difficulty: "EASY",
    shortSteps: [],
  },
};

export const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setImage: (state, action: PayloadAction<string>) => {
      state.formData.image = action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<typeof initialState.formData>,
    ) => {
      state.formData = action.payload;
    },
    setRecipes: (state, action: PayloadAction<RecipeFromAPI[]>) => {
      state.recipes = action.payload;
    },
    setRecipeLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAnalyseError: (state, action: PayloadAction<string | null>) => {
      state.analyseError = action.payload;
    },
  },
});

export const {
  setImage,
  setFormData,
  setRecipes,
  setRecipeLoading,
  setAnalyseError,
} = recipeSlice.actions;

export default recipeSlice.reducer;
