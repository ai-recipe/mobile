import { Skeleton } from "@/components/Skeleton";
import React from "react";
import { View } from "react-native";

const CARD_IMAGE_HEIGHT = 140;
const CARD_TEXT_HEIGHT = 14;
const CARD_META_HEIGHT = 10;

export function ExploreSkeleton() {
  return (
    <View className="flex-1 bg-white dark:bg-zinc-900 pb-6 pt-6">
      <View
        className="flex-row flex-wrap"
        style={{ paddingHorizontal: 20, gap: 16 }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View
            key={i}
            style={{
              width: "47.5%", // Slightly less than 50% to account for gap wrapping
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
