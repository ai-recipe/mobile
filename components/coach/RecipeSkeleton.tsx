import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/Skeleton";

export function RecipeSkeleton() {
  return (
    <View className="w-[216px] rounded-[18px] overflow-hidden mr-3">
      <Skeleton width="100%" height={130} borderRadius={0} />
      <View className="p-3 gap-2">
        <Skeleton width="75%" height={13} borderRadius={5} />
        <Skeleton width="40%" height={9} borderRadius={4} />
      </View>
    </View>
  );
}
