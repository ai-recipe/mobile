import { DailySummary, FoodLogEntry } from "@/api/nutrition";
import { AnimatedCircleProgress } from "@/components/AnimatedCircleProgress";
import { EmptyMealState } from "@/components/EmptyMealState";
import { Colors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCAN_IMAGE_BASE = "https://api.recipetrack.tech";

function isPendingScan(entry: FoodLogEntry): boolean {
  return entry.status === "pending_scan";
}

function isFailedScan(entry: FoodLogEntry): boolean {
  return entry.status === "failed_scan";
}

interface MealActivityTabProps {
  consumedCalories: number;
  calorieGoal: number;
  calorieProgress: number;
  trackColor: string;
  themeColors: any;
  colorScheme: "light" | "dark";
  summary: DailySummary;
  isLoading: boolean;
  entries: FoodLogEntry[];
  groupedEntries: { [key: string]: FoodLogEntry[] };
  onEditMeal: (entry: FoodLogEntry) => void;
  onDeleteMeal: (id: string) => void;
}

const MacrosCard = ({
  consumedValue,
  goalValue,
  title,
  progressColor,
  exceedColor,
  trackColor,
  unit,
}: {
  consumedValue: number;
  goalValue: number;
  unit: string;
  title: string;
  progressColor: string;
  exceedColor: string;
  trackColor: string;
}) => {
  const progress = goalValue > 0 ? (consumedValue / goalValue) * 100 : 0;
  return (
    <View className="bg-white dark:bg-zinc-900 rounded-3xl p-2 border border-zinc-100 dark:border-zinc-800 flex-1">
      <View className="flex-row items-center justify-center w-full">
        <View className="relative items-center justify-center">
          <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
            {title}
          </Text>
          <AnimatedCircleProgress
            progress={progress}
            trackColor={trackColor}
            progressColor={progressColor}
            exceedColor={exceedColor}
            size={50}
            radius={20}
            strokeWidth={6}
          />
          <View className="flex-column items-center mt-4">
            <Text className="text-lg font-semibold text-zinc-900 dark:text-white">
              {Math.round(consumedValue)} {unit}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-xm font-light text-zinc-300 dark:text-zinc-600">
                /
              </Text>
              <Text className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">
                {goalValue} {unit}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export const MealActivityTab: React.FC<MealActivityTabProps> = ({
  consumedCalories,
  calorieGoal,
  calorieProgress,
  trackColor,
  themeColors,
  colorScheme,
  summary,
  isLoading,
  entries,
  groupedEntries,
  onEditMeal,
  onDeleteMeal,
}) => {
  const { t } = useTranslation();
  const MealSection = ({
    title,
    icon,
    items,
    color,
  }: {
    title: string;
    icon: any;
    items: FoodLogEntry[];
    color: string;
  }) => {
    if (items.length === 0) return null;

    return (
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4 px-2">
          <View className="flex-row items-center gap-2">
            <View
              className="w-8 h-8 rounded-lg items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <MaterialIcons name={icon} size={18} color={color} />
            </View>
            <Text className="text-base font-bold text-zinc-900 dark:text-white">
              {title}
            </Text>
          </View>
        </View>
        <View className="gap-3">
          {items.map((entry) => {
            const pending = isPendingScan(entry);
            const failed = isFailedScan(entry);
            console.log(entry.imageUrl);
            const showImage = !!entry.imageUrl || pending;

            // Pending scan: reference-style card (white, rounded-3xl, 16x16 thumb, spinner, subtitle)
            if (pending) {
              return (
                <View
                  key={entry.id}
                  className="bg-white dark:bg-zinc-900 rounded-3xl border-2 border-zinc-100 dark:border-zinc-800 p-4 flex-row items-center gap-4 "
                >
                  <View className="flex-shrink-0">
                    {entry.imageUrl ? (
                      <View className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          source={{ uri: entry.imageUrl }}
                          className="w-full h-full"
                          resizeMode="cover"
                          style={{ opacity: 0.7 }}
                        />
                        <View
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            backgroundColor: `${themeColors.primary}20`,
                          }}
                        />
                      </View>
                    ) : (
                      <View
                        className="w-16 h-16 rounded-2xl items-center justify-center"
                        style={{
                          backgroundColor: `${themeColors.primary}15`,
                        }}
                      >
                        <MaterialIcons
                          name="restaurant"
                          size={32}
                          color={themeColors.primary}
                        />
                      </View>
                    )}
                  </View>
                  <View className="flex-1 min-w-0">
                    <View className="flex-row items-center gap-2">
                      <Text
                        className="text-lg font-bold flex-shrink"
                        style={{ color: themeColors.primary }}
                        numberOfLines={1}
                      >
                        {t("scanner.analyzingMeal")}
                      </Text>
                      <ActivityIndicator
                        size="small"
                        color={themeColors.primary}
                      />
                    </View>
                    <Text className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {t("scanner.calculatingNutrients")}
                    </Text>
                  </View>
                  <View className="flex-shrink-0 items-end">
                    <Text className="text-zinc-400 dark:text-zinc-500 font-medium">
                      —
                    </Text>
                    <Text className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      kcal
                    </Text>
                  </View>
                </View>
              );
            }

            // Failed scan: show error state with image and cool placeholder
            if (failed) {
              return (
                <View
                  key={entry.id}
                  className="bg-white dark:bg-zinc-900 rounded-3xl border-2 border-red-100 dark:border-red-900 p-4 flex-row items-center gap-4"
                >
                  <View className="flex-shrink-0 relative">
                    {entry.imageUrl ? (
                      <View className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          source={{ uri: entry.imageUrl }}
                          className="w-full h-full"
                          resizeMode="cover"
                          style={{ opacity: 0.4 }}
                        />
                        <View className="absolute inset-0 rounded-2xl items-center justify-center bg-red-100 dark:bg-red-900/30">
                          <MaterialIcons
                            name="image-not-supported"
                            size={28}
                            color="#ef4444"
                          />
                        </View>
                      </View>
                    ) : (
                      <View
                        className="w-16 h-16 rounded-2xl items-center justify-center"
                        style={{
                          backgroundColor: "rgba(239,68,68,0.1)",
                        }}
                      >
                        <MaterialIcons
                          name="image-not-supported"
                          size={28}
                          color="#ef4444"
                        />
                      </View>
                    )}
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text
                      className="text-lg font-bold flex-shrink text-red-600 dark:text-red-400"
                      numberOfLines={1}
                    >
                      {t("scanner.scanFailedText")}
                    </Text>
                    <Text className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {t("scanner.scanFailedHint")}
                    </Text>
                  </View>
                  <View className="flex-shrink-0 items-end">
                    <View className="flex-row gap-1">
                      <Pressable
                        onPress={(e) => {
                          e?.stopPropagation?.();
                          onEditMeal(entry);
                        }}
                        className="p-1.5 rounded-full active:bg-zinc-100 dark:active:bg-zinc-800"
                      >
                        <MaterialIcons
                          name="edit"
                          size={18}
                          color={colorScheme === "dark" ? "#71717a" : "#a1a1aa"}
                        />
                      </Pressable>
                      <Pressable
                        onPress={(e) => {
                          e?.stopPropagation?.();
                          onDeleteMeal(entry.id);
                        }}
                        className="p-1.5 rounded-full active:bg-zinc-100 dark:active:bg-zinc-800"
                      >
                        <MaterialIcons
                          name="delete-outline"
                          size={18}
                          color="#ef4444"
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            }

            return (
              <Pressable
                key={entry.id}
                onPress={() => onEditMeal(entry)}
                className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex-row items-center"
              >
                {/* Image */}
                {showImage && entry.imageUrl ? (
                  <View className="mr-3 flex-shrink-0">
                    <Image
                      source={{ uri: entry.imageUrl }}
                      className="w-12 h-12 rounded-xl"
                      resizeMode="cover"
                    />
                  </View>
                ) : null}

                {/* Content */}
                <View className="flex-1 min-w-0 mr-3 justify-center">
                  <View className="flex-row items-center gap-2 flex-wrap">
                    <Text
                      className="text-zinc-900 dark:text-white font-bold flex-shrink"
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {entry.mealName || t("scanner.scanning")}
                    </Text>
                  </View>
                  <Text
                    className="text-zinc-500 text-xs mt-0.5"
                    numberOfLines={1}
                  >
                    {entry.quantity} {t("common.servings")} •{" "}
                    {format(parseISO(entry.loggedAt), "HH:mm")}
                  </Text>
                </View>

                {/* Calories + actions */}
                <View className="flex-row items-center gap-2 flex-shrink-0">
                  <Text
                    className="text-zinc-900 dark:text-white font-bold"
                    numberOfLines={1}
                  >
                    {entry.calories} kcal
                  </Text>
                  <View className="flex-row gap-1">
                    <Pressable
                      onPress={(e) => {
                        e?.stopPropagation?.();
                        onEditMeal(entry);
                      }}
                      className="p-1.5 rounded-full active:bg-zinc-100 dark:active:bg-zinc-800"
                    >
                      <MaterialIcons
                        name="edit"
                        size={18}
                        color={colorScheme === "dark" ? "#71717a" : "#a1a1aa"}
                      />
                    </Pressable>
                    <Pressable
                      onPress={(e) => {
                        e?.stopPropagation?.();
                        onDeleteMeal(entry.id);
                      }}
                      className="p-1.5 rounded-full active:bg-zinc-100 dark:active:bg-zinc-800"
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={18}
                        color="#ef4444"
                      />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <>
      <View className="mb-4">
        <TouchableOpacity
          className="flex-row items-center gap-2 ml-auto"
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="edit"
            size={18}
            color={Colors[colorScheme].primary}
          />
          <Pressable
            onPress={() => {
              router.push("/profile/nutrition-goals?from=progress");
            }}
          >
            <Text className="text-primary dark:text-white font-bold text-base">
              {t("home.editNutritionGoals")}
            </Text>
          </Pressable>
        </TouchableOpacity>
      </View>
      <View className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 mb-6">
        {/* Circular Progress with Calories */}
        <View className="flex-column items-center justify-center w-full">
          {/* SVG Circle */}
          <View className="relative w-24 h-24 mr-6 items-center justify-center">
            <AnimatedCircleProgress
              progress={calorieProgress}
              trackColor={trackColor}
              progressColor={themeColors.primary}
              exceedColor={themeColors.error}
              strokeWidth={10}
              icon={
                <MaterialIcons
                  name="local-fire-department"
                  size={24}
                  color={themeColors.primary}
                />
              }
            />
          </View>

          {/* Calorie Numbers */}
          <View className="flex-column items-center justify-center gap-2 mt-4">
            <View className="flex-row items-center justify-center">
              <View className="flex-row items-baseline gap-1">
                <Text className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {Math.round(consumedCalories)}
                </Text>
                <Text className="text-xl font-light text-zinc-300 dark:text-zinc-600">
                  /
                </Text>
              </View>
              <Text className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">
                {calorieGoal}
              </Text>
            </View>
            <Text className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              {t("home.caloriesConsumed")}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex flex-row gap-4 mb-6">
        <MacrosCard
          consumedValue={Math.round(summary?.totalProteinGrams || 0)}
          goalValue={Math.round(summary?.targetProteinGrams || 0)}
          unit="g"
          progressColor={themeColors.primary}
          exceedColor={themeColors.error}
          trackColor={trackColor}
          title={t("mealEntry.protein")}
        />
        <MacrosCard
          consumedValue={Math.round(summary?.totalCarbsGrams || 0)}
          goalValue={Math.round(summary?.targetCarbsGrams || 0)}
          unit="g"
          progressColor={themeColors.primary}
          exceedColor={themeColors.error}
          trackColor={trackColor}
          title={t("mealEntry.carbs")}
        />
        <MacrosCard
          consumedValue={Math.round(summary?.totalFatGrams || 0)}
          goalValue={Math.round(summary?.targetFatGrams || 0)}
          unit="g"
          progressColor={themeColors.primary}
          exceedColor={themeColors.error}
          trackColor={trackColor}
          title={t("mealEntry.fat")}
        />
      </View>
      {/* Entries List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#f39849" className="my-10" />
      ) : entries.length > 0 ? (
        <View className="pb-10">
          <MealSection
            title={t("home.breakfast")}
            icon="wb-sunny"
            items={groupedEntries.BREAKFAST}
            color={themeColors.primary}
          />
          <MealSection
            title={t("home.lunch")}
            icon="restaurant"
            items={groupedEntries.LUNCH}
            color={themeColors.primary}
          />
          <MealSection
            title={t("home.dinner")}
            icon="nights-stay"
            items={groupedEntries.DINNER}
            color={themeColors.primary}
          />
          <MealSection
            title={t("home.snacks")}
            icon="fastfood"
            items={groupedEntries.SNACK}
            color={themeColors.primary}
          />
        </View>
      ) : (
        <EmptyMealState />
      )}
    </>
  );
};
