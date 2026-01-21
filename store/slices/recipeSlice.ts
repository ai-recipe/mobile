import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Recipe {
  id: string;
  title: string;
}

interface RecipeState {
  recipes: Recipe[];
  isLoading: boolean;
}

const initialState: RecipeState = {
  recipes: [],
  isLoading: false,
};

export const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
    },
    setRecipeLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setRecipes, setRecipeLoading } = recipeSlice.actions;

export default recipeSlice.reducer;
