import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { MaterialIcons } from "@expo/vector-icons";
import { SmartImage } from "@/components/SmartImage";
import { Colors } from "@/constants/theme";
import type { RecipeListItem } from "@/api/recipe";
import { BRAND, BRAND_LIGHT } from "./constants";

export function RecipeCard({
  item,
  onPress,
  theme,
  isDark,
}: {
  item: RecipeListItem;
  onPress: (r: RecipeListItem) => void;
  theme: typeof Colors.light;
  isDark: boolean;
}) {
  const { t } = useTranslation();
  const totalMins =
    (item.totalTimeMinutes ?? 0) ||
    ((item as any).prepTimeMinutes ?? 0) + ((item as any).cookTimeMinutes ?? 0);

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => onPress(item)}
      className="w-[216px] rounded-[18px] overflow-hidden mr-3"
      style={{
        backgroundColor: isDark ? "#18181b" : "#ffffff",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.28 : 0.07,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View className="h-[130px] bg-[#e4e4e7] overflow-hidden">
        <SmartImage
          uri={(item as any).imageUrl ?? null}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        {totalMins > 0 && (
          <View
            className="absolute top-2 right-2 flex-row items-center gap-[3px] rounded-full px-2 py-[3px]"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          >
            <MaterialIcons name="timer" size={11} color="#fff" />
            <Text className="text-white text-[10px] font-bold">{totalMins}{t("explore.mins")}</Text>
          </View>
        )}
      </View>
      <View className="p-3 gap-1.5">
        <Text
          numberOfLines={1}
          className="text-[14px] font-bold tracking-tight"
          style={{ color: theme.text }}
        >
          {item.title}
        </Text>
        {item.dietaryTags?.[0] && (
          <View
            className="self-start rounded-[6px] px-2 py-[3px]"
            style={{ backgroundColor: BRAND_LIGHT }}
          >
            <Text
              className="text-[9px] font-extrabold tracking-[0.4px]"
              style={{ color: BRAND }}
            >
              {item.dietaryTags[0].toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
