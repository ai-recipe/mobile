import { api } from "./axios";

export interface GoalPlan {
  id: string;
  userId: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  targetWeightKg: number | null;
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  targetWaterMl: number;
  metadata: {
    source?: string;
    calorieGoal?: string;
    activityLevel?: string;
    goalIntensity?: string;
  };
  createdAt?: string;
}

export interface GoalPlanActiveResponse {
  data: GoalPlan;
  statusCode: number;
  timestamp: string;
}

export const getGoalPlanActiveAPI =
  async (): Promise<GoalPlanActiveResponse> => {
    const response = await api.get("/nutrition/goal-plans/active");
    return response.data;
  };

export const postGoalPlanLog = async (payload: {
  targetWeightKg?: number;
  targetCalories?: number;
  targetProteinG?: number;
  targetCarbsG?: number;
  targetFatG?: number;
  targetWaterMl?: number;
}) => {
  const response = await api.post("/nutrition/goal-plans", payload);
  return response.data;
};
