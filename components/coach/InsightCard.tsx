import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { Skeleton } from "@/components/Skeleton";
import { Colors } from "@/constants/theme";
import { BRAND, BRAND_GRADIENT, BRAND_LIGHT } from "./constants";

export function InsightCard({
  title,
  message,
  loading,
  theme,
  isDark,
}: {
  title?: string | null;
  message?: string | null;
  loading: boolean;
  theme: typeof Colors.light;
  isDark: boolean;
}) {
  const { t } = useTranslation();
  if (loading && !title) {
    return (
      <View
        className="rounded-[20px] border p-4 overflow-hidden"
        style={{
          backgroundColor: isDark ? "#18181b" : "#ffffff",
          borderColor: theme.border,
        }}
      >
        <View className="flex-row gap-3 items-start">
          <Skeleton width={44} height={44} borderRadius={22} />
          <View className="flex-1 gap-2">
            <Skeleton width="55%" height={14} borderRadius={6} />
            <Skeleton width="90%" height={11} borderRadius={5} />
            <Skeleton width="72%" height={11} borderRadius={5} />
          </View>
        </View>
      </View>
    );
  }

  if (!title) {
    return (
      <View
        className="rounded-[20px] border p-4 overflow-hidden flex-row items-center gap-3"
        style={{
          backgroundColor: isDark ? "#18181b" : "#ffffff",
          borderColor: theme.border,
        }}
      >
        <View
          className="w-11 h-11 rounded-full items-center justify-center shrink-0"
          style={{ backgroundColor: BRAND_LIGHT }}
        >
          <MaterialIcons name="psychology" size={22} color={BRAND} />
        </View>
        <View className="flex-1">
          <Text
            className="text-[15px] font-extrabold mb-1 tracking-tight"
            style={{ color: theme.text }}
          >
            {t("coach.insightCard.readyTitle")}
          </Text>
          <Text
            className="text-[13px] leading-[19px] font-medium"
            style={{ color: theme.muted }}
          >
            {t("coach.insightCard.readyHint")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      className="rounded-[20px] border p-4 overflow-hidden"
      style={{
        borderColor: BRAND + "30",
        backgroundColor: isDark ? "#1a1208" : "#fffbf5",
      }}
    >
      <View
        className="absolute -top-6 -right-6 w-[100px] h-[100px] rounded-full"
        style={{ backgroundColor: BRAND, opacity: 0.08 }}
        pointerEvents="none"
      />
      <View className="flex-row items-start gap-3">
        <LinearGradient
          colors={BRAND_GRADIENT}
          className="w-11 h-11 rounded-full items-center justify-center shrink-0"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name="psychology" size={22} color="#fff" />
        </LinearGradient>
        <View className="flex-1">
          <Text
            className="text-[15px] font-extrabold mb-1 tracking-tight"
            style={{ color: theme.text }}
          >
            {title}
          </Text>
          <Text
            className="text-[13px] leading-[19px] font-medium"
            style={{ color: theme.muted }}
          >
            {message}
          </Text>
        </View>
      </View>
    </View>
  );
}
