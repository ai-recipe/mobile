import { api } from "./axios";

export const fetchProgressData = async (date: string) => {
  const response = await api.get("/progress");
  return response.data;
};
