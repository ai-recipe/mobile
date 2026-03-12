import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const EmptyMealState = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  return (
    <View className="px-1 ">
      <View className="rounded-3xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-6 py-12 flex-col items-center justify-center gap-6">
        {/* Icon Container */}
        <View
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{
            backgroundColor: `${colors.primary}15`,
          }}
        >
          <MaterialIcons name="restaurant" size={40} color={colors.primary} />
        </View>

        {/* Main Text */}
        <View className="items-center gap-2">
          <Text
            className="text-xl font-bold text-center"
            style={{ color: colors.text }}
          >
            {t("home.noMealsLogged")}
          </Text>
          <Text
            className="text-sm text-center max-w-[280px] leading-relaxed"
            style={{ color: `${colors.text}99` }}
          >
            {t("home.noMealsHint")}
          </Text>
        </View>
      </View>
    </View>
  );
};
