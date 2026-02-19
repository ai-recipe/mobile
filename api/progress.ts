import { api } from "./axios";
export interface CalorieIntakeDailyBreakdown {
  date: string;
  totalCalories: number;
  totalProteinGrams: number;
  totalCarbsGrams: number;
  totalFatGrams: number;
}

export interface WaterIntakeDailyBreakdown {
  date: string;
  totalMl: number;
  targetWaterMl: number;
}

export interface WeightTrendDailyBreakdown {
  date: string;
  weightKg: number;
  targetWeightKg: number;
}

export interface ProgressData {
  startDate: string;
  endDate: string;
  calorieIntake: {
    avgPerDay: number;
    targetPerDay: number;
    changePercentage: number;
    dailyBreakdown: CalorieIntakeDailyBreakdown[];
  };
  waterIntake: {
    avgPerDayMl: number;
    dailyGoalMl: number;
    goalAchievementPercentage: number;
    dailyBreakdown: WaterIntakeDailyBreakdown[];
  };
  weightTrend: {
    currentKg: number;
    targetKg: number;
    changeKg: number;
    bmi: number;
    heightCm: number;
    dailyBreakdown: WeightTrendDailyBreakdown[];
  };
}
export const fetchProgressData = async (payload: {
  startDate: string;
  endDate: string;
}) => {
  const response = await api.get<{ data: ProgressData }>(
    "/nutrition/progress",
    {
      params: {
        startDate: payload.startDate,
        endDate: payload.endDate,
      },
    },
  );
  return response.data;
};
