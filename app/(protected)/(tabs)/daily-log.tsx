import {
  MealData,
  MealEntryModal,
} from "@/app/screens/components/MealEntryModal";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addFoodLogAsync,
  deleteFoodLogAsync,
  fetchFoodLogsAsync,
  updateFoodLogAsync,
} from "@/store/slices/dailyLogsSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { format, isSameDay, parseISO, subDays } from "date-fns";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import AnimatedReanimated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

const AnimatedCircle = AnimatedReanimated.createAnimatedComponent(Circle);

const dates = Array.from({ length: 30 }).map((_, i) => {
  const date = subDays(new Date(), 15 - i);
  return {
    date,
    day: format(date, "d"),
    month: format(date, "MMM"),
    isToday: isSameDay(date, new Date()),
  };
});

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = 64; // w-16
const ITEM_GAP = 12; // gap-3
const ITEM_TOTAL_WIDTH = ITEM_WIDTH + ITEM_GAP;
const DailyLog = () => {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const themeColors = Colors[colorScheme];
  const backgroundColor = themeColors.background;

  const { entries, summary, isLoading } = useAppSelector(
    (state) => state.dailyLogs,
  );
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [activeTab, setActiveTab] = React.useState<"meal" | "water">("meal");
  const [isFabExpanded, setIsFabExpanded] = React.useState(false);
  const [isMealModalVisible, setIsMealModalVisible] = React.useState(false);
  const [editingMeal, setEditingMeal] = React.useState<MealData | null>(null);

  // Water state
  const [waterIntake, setWaterIntake] = React.useState(1500); // Mock initial value
  const waterGoal = 2500;
  const waterProgress = (waterIntake / waterGoal) * 100;
  const scrollRef = React.useRef<ScrollView>(null);
  const mainScrollRef = React.useRef<ScrollView>(null);
  const fabAnimation = React.useRef(new Animated.Value(0)).current;
  const initialScrollDone = React.useRef(false);

  // Generate a week of dates around the current date
  const dates = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const date = subDays(new Date(), 15 - i);
      return {
        date,
        day: format(date, "d"),
        month: format(date, "MMM"),
        isToday: isSameDay(date, new Date()),
      };
    });
  }, []);

  useEffect(() => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    dispatch(fetchFoodLogsAsync({ startDate: dateStr, endDate: dateStr }));
  }, [selectedDate, dispatch]);

  // Scroll to top when tab changes
  useEffect(() => {
    mainScrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [activeTab]);

  // Calculate progress percentage for circular ring
  const calorieGoal = 2500; // This should ideally come from user profile
  const consumedCalories = summary?.totalCalories || 0;
  const progressPercentage =
    calorieGoal > 0 ? (consumedCalories / calorieGoal) * 100 : 0;
  const circumference = 2 * Math.PI * 40;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(progressPercentage, { duration: 1000 });
  }, [progressPercentage]);

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset:
        circumference - (Math.min(progress.value, 100) / 100) * circumference,
    };
  });

  // Toggle FAB expansion
  const toggleFab = () => {
    const toValue = isFabExpanded ? 0 : 1;
    Animated.spring(fabAnimation, {
      toValue,
      useNativeDriver: true,
      friction: 5,
    }).start();
    setIsFabExpanded(!isFabExpanded);
  };

  // Animation values for sub-buttons
  const manualButtonTranslate = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const scanButtonTranslate = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -150],
  });

  const rotation = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  useFocusEffect(
    React.useCallback(() => {
      setIsFabExpanded(false);
      fabAnimation.setValue(0);
    }, []),
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddMeal = async (mealData: MealData) => {
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
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
      setIsMealModalVisible(false);
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
    setIsMealModalVisible(true);
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
    const totalCals = items.reduce((sum, i) => sum + i.calories, 0);

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
          <Text className="text-sm font-bold text-[#f39849]">
            {totalCals} kcal
          </Text>
        </View>
        <View className="gap-3">
          {items.map((entry) => (
            <View
              key={entry.id}
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
            </View>
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

  useEffect(() => {
    if (activeTab === "water") {
      setIsFabExpanded(false);
      fabAnimation.setValue(0);
    }
  }, [activeTab]);
  return (
    <ScreenWrapper>
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
                return (
                  <Pressable
                    key={index}
                    onPress={() => handleDateSelect(item.date)}
                    className={`flex items-center justify-center w-16 h-20 rounded-2xl border ${
                      isActive
                        ? "bg-[#f39849] border-[#f39849]"
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    }`}
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
                <Text className="text-center text-lg font-bold mb-1 text-zinc-900 dark:text-white">
                  Daily Total
                </Text>

                {/* Deficit/Surplus Badge */}
                <View className="w-full items-end mb-6">
                  <Text
                    className={`${
                      consumedCalories > calorieGoal
                        ? "text-red-500"
                        : "text-green-500"
                    } dark:text-teal-400 font-bold text-sm`}
                  >
                    {Math.round(Math.abs(calorieGoal - consumedCalories))} kcal{" "}
                    {consumedCalories > calorieGoal ? "surplus" : "deficit"}
                  </Text>
                </View>

                {/* Circular Progress with Calories */}
                <View className="flex-row items-center justify-center w-full mb-8">
                  {/* SVG Circle */}
                  <View className="relative w-24 h-24 mr-6 items-center justify-center">
                    <Svg
                      width={96}
                      height={96}
                      style={{ transform: [{ rotate: "-90deg" }] }}
                    >
                      {/* Background circle */}
                      <Circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke={colorScheme === "dark" ? "#27272a" : "#f3f4f6"}
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Progress circle */}
                      <AnimatedCircle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke={
                          consumedCalories > calorieGoal
                            ? themeColors.error
                            : themeColors.success
                        }
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        animatedProps={animatedCircleProps}
                        strokeLinecap="round"
                      />
                    </Svg>
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
                    <Text className="text-2xl mb-1">💪</Text>
                    <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                      Protein
                    </Text>
                    <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {Math.round(summary?.totalProteinGrams || 0)} g
                    </Text>
                  </View>
                  <View className="flex-col items-center">
                    <Text className="text-2xl mb-1">🥔</Text>
                    <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                      Carb
                    </Text>
                    <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {Math.round(summary?.totalCarbsGrams || 0)} g
                    </Text>
                  </View>
                  <View className="flex-col items-center">
                    <Text className="text-2xl mb-1">🥑</Text>
                    <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                      Fat
                    </Text>
                    <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {Math.round(summary?.totalFatGrams || 0)} g
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
                    color="#f59e0b"
                  />
                  <MealSection
                    title="Lunch"
                    icon="restaurant"
                    items={groupedEntries.LUNCH}
                    color="#3b82f6"
                  />
                  <MealSection
                    title="Dinner"
                    icon="nights-stay"
                    items={groupedEntries.DINNER}
                    color="#8b5cf6"
                  />
                  <MealSection
                    title="Snacks"
                    icon="fastfood"
                    items={groupedEntries.SNACK}
                    color="#f39849"
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
              <View className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 mb-8 items-center">
                <View className="relative w-48 h-48 items-center justify-center mb-6">
                  <Svg
                    width={192}
                    height={192}
                    style={{ transform: [{ rotate: "-90deg" }] }}
                  >
                    <Circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke={colorScheme === "dark" ? "#27272a" : "#f1f5f9"}
                      strokeWidth="12"
                      fill="transparent"
                    />
                    <Circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 88}
                      strokeDashoffset={
                        2 * Math.PI * 88 -
                        (Math.min(waterProgress, 100) / 100) *
                          (2 * Math.PI * 88)
                      }
                      strokeLinecap="round"
                    />
                  </Svg>
                  <View className="absolute inset-0 items-center justify-center">
                    <MaterialIcons name="opacity" size={48} color="#3b82f6" />
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

                <View className="flex-row gap-4 w-full">
                  <Pressable
                    onPress={() => setWaterIntake((prev) => prev + 250)}
                    className="flex-1 bg-blue-500 py-4 rounded-2xl items-center shadow-lg shadow-blue-500/30"
                  >
                    <Text className="text-white font-bold text-base">
                      +250ml
                    </Text>
                    <Text className="text-white/70 text-[10px] uppercase font-bold tracking-tighter mt-0.5">
                      One Glass
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setWaterIntake((prev) => prev + 500)}
                    className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 py-4 rounded-2xl items-center"
                  >
                    <Text className="text-zinc-900 dark:text-white font-bold text-base">
                      +500ml
                    </Text>
                    <Text className="text-zinc-400 text-[10px] uppercase font-bold tracking-tighter mt-0.5">
                      Bottle
                    </Text>
                  </Pressable>
                </View>
              </View>

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
                    Drinking enough water helps improve your energy levels,
                    focus, and overall metabolism. Aim for small sips throughout
                    the day!
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Buttons Overlay */}
        {isFabExpanded && (
          <Pressable
            className="absolute inset-0 z-10 bg-black/5"
            onPress={toggleFab}
          />
        )}

        {/* Floating Action Buttons */}
        {activeTab === "meal" && (
          <View className="absolute bottom-8 right-6 z-20">
            {/* Manual Button */}
            <Animated.View
              style={{
                transform: [{ translateY: manualButtonTranslate }],
                opacity: fabAnimation,
              }}
              className="absolute bottom-0 right-0 mb-2"
            >
              <Pressable
                onPress={() => {
                  toggleFab();
                  setIsMealModalVisible(true);
                }}
                className="bg-white dark:bg-zinc-800 w-14 h-14 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700 flex-row gap-2 px-4"
                style={{ elevation: 0 }}
              >
                <MaterialIcons name="edit" size={20} color="#f39849" />
              </Pressable>
              {isFabExpanded && (
                <View className="absolute right-16 top-2 h-10">
                  <Text className="text-sm font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 min-w-[80px] text-center">
                    Manual
                  </Text>
                </View>
              )}
            </Animated.View>

            {/* Scan Button */}
            <Animated.View
              style={{
                transform: [{ translateY: scanButtonTranslate }],
                opacity: fabAnimation,
              }}
              className="absolute bottom-0 right-0 mb-2"
            >
              <Pressable
                onPress={() => {
                  toggleFab();
                  // Handle scan
                  console.log("Scan");
                }}
                className="bg-white dark:bg-zinc-800 w-14 h-14 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700"
                style={{ elevation: 0 }}
              >
                <MaterialIcons name="camera-alt" size={20} color="#f39849" />
              </Pressable>
              {isFabExpanded && (
                <View className="absolute right-16 top-2 h-10">
                  <Text className="text-sm font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 min-w-[100px] text-center">
                    Scan Meal
                  </Text>
                </View>
              )}
            </Animated.View>

            {/* Main FAB */}
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Pressable
                onPress={toggleFab}
                className="bg-[#f39849] w-16 h-16 rounded-full flex items-center justify-center active:opacity-90"
                style={{ elevation: 0 }}
              >
                <MaterialIcons name="add" size={36} color="white" />
              </Pressable>
            </Animated.View>
          </View>
        )}
      </View>

      <MealEntryModal
        visible={isMealModalVisible}
        initialData={editingMeal || undefined}
        onClose={() => {
          setIsMealModalVisible(false);
          setEditingMeal(null);
        }}
        onSave={handleAddMeal}
      />
    </ScreenWrapper>
  );
};

export default DailyLog;
