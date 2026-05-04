import { api } from "./axios";
import type { BadgeRarity } from "@/store/slices/gamificationSlice";

export interface BadgeListItem {
  _id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  unlocked: boolean;
  unlockedAt: string | null; // ISO string — null when locked
}

export async function fetchMyBadges(): Promise<BadgeListItem[]> {
  const res = await api.get<{ badges: BadgeListItem[] }>("/badges/me");
  return res.data.badges;
}
