import { TabScreenWrapper } from "@/app/(protected)/(tabs)/components/TabScreenWrapper";
import {
  MealData,
  MealEntryModal,
} from "@/app/screens/components/MealEntryModal";
import { ActivityTabSwitcher } from "@/components/ActivityTabSwitcher";
import { MealActivityTab } from "@/components/MealActivityTab";
import { WaterActivityTab } from "@/components/WaterActivityTab";
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
    dispatch(addWaterIntakeAsync({ amountMl, loggedAt: dateStr }));
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
          <View className="px-4 pb-4 pt-2">
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
                      className={`flex items-center justify-center w-16 h-16 rounded-full border ${
                        isActive
                          ? "bg-[#f39849] border-[#f39849]"
                          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                      }
                      ${isDisabled ? "opacity-50" : ""}
                      `}
                      disabled={isDisabled}
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
          <ActivityTabSwitcher
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Main Content */}
          <ScrollView
            ref={mainScrollRef}
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {activeTab === "meal" ? (
              <MealActivityTab
                consumedCalories={consumedCalories}
                calorieGoal={calorieGoal}
                calorieProgress={calorieProgress}
                trackColor={trackColor}
                themeColors={themeColors}
                colorScheme={colorScheme}
                summary={summary}
                isLoading={isLoading}
                entries={entries}
                groupedEntries={groupedEntries}
                onEditMeal={handleEditMeal}
                onDeleteMeal={handleDeleteMeal}
              />
            ) : (
              <WaterActivityTab
                waterLoading={waterLoading}
                waterEntries={waterEntries}
                waterProgress={waterProgress}
                waterIntake={waterIntake}
                waterGoal={waterGoal}
                waterAdding={waterAdding}
                themeColors={themeColors}
                onAddWater={handleAddWater}
                onDeleteWater={handleDeleteWater}
              />
            )}
          </ScrollView>
        </View>

        <MealEntryModal
          visible={mealModalOpen}
          initialData={editingMeal || undefined}
          selectedDate={selectedDate}
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
