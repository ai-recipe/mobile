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
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatGrams: number;
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
  mealType?: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
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

// --- Water intake ---

export interface WaterIntakeEntry {
  id: string;
  amountMl: number;
  loggedAt: string;
}

export interface WaterIntakeSummary {
  date: string;
  totalIntakeMl: number;
  dailyGoalMl: number;
  progressPercentage: number;
  entries: WaterIntakeEntry[];
}

export const fetchWaterIntake = async (params?: { date?: string }) => {
  const response = await api.get<{ data: WaterIntakeSummary }>(
    "/nutrition/water-intake",
    { params: params?.date ? { date: params.date } : undefined },
  );
  return response.data;
};

export const addWaterIntake = async (body: { amountMl: number }) => {
  const response = await api.post<{
    id: string;
    amountMl: number;
    loggedAt: string;
  }>("/nutrition/water-intake", body);
  return response.data;
};

export const deleteWaterIntake = async (id: string) => {
  const response = await api.delete(`/nutrition/water-intake/${id}`);
  return response.data;
};
