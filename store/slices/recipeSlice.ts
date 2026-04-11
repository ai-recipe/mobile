import {
  addFavorite,
  discoverRecipes,
  RecipeFromAPI,
  RecipeDiscoverSocketPayload,
  removeFavorite,
  type RecipeSuggestion,
} from "@/api/recipe";
import { uploadImageForRecognition, DetectedIngredient } from "@/api/scanImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { setStep } from "./multiStepFormSlice";

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001/api/v1/";
const SOCKET_SERVER = API_BASE.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");

let _recognitionSocket: Socket | null = null;
let _recipesSocket: Socket | null = null;

export const disconnectRecognition = () => {
  _recognitionSocket?.disconnect();
  _recognitionSocket = null;
};

export const disconnectRecipes = () => {
  _recipesSocket?.disconnect();
  _recipesSocket = null;
};

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

// Async thunk for scanning image — socket-based, no polling
export const scanImage = createAsyncThunk(
  "recipe/scanImage",
  async (imageUri: string, { rejectWithValue, dispatch }) => {
    const token = await AsyncStorage.getItem("token");

    return new Promise<string[]>((resolve, reject) => {
      const socket = io(`${SOCKET_SERVER}/recognition`, {
        transports: ["websocket", "polling"],
        auth: { token },
      });
      _recognitionSocket = socket;

      socket.on("connect", async () => {
        try {
          const { jobId } = await uploadImageForRecognition(imageUri);
          socket.emit("subscribe:recognition", { jobId });
        } catch (err: any) {
          socket.disconnect();
          _recognitionSocket = null;
          const backendMessage = err?.response?.data?.error?.message;
          const statusCode = err?.response?.data?.error?.statusCode;
          if (statusCode === 400 && err?.response?.data?.error?.errorCode) {
            reject(new Error(backendMessage ?? "Kota aşıldı veya servis hatası"));
          } else {
            reject(new Error(err?.message ?? backendMessage ?? "Görüntü tarama başarısız, tekrar deneyin"));
          }
        }
      });

      socket.on(
        "recognition:completed",
        (data: { jobId: string; detectionResults: DetectedIngredient[] }) => {
          socket.disconnect();
          _recognitionSocket = null;
          dispatch(setStep(1));
          resolve(data.detectionResults?.map((ing) => ing.ingredientName) ?? []);
        },
      );

      socket.on("recognition:error", (data: { message: string }) => {
        socket.disconnect();
        _recognitionSocket = null;
        reject(new Error(data.message));
      });

      socket.on("connect_error", (err: Error) => {
        socket.disconnect();
        _recognitionSocket = null;
        reject(err);
      });
    }).catch((err) =>
      rejectWithValue(err instanceof Error ? err.message : "Tarama başarısız"),
    ) as Promise<string[]>;
  },
);

// Async thunk for fetching recipes — socket-based, no blocking HTTP
export const discoverRecipesAsync = createAsyncThunk(
  "recipe/discoverRecipesAsync",
  async (
    params: {
      ingredients: string[];
      maxPrepTime: number;
      dietaryPreferences: string[];
    },
    { rejectWithValue },
  ) => {
    const token = await AsyncStorage.getItem("token");

    return new Promise<{ recipes: RecipeFromAPI[]; suggestions: RecipeSuggestion | null }>(
      (resolve, reject) => {
        const socket = io(`${SOCKET_SERVER}/recipes`, {
          transports: ["websocket", "polling"],
          auth: { token },
        });
        _recipesSocket = socket;

        const timeout = setTimeout(() => {
          socket.disconnect();
          _recipesSocket = null;
          reject(new Error("Tarif oluşturma zaman aşımına uğradı, tekrar deneyin"));
        }, 120_000);

        socket.on("connect", async () => {
          try {
            const { requestId } = await discoverRecipes({
              ingredients: params.ingredients,
              maxPrepTime: params.maxPrepTime,
              dietaryPreferences: params.dietaryPreferences,
            });
            socket.emit("subscribe:recipes", { requestId });
          } catch (err: any) {
            clearTimeout(timeout);
            socket.disconnect();
            _recipesSocket = null;
            reject(new Error(err?.response?.data?.message ?? err?.message ?? "Tarif oluşturulamadı"));
          }
        });

        socket.on("recipes:completed", (data: RecipeDiscoverSocketPayload) => {
          clearTimeout(timeout);
          socket.disconnect();
          _recipesSocket = null;
          resolve({ recipes: data.recipes, suggestions: null });
        });

        socket.on("recipes:error", (data: { message: string }) => {
          clearTimeout(timeout);
          socket.disconnect();
          _recipesSocket = null;
          reject(new Error(data.message));
        });

        socket.on("connect_error", (err: Error) => {
          clearTimeout(timeout);
          socket.disconnect();
          _recipesSocket = null;
          reject(err);
        });
      },
    ).catch((err) =>
      rejectWithValue(err instanceof Error ? err.message : "Tarif oluşturulamadı"),
    ) as Promise<{ recipes: RecipeFromAPI[]; suggestions: RecipeSuggestion | null }>;
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
      console.log("error", JSON.stringify(error, null, 2));
      console.log("error message", error?.response);
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
      disconnectRecognition();
      disconnectRecipes();
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
      const recipe = state.recipes.find((r) => r._id === recipeId);
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
      const recipe = state.recipes.find((r) => r._id === recipeId);
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
