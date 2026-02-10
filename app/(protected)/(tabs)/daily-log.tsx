import { MealEntryModal } from "@/app/screens/components/MealEntryModal";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

const DailyLog = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme].background;
  const [selectedDate, setSelectedDate] = React.useState(8);
  const [isFabExpanded, setIsFabExpanded] = React.useState(false);
  const [isMealModalVisible, setIsMealModalVisible] = React.useState(false);
  const fabAnimation = React.useRef(new Animated.Value(0)).current;

  // Mock data
  const dailyTotal = {
    consumed: 0,
    goal: 2587,
    deficit: -2587,
  };

  const macros = {
    protein: 0,
    carbs: 0,
    fats: 0,
  };

  const dates = [
    { day: 1, month: "Feb" },
    { day: 2, month: "Feb" },
    { day: 3, month: "Feb" },
    { day: 4, month: "Feb" },
    { day: 5, month: "Feb" },
    { day: 6, month: "Feb" },
    { day: 7, month: "Feb" },
    { day: 8, month: "Feb" },
    { day: 9, month: "Feb" },
    { day: 10, month: "Feb" },
    { day: 11, month: "Feb" },
    { day: 12, month: "Feb" },
    { day: 13, month: "Feb" },
    { day: 14, month: "Feb" },
    { day: 15, month: "Feb" },
    { day: 16, month: "Feb" },
    { day: 17, month: "Feb" },
    { day: 18, month: "Feb" },
    { day: 19, month: "Feb" },
    { day: 20, month: "Feb" },
    { day: 21, month: "Feb" },
    { day: 22, month: "Feb" },
    { day: 23, month: "Feb" },
    { day: 24, month: "Feb" },
    { day: 25, month: "Feb" },
    { day: 26, month: "Feb" },
    { day: 27, month: "Feb" },
    { day: 28, month: "Feb" },
    { day: 29, month: "Feb" },
  ];

  // Calculate progress percentage for circular ring
  const progressPercentage =
    dailyTotal.goal > 0 ? (dailyTotal.consumed / dailyTotal.goal) * 100 : 0;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

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

  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ backgroundColor }}>
        {/* Date Selector */}
        <View className="px-4 pb-6 pt-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            <View className="flex-row gap-3 px-2 py-2">
              {dates.map((date, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedDate(date.day)}
                  className={`flex items-center justify-center w-16 h-20 rounded-2xl border ${
                    selectedDate === date.day
                      ? "bg-primary dark:bg-yellow-600 border-primary dark:border-yellow-600"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                  }`}
                  style={
                    selectedDate === date.day
                      ? { transform: [{ scale: 1.05 }] }
                      : {}
                  }
                >
                  <Text
                    className={`text-lg ${
                      selectedDate === date.day
                        ? "text-white font-bold"
                        : "text-zinc-600 dark:text-zinc-400 font-medium"
                    }`}
                  >
                    {date.day}
                  </Text>
                  <Text
                    className={`text-xs font-medium ${
                      selectedDate === date.day
                        ? "text-white/90"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {date.month}
                  </Text>
                </Pressable>
              ))}
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
              <Text className="text-[#1F8B83] dark:text-teal-400 font-bold text-sm">
                {dailyTotal.deficit} kcal deficit
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
                    stroke={colorScheme === "dark" ? "#3f3f46" : "#d1d5db"}
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
                    {dailyTotal.consumed}
                  </Text>
                  <Text className="text-4xl font-light text-zinc-300 dark:text-zinc-600">
                    /
                  </Text>
                </View>
                <Text className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">
                  {dailyTotal.goal} calories
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
                  {macros.protein} g
                </Text>
              </View>
              <View className="flex-col items-center">
                <Text className="text-2xl mb-1">🥔</Text>
                <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                  Carb
                </Text>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {macros.carbs} g
                </Text>
              </View>
              <View className="flex-col items-center">
                <Text className="text-2xl mb-1">🥑</Text>
                <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                  Fat
                </Text>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {macros.fats} g
                </Text>
              </View>
            </View>
          </View>

          {/* Empty State */}
          <View className="flex-col items-center justify-center py-12 gap-4">
            <Text className="text-zinc-500 dark:text-zinc-400 text-base font-normal max-w-[250px] text-center leading-relaxed">
              You haven't consumed anything this day.
            </Text>
            <Text className="text-4xl">😋</Text>
          </View>
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

      {/* Meal Entry Modal */}
      <MealEntryModal
        visible={isMealModalVisible}
        onClose={() => setIsMealModalVisible(false)}
        onSave={(mealData) => {
          console.log("Meal saved:", mealData);
          // TODO: Add meal to daily log
        }}
      />
    </ScreenWrapper>
  );
};

export default DailyLog;
