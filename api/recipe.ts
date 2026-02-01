const ANALYSE_IMAGE_WEBHOOK =
  "https://n8n-production-cf278.up.railway.app/webhook/analyse-image";

export interface RecipeFromAPI {
  recipe_name: string;
  recipe_time: string;
  recipe_difficulty: string;
  why_this_recipe: string;
  recipe_ingredients: string[];
  recipe_steps: string[];
}

export interface AnalyseImageResponse {
  recipes: RecipeFromAPI[];
}

export interface AnalyseImageParams {
  imageUrl: string;
  ingredients?: string[];
  timeMinutes?: number;
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
    throw new Error(`Analyse image failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as AnalyseImageResponse;
  return data;
}
