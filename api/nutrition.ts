import { api } from "./axios";

export interface FoodLogEntry {
  id: string;
  mealName: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  quantity: number;
  loggedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailySummary {
  totalCalories: number;
  totalProteinGrams: number;
  totalCarbsGrams: number;
  totalFatGrams: number;
}

export interface FoodLogResponse {
  data: {
    startDate: string;
    endDate: string;
    summary: DailySummary;
    days: {
      date: string;
      summary: DailySummary;
      entries: FoodLogEntry[];
    }[];
  };
  statusCode: number;
  timestamp: string;
}

export interface AddFoodLogParams {
  mealName: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  quantity: number;
  loggedAt?: string;
}

export const fetchFoodLogs = async (params?: {
  startDate?: string;
  endDate?: string;
}) => {
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
