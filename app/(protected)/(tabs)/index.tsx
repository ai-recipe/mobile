import { TabScreenWrapper } from "@/app/(protected)/(tabs)/components/TabScreenWrapper";
import {
  MealData,
  MealEntryModal,
} from "@/app/screens/components/MealEntryModal";
import { AnimatedCircleProgress } from "@/components/AnimatedCircleProgress";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addFoodLogAsync,
  deleteFoodLogAsync,
  fetchFoodLogsAsync,
  updateFoodLogAsync,
} from "@/store/slices/dailyLogsSlice";
import { closeMealModal, openMealModal } from "@/store/slices/modalSlice";
import {
  addWaterIntakeAsync,
  deleteWaterIntakeAsync,
  fetchWaterIntakeAsync,
} from "@/store/slices/waterLogsSlice";
import { MaterialIcons } from "@expo/vector-icons";
import {
  endOfDay,
  format,
  isAfter,
  isSameDay,
  parseISO,
  subDays,
} from "date-fns";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = 64; // w-16
const ITEM_GAP = 12; // gap-3
const ITEM_TOTAL_WIDTH = ITEM_WIDTH + ITEM_GAP;
const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const themeColors = Colors[colorScheme];
  const backgroundColor = themeColors.background;

  const { entries, summary, isLoading } = useAppSelector(
    (state) => state.dailyLogs,
  );
  console.log(JSON.stringify(summary, null, 2));
  const {
    entries: waterEntries,
    totalIntakeMl: waterIntake,
    dailyGoalMl: waterGoal,
    progressPercentage: waterProgress,
    isLoading: waterLoading,
    isAdding: waterAdding,
  } = useAppSelector((state) => state.waterLogs);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const mealModalOpen = useAppSelector((state) => state.modal.mealModalOpen);
  const [activeTab, setActiveTab] = React.useState<"meal" | "water">("meal");
  const [editingMeal, setEditingMeal] = React.useState<MealData | null>(null);
  const scrollRef = React.useRef<ScrollView>(null);
  const mainScrollRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    if (mealModalOpen) {
      setActiveTab("meal");
    }
  }, [mealModalOpen]);
  // Generate a week of dates around the current date
  const dates = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => {
      const date = subDays(new Date(), 30 - i);
      return {
        date,
        day: format(date, "d"),
        month: format(date, "MMM"),
        isToday: isSameDay(date, new Date()),
      };
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      setActiveTab("meal");
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      dispatch(fetchFoodLogsAsync({ startDate: dateStr, endDate: dateStr }));
      dispatch(fetchWaterIntakeAsync(dateStr));
    }, [selectedDate, dispatch]),
  );

  // Scroll to top when tab changes
  useEffect(() => {
    mainScrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [activeTab]);

  // Progress for circular rings (goal from user profile in future)
  const calorieGoal = 2500;
  const consumedCalories = summary?.totalCalories || 0;
  const calorieProgress =
    calorieGoal > 0 ? (consumedCalories / calorieGoal) * 100 : 0;

  const trackColor = colorScheme === "dark" ? "#27272a" : "#f3f4f6";

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddMeal = async (mealData: MealData) => {
    try {
      if (mealData.id) {
        // Update existing meal
        await dispatch(
          updateFoodLogAsync({
            id: mealData.id,
            data: {
              mealName: mealData.name,
              calories: mealData.calories,
              proteinGrams: mealData.protein,
              carbsGrams: mealData.carbs,
              fatGrams: mealData.fat,
              quantity: mealData.servings,
              loggedAt: format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            },
          }),
        ).unwrap();
      } else {
        // Add new meal
        await dispatch(
          addFoodLogAsync({
            mealName: mealData.name,
            calories: mealData.calories,
            proteinGrams: mealData.protein,
            carbsGrams: mealData.carbs,
            fatGrams: mealData.fat,
            quantity: mealData.servings,
            loggedAt: format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
          }),
        ).unwrap();
      }
      dispatch(closeMealModal());
      setEditingMeal(null);
    } catch (error) {
      console.error("Failed to add/update meal:", error);
    }
  };

  const handleDeleteMeal = (id: string) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const dateStr = format(selectedDate, "yyyy-MM-dd");
          dispatch(deleteFoodLogAsync({ id, date: dateStr }));
        },
      },
    ]);
  };

  const handleEditMeal = (entry: any) => {
    setEditingMeal({
      id: entry.id,
      name: entry.mealName,
      calories: entry.calories,
      protein: entry.proteinGrams,
      carbs: entry.carbsGrams,
      fat: entry.fatGrams,
      servings: entry.quantity,
      loggedAt: entry.loggedAt,
    });
    dispatch(openMealModal());
  };

  const handleAddWater = (amountMl: number) => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    dispatch(addWaterIntakeAsync({ amountMl, date: dateStr }));
  };

  const handleDeleteWater = (id: string) => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    Alert.alert("Delete entry", "Remove this water intake entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(deleteWaterIntakeAsync({ id, date: dateStr })),
      },
    ]);
  };

  const groupedEntries = useMemo(() => {
    const groups: { [key: string]: any[] } = {
      BREAKFAST: [],
      LUNCH: [],
      DINNER: [],
      SNACK: [],
    };

    entries.forEach((entry) => {
      const hour = parseISO(entry.loggedAt).getHours();
      if (hour >= 5 && hour < 11) {
        groups.BREAKFAST.push(entry);
      } else if (hour >= 11 && hour < 16) {
        groups.LUNCH.push(entry);
      } else if (hour >= 16 && hour < 23) {
        groups.DINNER.push(entry);
      } else {
        groups.SNACK.push(entry);
      }
    });

    return groups;
  }, [entries]);

  const MealSection = ({
    title,
    icon,
    items,
    color,
  }: {
    title: string;
    icon: any;
    items: any[];
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
              onPress={() => handleEditMeal(entry)}
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
                    onPress={() => handleEditMeal(entry)}
                    className="p-1.5 rounded-full active:bg-zinc-100 dark:active:bg-zinc-800"
                  >
                    <MaterialIcons
                      name="edit"
                      size={18}
                      color={colorScheme === "dark" ? "#71717a" : "#a1a1aa"}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDeleteMeal(entry.id)}
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

  useFocusEffect(
    React.useCallback(() => {
      const index = dates.findIndex((item) =>
        isSameDay(item.date, selectedDate),
      );
      if (index !== -1) {
        // Calculate the offset to center the item
        // (index * totalWidth) + padding - (screenWidth / 2) + (itemWidth / 2)
        const offset =
          index * ITEM_TOTAL_WIDTH + 8 - SCREEN_WIDTH / 1.5 + ITEM_WIDTH / 2;

        // Use a small delay to ensure the scrollview is ready
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            x: Math.max(0, offset),
            animated: true,
          });
        }, 100);
      }
    }, [selectedDate]),
  );

  return (
    <ScreenWrapper>
      <TabScreenWrapper>
        <View className="flex-1" style={{ backgroundColor }}>
          {/* Date Selector */}
          <View className="px-4 pb-6 pt-2">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
              ref={scrollRef}
            >
              <View className="flex-row gap-3 px-2 py-2">
                {dates.map((item, index) => {
                  const isActive = isSameDay(item.date, selectedDate);
                  const isDisabled = isAfter(item.date, endOfDay(new Date()));
                  return (
                    <Pressable
                      key={index}
                      onPress={() => handleDateSelect(item.date)}
                      className={`flex items-center justify-center w-16 h-20 rounded-2xl border ${
                        isActive
                          ? "bg-[#f39849] border-[#f39849]"
                          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                      }
                      ${isDisabled ? "opacity-50" : ""}
                      `}
                      style={isActive ? { transform: [{ scale: 1.05 }] } : {}}
                    >
                      <Text
                        className={`text-lg ${
                          isActive
                            ? "text-white font-bold"
                            : "text-zinc-600 dark:text-zinc-400 font-medium"
                        }`}
                      >
                        {item.day}
                      </Text>
                      <Text
                        className={`text-xs font-medium ${
                          isActive
                            ? "text-white/90"
                            : "text-zinc-400 dark:text-zinc-500"
                        }`}
                      >
                        {item.month}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Tab Navigation */}
          <View className="px-6 mb-4">
            <View className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1 flex-row">
              <Pressable
                onPress={() => setActiveTab("meal")}
                className={`flex-1 py-3 rounded-xl ${
                  activeTab === "meal"
                    ? "bg-white dark:bg-zinc-800"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    activeTab === "meal"
                      ? "text-[#f39849]"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  Meal Activity
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setActiveTab("water");
                }}
                className={`flex-1 py-3 rounded-xl ${
                  activeTab === "water"
                    ? "bg-white dark:bg-zinc-800"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    activeTab === "water"
                      ? "text-[#f39849]"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  Water Activity
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Main Content */}
          <ScrollView
            ref={mainScrollRef}
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {activeTab === "meal" ? (
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
                      {Math.round(Math.abs(calorieGoal - consumedCalories))}{" "}
                      kcal{" "}
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
                  <ActivityIndicator
                    size="large"
                    color="#f39849"
                    className="my-10"
                  />
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
            ) : (
              /* Water Activity Tab */
              <View className="pb-10">
                {waterLoading && !waterEntries.length ? (
                  <ActivityIndicator
                    size="large"
                    color="#3b82f6"
                    className="my-10"
                  />
                ) : (
                  <>
                    <View className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 mb-6 items-center">
                      <View className="relative w-48 h-48 items-center justify-center mb-6">
                        <AnimatedCircleProgress
                          progress={waterProgress}
                          trackColor="#f1f5f9"
                          progressColor="#3b82f6"
                          exceedColor={themeColors.error}
                          size={192}
                          radius={88}
                          strokeWidth={12}
                        />

                        <View className="absolute inset-0 items-center justify-center">
                          <MaterialIcons
                            name="opacity"
                            size={48}
                            color="#3b82f6"
                          />
                          <Text className="text-3xl font-black text-zinc-900 dark:text-white mt-1">
                            {waterIntake}
                          </Text>
                          <Text className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                            / {waterGoal} ml
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-full mb-8">
                        <Text className="text-xs font-bold text-blue-500">
                          {Math.round(waterProgress)}% of daily goal reached
                        </Text>
                      </View>

                      <View className="flex-row gap-4 w-full ">
                        <Pressable
                          onPress={() => handleAddWater(250)}
                          disabled={waterAdding}
                          android_ripple={{ color: "rgba(255,255,255,0.35)" }}
                          style={({ pressed }) => [
                            { opacity: pressed ? 0.85 : 1 },
                          ]}
                          className="flex-1 bg-blue-500 py-4 rounded-2xl items-center shadow-lg shadow-blue-500/30 relative"
                        >
                          <View className="absolute left-1/2 top-1/2 -translate-x-1/2 ">
                            {waterAdding ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : null}
                          </View>
                          <Text className="text-white font-bold text-base">
                            +250ml
                          </Text>
                          <Text className="text-white/70 text-[10px] uppercase font-bold tracking-tighter mt-0.5">
                            One Glass
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => handleAddWater(500)}
                          disabled={waterAdding}
                          android_ripple={{ color: "rgba(0,0,0,0.06)" }}
                          style={({ pressed }) => [
                            { opacity: pressed ? 0.85 : 1 },
                          ]}
                          className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 py-4 rounded-2xl items-center relative"
                        >
                          <View className="absolute left-1/2 top-1/2 -translate-x-1/2 ">
                            {waterAdding ? (
                              <ActivityIndicator
                                size="small"
                                color="#zinc-900"
                              />
                            ) : null}
                          </View>
                          <Text className="text-zinc-900 dark:text-white font-bold text-base">
                            +500ml
                          </Text>
                          <Text className="text-zinc-400 text-[10px] uppercase font-bold tracking-tighter mt-0.5">
                            Bottle
                          </Text>
                        </Pressable>
                      </View>
                    </View>

                    {/* Water entries list (like meal activity) */}
                    {waterEntries.length > 0 ? (
                      <View className="mb-8">
                        <View className="flex-row items-center justify-between mb-4 px-2">
                          <View className="flex-row items-center gap-2">
                            <View className="w-8 h-8 rounded-lg items-center justify-center bg-blue-500/20">
                              <MaterialIcons
                                name="opacity"
                                size={18}
                                color="#3b82f6"
                              />
                            </View>
                            <Text className="text-base font-bold text-zinc-900 dark:text-white">
                              Water log
                            </Text>
                          </View>
                          <Text className="text-sm font-bold text-[#3b82f6]">
                            {waterEntries.reduce(
                              (sum, e) => sum + e.amountMl,
                              0,
                            )}{" "}
                            ml
                          </Text>
                        </View>
                        <View className="gap-3">
                          {[...waterEntries]
                            .sort(
                              (a, b) =>
                                new Date(b.loggedAt).getTime() -
                                new Date(a.loggedAt).getTime(),
                            )
                            .map((entry) => (
                              <View
                                key={entry.id}
                                className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex-row items-center justify-between"
                              >
                                <View className="flex-row items-center gap-3">
                                  <View className="flex-col">
                                    <Text className="text-zinc-900 dark:text-white font-bold">
                                      {entry.amountMl} ml
                                    </Text>
                                    <Text className="text-zinc-500 text-xs mt-0.5">
                                      {format(
                                        parseISO(entry.loggedAt),
                                        "HH:mm",
                                      )}
                                    </Text>
                                  </View>
                                </View>
                                <Pressable
                                  onPress={() => handleDeleteWater(entry.id)}
                                  className="p-1.5 rounded-full active:bg-zinc-100 dark:active:bg-zinc-800"
                                >
                                  <MaterialIcons
                                    name="delete-outline"
                                    size={18}
                                    color="#ef4444"
                                  />
                                </Pressable>
                              </View>
                            ))}
                        </View>
                      </View>
                    ) : (
                      <View className="flex-col items-center justify-center py-8 gap-2 mb-6">
                        <Text className="text-zinc-500 dark:text-zinc-400 text-sm text-center">
                          No water logged for this day.
                        </Text>
                        <Text className="text-3xl">💧</Text>
                      </View>
                    )}

                    {/* Tips Section for Water */}
                    <View className="bg-blue-50 dark:bg-blue-500/5 p-6 rounded-3xl border border-blue-100 dark:border-blue-500/10 flex-row gap-4">
                      <View className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl items-center justify-center">
                        <MaterialIcons
                          name="lightbulb-outline"
                          size={24}
                          color="#3b82f6"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                          Stay Hydrated!
                        </Text>
                        <Text className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Drinking enough water helps improve your energy
                          levels, focus, and overall metabolism. Aim for small
                          sips throughout the day!
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
            )}
          </ScrollView>
        </View>

        <MealEntryModal
          visible={mealModalOpen}
          initialData={editingMeal || undefined}
          onClose={() => {
            dispatch(closeMealModal());
            setEditingMeal(null);
          }}
          onSave={handleAddMeal}
        />
      </TabScreenWrapper>
    </ScreenWrapper>
  );
};

export default HomeScreen;
