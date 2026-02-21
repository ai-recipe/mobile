import { DailySummary, FoodLogEntry } from "@/api/nutrition";
import { AnimatedCircleProgress } from "@/components/AnimatedCircleProgress";
import { Colors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
          {items.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => onEditMeal(entry)}
              className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <View className="flex-col">
                  <Text className="text-zinc-900 dark:text-white font-bold">
                    {entry.mealName}
                  </Text>
                  <Text className="text-zinc-500 text-xs mt-0.5">
                    {entry.quantity} servings •{" "}
                    {format(parseISO(entry.loggedAt), "HH:mm")}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <Text className="text-zinc-900 dark:text-white font-bold">
                  {entry.calories} kcal
                </Text>
                <View className="flex-row gap-1">
                  <Pressable
                    onPress={() => onEditMeal(entry)}
                    className="p-1.5 rounded-full active:bg-zinc-100 dark:active:bg-zinc-800"
                  >
                    <MaterialIcons
                      name="edit"
                      size={18}
                      color={colorScheme === "dark" ? "#71717a" : "#a1a1aa"}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => onDeleteMeal(entry.id)}
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
          ))}
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
              router.push("/profile/nutrition-goals");
            }}
          >
            <Text className="text-primary dark:text-white font-bold text-base">
              Edit Nutrition Goals
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
              calories consumed
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
          title="Protein"
        />
        <MacrosCard
          consumedValue={Math.round(summary?.totalCarbsGrams || 0)}
          goalValue={Math.round(summary?.targetCarbsGrams || 0)}
          unit="g"
          progressColor={themeColors.primary}
          exceedColor={themeColors.error}
          trackColor={trackColor}
          title="Carbs"
        />
        <MacrosCard
          consumedValue={Math.round(summary?.totalFatGrams || 0)}
          goalValue={Math.round(summary?.targetFatGrams || 0)}
          unit="g"
          progressColor={themeColors.primary}
          exceedColor={themeColors.error}
          trackColor={trackColor}
          title="Fat"
        />
      </View>
      {/* Entries List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#f39849" className="my-10" />
      ) : entries.length > 0 ? (
        <View className="pb-10">
          <MealSection
            title="Breakfast"
            icon="wb-sunny"
            items={groupedEntries.BREAKFAST}
            color={themeColors.primary}
          />
          <MealSection
            title="Lunch"
            icon="restaurant"
            items={groupedEntries.LUNCH}
            color={themeColors.primary}
          />
          <MealSection
            title="Dinner"
            icon="nights-stay"
            items={groupedEntries.DINNER}
            color={themeColors.primary}
          />
          <MealSection
            title="Snacks"
            icon="fastfood"
            items={groupedEntries.SNACK}
            color={themeColors.primary}
          />
        </View>
      ) : (
        <View className="flex-col items-center justify-center py-12 gap-4">
          <Text className="text-zinc-500 dark:text-zinc-400 text-base font-normal max-w-[250px] text-center leading-relaxed">
            You haven't consumed anything this day.
          </Text>
          <Text className="text-4xl">😋</Text>
        </View>
      )}
    </>
  );
};
