import { api } from "./axios";

export const fetchDashboardData = async (date: string) => {
  const response = await api.get("/dashboard", {
    params: {
      date,
    },
  });
  return response.data;
};
