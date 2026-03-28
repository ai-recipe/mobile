import { api } from "./axios";

export async function fetchTranslationsAPI(): Promise<Record<string, string>> {
  const res = await api.get<{ data: Record<string, string> }>("/translations");
  return res.data.data;
}
