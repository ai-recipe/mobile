import { api } from "./axios";

export interface FoodNutritionValue {
  amount: number;
  unit: string;
}

export interface FoodNutrition {
  calories?: FoodNutritionValue;
  protein?: FoodNutritionValue;
  carbohydrates?: FoodNutritionValue;
  fat?: FoodNutritionValue;
  saturatedFat?: FoodNutritionValue;
  fiber?: FoodNutritionValue;
  sugar?: FoodNutritionValue;
  sodium?: FoodNutritionValue;
}

export interface FoodItem {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  brand?: string;
  barcode?: string;
  images: string[];
  categories: string[];
  tags: string[];
  nutrition: FoodNutrition;
  servingSize?: number;
  servingUnit?: string;
  servingsPerContainer?: number;
  allergens: string[];
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isHalal: boolean;
  countryOfOrigin?: string;
}

export interface FoodListParams {
  search?: string;
  page?: number;
  limit?: number;
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isHalal?: boolean;
}

export interface FoodListResponse {
  data: FoodItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function searchFoods(
  params: FoodListParams = {},
): Promise<FoodListResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  query.set("limit", String(params.limit ?? 20));
  if (params.isVegan) query.set("isVegan", "true");
  if (params.isVegetarian) query.set("isVegetarian", "true");
  if (params.isGlutenFree) query.set("isGlutenFree", "true");
  if (params.isHalal) query.set("isHalal", "true");

  const { data } = await api.get<FoodListResponse>(
    `/foods?${query.toString()}`,
  );
  console.log("data", data);
  return data;
}

export async function getFoodById(id: string): Promise<FoodItem> {
  const { data } = await api.get<{ data: FoodItem }>(`/foods/${id}`);
  return data.data;
}

export async function getFoodByBarcode(code: string): Promise<FoodItem> {
  const { data } = await api.get<{ data: FoodItem }>(`/foods/barcode/${code}`);
  return data.data;
}

export async function selectFood(id: string): Promise<FoodItem> {
  const { data } = await api.post<{ data: FoodItem }>(`/foods/select`, { id });
  return data.data;
}
