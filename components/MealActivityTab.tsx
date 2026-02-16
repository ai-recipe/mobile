import { DailySummary, FoodLogEntry } from "@/api/nutrition";
import { AnimatedCircleProgress } from "@/components/AnimatedCircleProgress";
import { MaterialIcons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

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
      {/* Daily Total Card */}
      <View className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 mb-6">
        {/* Deficit/Surplus Badge */}
        <View className="w-full items-end mb-6">
          <Text
            className={`${
              consumedCalories > calorieGoal
                ? "text-red-500 bg-red-500/10 p-2 rounded-full"
                : "text-primary bg-orange-500/10 p-2 rounded-full"
            } dark:text-primary font-bold text-sm `}
          >
            {Math.round(Math.abs(calorieGoal - consumedCalories))} kcal{" "}
            {consumedCalories > calorieGoal ? "surplus" : "deficit"}
          </Text>
        </View>

        {/* Circular Progress with Calories */}
        <View className="flex-row items-center justify-center w-full mb-8">
          {/* SVG Circle */}
          <View className="relative w-24 h-24 mr-6 items-center justify-center">
            <AnimatedCircleProgress
              progress={calorieProgress}
              trackColor={trackColor}
              progressColor={themeColors.primary}
              exceedColor={themeColors.error}
            />
          </View>

          {/* Calorie Numbers */}
          <View className="flex-col items-start">
            <View className="flex-row items-baseline gap-2">
              <Text className="text-5xl font-bold text-zinc-900 dark:text-white">
                {Math.round(consumedCalories)}
              </Text>
              <Text className="text-4xl font-light text-zinc-300 dark:text-zinc-600">
                /
              </Text>
            </View>
            <Text className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">
              {calorieGoal} calories
            </Text>
          </View>
        </View>

        {/* Macros Row */}
        <View className="flex-row justify-between w-full px-4">
          <View className="flex-col items-center">
            <Text className="text-sm font-bold text-zinc-900 dark:text-white">
              Protein
            </Text>
            <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {Math.round(summary?.totalProteinGrams || 0)} g /{" "}
              {Math.round(summary?.targetProteinGrams || 0)} g
            </Text>
          </View>
          <View className="flex-col items-center">
            <Text className="text-sm font-bold text-zinc-900 dark:text-white">
              Carb
            </Text>
            <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {Math.round(summary?.totalCarbsGrams || 0)} g /{" "}
              {Math.round(summary?.targetCarbsGrams || 0)} g
            </Text>
          </View>
          <View className="flex-col items-center">
            <Text className="text-sm font-bold text-zinc-900 dark:text-white">
              Fat
            </Text>
            <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {Math.round(summary?.totalFatGrams || 0)} g /{" "}
              {Math.round(summary?.targetFatGrams || 0)} g
            </Text>
          </View>
        </View>
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
