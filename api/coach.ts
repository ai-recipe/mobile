import { api } from "./axios";

export interface CoachInsight {
  title: string;
  message: string;
}

export async function fetchCoachInsight(): Promise<CoachInsight | null> {
  const res = await api.get<{ insight: CoachInsight | null }>("/coach/insight");
  return res.data.insight;
}

export async function postHeartbeat(): Promise<void> {
  await api.post("/coach/heartbeat");
}
