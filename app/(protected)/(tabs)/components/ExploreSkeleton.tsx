import { Skeleton } from "@/components/Skeleton";
import React from "react";
import { View } from "react-native";

const CARD_IMAGE_HEIGHT = 140;
const CARD_TEXT_HEIGHT = 14;
const CARD_META_HEIGHT = 10;

export function ExploreSkeleton() {
  return (
    <View className="flex-1 bg-white dark:bg-zinc-900 px-5 pt-4 pb-6">
      {/* Search bar */}
      <View className="mb-8">
        <Skeleton width="100%" height={52} borderRadius={16} />
      </View>

      {/* Category pills */}
      <View className="flex-row gap-3 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            width={i === 1 ? 72 : 88}
            height={40}
            borderRadius={16}
          />
        ))}
      </View>

      {/* Trend section title */}
      <View className="mb-4">
        <Skeleton width={140} height={24} borderRadius={8} />
      </View>

      {/* Trend horizontal cards */}
      <View className="flex-row gap-4 mb-10">
        <Skeleton width={280} height={240} borderRadius={24} />
        <Skeleton width={280} height={240} borderRadius={24} />
      </View>

      {/* Recommendations title */}
      <View className="mb-6">
        <Skeleton width={180} height={22} borderRadius={8} />
      </View>

      {/* Recipe grid - 2 columns */}
      <View className="flex-row flex-wrap justify-between" style={{ gap: 16 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View
            key={i}
            style={{
              width: "48%",
              marginBottom: 24,
            }}
          >
            <Skeleton
              width="100%"
              height={CARD_IMAGE_HEIGHT}
              borderRadius={20}
            />
            <Skeleton
              width="90%"
              height={CARD_TEXT_HEIGHT}
              borderRadius={6}
              style={{ marginTop: 12 }}
            />
            <Skeleton
              width="60%"
              height={CARD_META_HEIGHT}
              borderRadius={4}
              style={{ marginTop: 8 }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
