import { api } from "./axios";
import { PaginationMeta } from "./list";

const ANALYSE_IMAGE_WEBHOOK =
  "https://n8n-production-cf278.up.railway.app/webhook/analyse-image";

export interface RecipeFromAPI {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  servings: number;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  dietaryTags: string[];
  nutritionSummary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  isFavorite?: boolean;
  isTrending?: boolean;
}

export interface RecipeListItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  totalTimeMinutes: number;
  imageUrl: string | null;
  isFavorite?: boolean;
  isTrending?: boolean;
}

export interface RecipeListResponse {
  data: RecipeListItem[];
  meta: PaginationMeta;
  statusCode: number;
  timestamp: string;
}

export interface FavoriteItem {
  id: string;
  recipeId: string;
  createdAt: string;
}

export interface FavoritesResponse {
  data: RecipeListItem[];
  meta: PaginationMeta;
  statusCode: number;
  timestamp: string;
}

export interface PersonalizedRecipesResponse {
  data: RecipeListItem[];
  meta: PaginationMeta;
  statusCode: number;
  timestamp: string;
}

export interface RecipeSuggestion {
  additionalIngredients: string[];
  tip: string;
}

export interface RecipeDiscoverResponse {
  data: {
    requestId: string;
    recipes: RecipeFromAPI[];
    suggestions: RecipeSuggestion;
    processingTimeMs: number;
  };
}

export interface DiscoverRecipesParams {
  ingredients: string[];
  maxPrepTime?: number;
  dietaryPreferences?: string[];
}

export interface AnalyseImageResponse {
  recipes: RecipeFromAPI[];
}

export interface AnalyseImageParams {
  imageUrl: string;
  ingredients?: string[];
  timeMinutes?: number;
}

export async function discoverRecipes(
  params: DiscoverRecipesParams,
): Promise<RecipeDiscoverResponse> {
  const response = await api.post<RecipeDiscoverResponse>(
    "/recipes/discover",
    params,
  );

  return response.data;
}

export async function fetchRecipeList(params: {
  title?: string;
  description?: string;
  perPage?: PaginationMeta["perPage"];
  page?: PaginationMeta["page"];
}): Promise<RecipeListResponse> {
  const response = await api.get<RecipeListResponse>("/recipes", {
    params,
  });
  return response.data;
}

export async function fetchFavorites(params?: {
  perPage?: PaginationMeta["perPage"];
  page?: PaginationMeta["page"];
}): Promise<FavoritesResponse> {
  const response = await api.get<FavoritesResponse>("/recipes/favorites", {
    params,
  });
  return response.data;
}

export async function fetchPersonalizedRecipes(params?: {
  perPage?: PaginationMeta["perPage"];
  page?: PaginationMeta["page"];
}): Promise<PersonalizedRecipesResponse> {
  const response = await api.get<PersonalizedRecipesResponse>(
    "/recipes/personalized",
    {
      params,
    },
  );
  return response.data;
}

export async function analyseImage({
  imageUrl,
  ingredients = [],
  timeMinutes,
}: AnalyseImageParams): Promise<AnalyseImageResponse> {
  const url = new URL(ANALYSE_IMAGE_WEBHOOK);
  url.searchParams.set("image_url", imageUrl);
  if (ingredients.length > 0) {
    url.searchParams.set("ingredients", ingredients.join(","));
  }
  if (timeMinutes != null) {
    url.searchParams.set("time_minutes", String(timeMinutes));
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(ingredients.length > 0 && { "X-Ingredients": ingredients.join(",") }),
    ...(timeMinutes != null && { "X-Time-Minutes": String(timeMinutes) }),
  };

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `Analyse image failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as AnalyseImageResponse;
  return data;
}

export async function addFavorite(recipeId: string): Promise<void> {
  const response = await api.post("/recipes/favorites", { recipeId });
  return response.data;
}

export async function removeFavorite(recipeId: string): Promise<void> {
  const response = await api.delete(`/recipes/favorites/${recipeId}`);
  return response.data;
}
