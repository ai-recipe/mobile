export const BRAND = "#f39849";
export const BRAND_LIGHT = "rgba(243,152,73,0.12)";
export const BRAND_GRADIENT: [string, string] = ["#FFB76B", "#F48D4D"];

export const RARITY: Record<
  string,
  { color: string; gradient: [string, string]; label: string }
> = {
  legendary: {
    color: "#f59e0b",
    gradient: ["#fbbf24", "#d97706"],
    label: "⭐ Legendary",
  },
  epic: {
    color: "#a855f7",
    gradient: ["#c084fc", "#7c3aed"],
    label: "💎 Epic",
  },
  rare: {
    color: "#3b82f6",
    gradient: ["#60a5fa", "#2563eb"],
    label: "💙 Rare",
  },
  common: {
    color: "#71717a",
    gradient: ["#a1a1aa", "#52525b"],
    label: "🔘 Common",
  },
};

export const RARITY_FALLBACK = RARITY.common;
