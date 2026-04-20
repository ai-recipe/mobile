import { Skeleton } from "@/components/Skeleton";
import React from "react";
import { View } from "react-native";

const CARD_IMAGE_HEIGHT = 192;
const CARD_TITLE_HEIGHT = 22;
const CARD_DESC_LINE_HEIGHT = 14;
const CARD_META_HEIGHT = 12;

export function FavoritesSkeleton() {
  return (
    <View className="flex-1 bg-white dark:bg-zinc-900 px-5 pt-4 pb-6">
      {/* Header title */}
      <View className="mb-2">
        <Skeleton width={240} height={36} borderRadius={10} />
      </View>
      {/* Subtitle */}
      <View className="mb-8">
        <Skeleton width="100%" height={16} borderRadius={6} />
        <Skeleton
          width="85%"
          height={16}
          borderRadius={6}
          style={{ marginTop: 6 }}
        />
      </View>

      {/* Recipe cards - full width list */}
      {[1, 2, 3, 4].map((i) => (
        <View key={i} className="mb-6">
          <Skeleton
            width="100%"
            height={CARD_IMAGE_HEIGHT}
            borderRadius={20}
          />
          <View className="p-5">
            <Skeleton
              width="90%"
              height={CARD_TITLE_HEIGHT}
              borderRadius={8}
              style={{ marginBottom: 12 }}
            />
            <Skeleton
              width="100%"
              height={CARD_DESC_LINE_HEIGHT}
              borderRadius={6}
              style={{ marginBottom: 6 }}
            />
            <Skeleton
              width="75%"
              height={CARD_DESC_LINE_HEIGHT}
              borderRadius={6}
              style={{ marginBottom: 12 }}
            />
            <View className="flex-row gap-6">
              <Skeleton width={60} height={CARD_META_HEIGHT} borderRadius={4} />
              <Skeleton width={50} height={CARD_META_HEIGHT} borderRadius={4} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
