import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

export const EmptyMealState = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  return (
    <View className="px-6">
      <View
        className="rounded-3xl border border-zinc-100 dark:border-zinc-800 px-6 py-12 flex-col items-center justify-center gap-6"
        style={{
          backgroundColor: colors.background,
        }}
      >
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

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-4">
          {/* Scan Meal Button */}
          <Pressable
            onPress={() => router.push("/screens/add-options")}
            className="flex-row items-center gap-2 px-4 py-3 rounded-full"
            style={{
              backgroundColor: colors.primary,
            }}
          >
            <MaterialIcons name="camera-alt" size={18} color="white" />
            <Text className="text-sm font-semibold text-white">
              {t("scanner.takePhoto")}
            </Text>
          </Pressable>

          {/* Manual Log Button */}
          <Pressable
            onPress={() => router.push("/screens/add-options")}
            className="flex-row items-center gap-2 px-4 py-3 rounded-full border"
            style={{
              borderColor: colors.primary,
              backgroundColor: `${colors.primary}10`,
            }}
          >
            <MaterialIcons name="add" size={18} color={colors.primary} />
            <Text
              className="text-sm font-semibold"
              style={{ color: colors.primary }}
            >
              {t("mealEntry.addToDiary")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
