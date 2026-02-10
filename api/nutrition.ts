import { api } from "./axios";

export interface FoodLogEntry {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  servingAmount: number;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  loggedAt: string;
}

export interface DailySummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface FoodLogResponse {
  data: {
    items: FoodLogEntry[];
    summary: DailySummary;
  };
  statusCode: number;
  timestamp: string;
}

export interface AddFoodLogParams {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  servingAmount: number;
  mealType: string;
  loggedAt?: string;
}

export const fetchFoodLogs = async (params?: { date?: string }) => {
  const response = await api.get<FoodLogResponse>("/nutrition/food-log", {
    params,
  });
  return response.data;
};

export const addFoodLog = async (data: AddFoodLogParams) => {
  const response = await api.post("/nutrition/food-log", data);
  return response.data;
};

export const updateFoodLog = async (
  id: string,
  data: Partial<AddFoodLogParams>,
) => {
  const response = await api.patch(`/nutrition/food-log/${id}`, data);
  return response.data;
};

export const deleteFoodLog = async (id: string) => {
  const response = await api.delete(`/nutrition/food-log/${id}`);
  return response.data;
};
