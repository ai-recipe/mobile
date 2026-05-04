import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMyBadgesAsync } from "@/store/slices/badgesSlice";
import { Skeleton } from "@/components/Skeleton";
import type { BadgeListItem } from "@/api/badges";
import type { BadgeRarity } from "@/store/slices/gamificationSlice";

// ─── Rarity ring colors (static strings required by NativeWind) ──────────────
const RARITY_RING: Record<BadgeRarity, string> = {
  common: "border-zinc-200 dark:border-zinc-700",
  rare: "border-blue-300 dark:border-blue-600",
  epic: "border-purple-300 dark:border-purple-600",
  legendary: "border-amber-300 dark:border-amber-500",
};

const RARITY_BG: Record<BadgeRarity, string> = {
  common: "bg-zinc-100 dark:bg-zinc-800",
  rare: "bg-blue-50 dark:bg-blue-900/30",
  epic: "bg-purple-50 dark:bg-purple-900/30",
  legendary: "bg-amber-50 dark:bg-amber-900/30",
};

// ─── Single badge cell ────────────────────────────────────────────────────────
function BadgeCell({ item }: { item: BadgeListItem }) {
  const rarity = item.rarity ?? "common";
  const ring = RARITY_RING[rarity];
  const bg = RARITY_BG[rarity];

  return (
    <View className="w-1/3 p-1.5">
      <View
        className={`
          rounded-2xl border-2 p-3 items-center gap-y-1.5
          ${bg} ${ring}
          ${item.unlocked ? "opacity-100" : "opacity-40"}
        `}
      >
        {/* Icon */}
        <View className="relative">
          <Text className="text-3xl">{item.icon}</Text>
          {/* Lock overlay for locked badges */}
          {!item.unlocked && (
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-lg">🔒</Text>
            </View>
          )}
        </View>

        {/* Name — two-line cap keeps the grid uniform */}
        <Text
          numberOfLines={2}
          className="text-[10px] font-semibold text-center text-zinc-700 dark:text-zinc-300 leading-tight"
        >
          {item.name}
        </Text>
      </View>
    </View>
  );
}

// ─── Skeleton grid shown while loading ───────────────────────────────────────
function TrophyRoomSkeleton() {
  return (
    <View className="flex-row flex-wrap">
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} className="w-1/3 p-1.5">
          <Skeleton height={100} borderRadius={16} />
        </View>
      ))}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TrophyRoom() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((s) => s.badges);

  useEffect(() => {
    // Only fetch once per session; a pull-to-refresh can force a re-fetch
    // by dispatching fetchMyBadgesAsync directly from the parent.
    if (status === "idle") {
      dispatch(fetchMyBadgesAsync());
    }
  }, [status, dispatch]);

  const unlockedCount = items.filter((b) => b.unlocked).length;

  return (
    <View className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-bold text-zinc-900 dark:text-white">
          🏆 Trophy Room
        </Text>
        {status === "succeeded" && items.length > 0 && (
          <Text className="text-xs text-zinc-400 dark:text-zinc-500">
            {unlockedCount}/{items.length} unlocked
          </Text>
        )}
      </View>

      {/* Content */}
      {status === "loading" && <TrophyRoomSkeleton />}

      {status === "failed" && (
        <Text className="text-sm text-center text-zinc-400 dark:text-zinc-500 py-4">
          Could not load badges. Pull down to retry.
        </Text>
      )}

      {status === "succeeded" && items.length === 0 && (
        <Text className="text-sm text-center text-zinc-400 dark:text-zinc-500 py-4">
          No badges yet — start scanning meals!
        </Text>
      )}

      {status === "succeeded" && items.length > 0 && (
        <View className="flex-row flex-wrap">
          {items.map((item) => (
            <BadgeCell key={item._id} item={item} />
          ))}
        </View>
      )}
    </View>
  );
}
