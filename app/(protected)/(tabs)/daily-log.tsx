import {
  MealData,
  MealEntryModal,
} from "@/app/screens/components/MealEntryModal";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addFoodLogAsync,
  fetchFoodLogsAsync,
} from "@/store/slices/dailyLogsSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { format, isSameDay, subDays } from "date-fns";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

const DailyLog = () => {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const themeColors = Colors[colorScheme];
  const backgroundColor = themeColors.background;

  const { entries, summary, isLoading } = useAppSelector(
    (state) => state.dailyLogs,
  );
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [isFabExpanded, setIsFabExpanded] = React.useState(false);
  const [isMealModalVisible, setIsMealModalVisible] = React.useState(false);
  const fabAnimation = React.useRef(new Animated.Value(0)).current;

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

  // Calculate progress percentage for circular ring
  const calorieGoal = 2500; // This should ideally come from user profile
  const consumedCalories = summary?.totalCalories || 0;
  const progressPercentage =
    calorieGoal > 0 ? (consumedCalories / calorieGoal) * 100 : 0;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset =
    circumference - (Math.min(progressPercentage, 100) / 100) * circumference;

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
      setIsMealModalVisible(false);
    } catch (error) {
      console.error("Failed to add meal:", error);
      // Logic for error feedback could be added here (e.g., Alert)
    }
  };
  console.log("entries", entries);
  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ backgroundColor }}>
        {/* Date Selector */}
        <View className="px-4 pb-6 pt-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            ref={(ref) => {
              // Simple way to scroll to middle approx
              if (ref)
                setTimeout(
                  () => ref.scrollTo({ x: 600, animated: false }),
                  100,
                );
            }}
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

        {/* Main Content */}
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
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
                    : "text-[#1F8B83]"
                } dark:text-teal-400 font-bold text-sm`}
              >
                {Math.abs(calorieGoal - consumedCalories)} kcal{" "}
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
                  <Circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={themeColors.primary}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </Svg>
              </View>

              {/* Calorie Numbers */}
              <View className="flex-col items-start">
                <View className="flex-row items-baseline gap-2">
                  <Text className="text-5xl font-bold text-zinc-900 dark:text-white">
                    {consumedCalories}
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
                  {summary?.totalProteinGrams || 0} g
                </Text>
              </View>
              <View className="flex-col items-center">
                <Text className="text-2xl mb-1">🥔</Text>
                <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                  Carb
                </Text>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {summary?.totalCarbsGrams || 0} g
                </Text>
              </View>
              <View className="flex-col items-center">
                <Text className="text-2xl mb-1">🥑</Text>
                <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                  Fat
                </Text>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {summary?.totalFatGrams || 0} g
                </Text>
              </View>
            </View>
          </View>

          {/* Entries List */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#f39849" className="my-10" />
          ) : entries.length > 0 ? (
            <View className="gap-4">
              {entries.map((entry) => (
                <View
                  key={entry.id}
                  className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 items-center justify-center">
                      <MaterialIcons
                        name="restaurant"
                        size={20}
                        color="#f39849"
                      />
                    </View>
                    <View>
                      <Text className="text-zinc-900 dark:text-white font-bold">
                        {entry.mealName}
                      </Text>
                      <Text className="text-zinc-500 text-xs">
                        {entry.quantity} servings
                      </Text>
                    </View>
                  </View>
                  <Text className="text-zinc-900 dark:text-white font-bold">
                    {entry.calories} kcal
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="flex-col items-center justify-center py-12 gap-4">
              <Text className="text-zinc-500 dark:text-zinc-400 text-base font-normal max-w-[250px] text-center leading-relaxed">
                You haven't consumed anything this day.
              </Text>
              <Text className="text-4xl">😋</Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Buttons */}
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
      </View>

      <MealEntryModal
        visible={isMealModalVisible}
        onClose={() => setIsMealModalVisible(false)}
        onSave={handleAddMeal}
      />
    </ScreenWrapper>
  );
};

export default DailyLog;
