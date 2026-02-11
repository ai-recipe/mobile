import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ScreenWrapper } from "../../../components/ScreenWrapper";
import { CalendarModal } from "../../screens/components/CalendarModal";

type TabType = "health" | "recipes";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme].background;
  const [activeTab, setActiveTab] = React.useState<TabType>("health");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<
    "FAST" | "MED" | "HARD"
  >("FAST");
  const [date, setDate] = React.useState(new Date());
  const [showCalendar, setShowCalendar] = React.useState(false);

  const handleDateConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    // You can add logic here to fetch data for the selected date
  };

  // Mock data - can be replaced with Redux state later
  const dailyGoal = {
    current: 1850,
    target: 2200,
    remaining: 350,
  };

  const macros = {
    protein: { current: 120, target: 160 },
    carbs: { current: 200, target: 250 },
    fats: { current: 45, target: 70 },
  };

  const waterIntake = {
    current: 1500,
    target: 2000,
  };

  const recipeStats = {
    totalScanned: 24,
    thisWeek: 7,
    avgPrepTime: 25,
    prepTimeTrend: -5,
  };

  const weekActivity = [
    { day: "Mon", value: 60 },
    { day: "Tue", value: 95 },
    { day: "Wed", value: 40 },
    { day: "Thu", value: 75 },
    { day: "Fri", value: 55 },
    { day: "Sat", value: 30 },
    { day: "Sun", value: 85 },
  ];

  // Calculate progress percentage for circular ring
  const progressPercentage = (dailyGoal.current / dailyGoal.target) * 100;
  const circumference = 2 * Math.PI * 88;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  // Calculate water progress
  const waterProgressPercentage =
    (waterIntake.current / waterIntake.target) * 100;

  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ backgroundColor }}>
        {/* Header */}
        <View className="px-6 py-4 flex-row justify-between items-center">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full overflow-hidden bg-orange-100 dark:bg-orange-500/20 border border-orange-200 dark:border-orange-500/30">
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=12" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View>
              <Text className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                Good Morning
              </Text>
              <Text className="text-lg font-bold leading-none text-zinc-900 dark:text-white">
                Alex Rivera
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => setShowCalendar(true)}
            className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center "
          >
            <MaterialIcons
              name="calendar-today"
              size={20}
              color={Colors[colorScheme].icon}
            />
          </Pressable>
        </View>

        <CalendarModal
          visible={showCalendar}
          onClose={() => setShowCalendar(false)}
          onConfirm={handleDateConfirm}
          initialDate={date}
        />

        {/* Tab Navigation */}
        <View className="px-6 mb-4">
          <View className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 flex-row">
            <Pressable
              onPress={() => setActiveTab("health")}
              className={`flex-1 py-3 rounded-lg ${
                activeTab === "health"
                  ? "bg-white dark:bg-zinc-800"
                  : "bg-transparent"
              }`}
            >
              <Text
                className={`text-center text-sm font-bold ${
                  activeTab === "health"
                    ? "text-[#f39849]"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                Personal Health
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("recipes")}
              className={`flex-1 py-3 rounded-lg ${
                activeTab === "recipes"
                  ? "bg-white dark:bg-zinc-800"
                  : "bg-transparent"
              }`}
            >
              <Text
                className={`text-center text-sm font-bold ${
                  activeTab === "recipes"
                    ? "text-[#f39849]"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                Recipe Analytics
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Tab Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {activeTab === "health" ? (
            // Personal Health Tab
            <View className="px-6 pb-24">
              {/* Daily Calorie Progress Card */}
              <View className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800 mb-6 items-center">
                <View className="relative w-48 h-48 items-center justify-center">
                  {/* SVG Progress Ring */}
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
                      stroke={Colors[colorScheme].success}
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 88}
                      strokeDashoffset={
                        2 * Math.PI * 88 -
                        (Math.min(30, 100) / 100) * (2 * Math.PI * 88)
                      }
                      strokeLinecap="round"
                    />
                  </Svg>
                  <View className="absolute inset-0 flex-col items-center justify-center">
                    <Text className="text-3xl font-black text-zinc-900 dark:text-white">
                      {dailyGoal.current}
                    </Text>
                    <Text className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                      / {dailyGoal.target} cal
                    </Text>
                  </View>
                </View>
                <View className="w-full mt-6 flex-row">
                  <View className="flex-1 items-center">
                    <Text className="text-[10px] text-zinc-400 font-bold uppercase mb-1">
                      Goal
                    </Text>
                    <Text className="font-bold text-sm text-zinc-900 dark:text-white">
                      {dailyGoal.target}
                    </Text>
                  </View>
                  <View className="flex-1 items-center border-x border-zinc-100 dark:border-zinc-800">
                    <Text className="text-[10px] text-zinc-400 font-bold uppercase mb-1">
                      Consumed
                    </Text>
                    <Text className="font-bold text-sm text-zinc-900 dark:text-white">
                      {dailyGoal.current}
                    </Text>
                  </View>
                  <View className="flex-1 items-center">
                    <Text className="text-[10px] text-zinc-400 font-bold uppercase mb-1">
                      Remaining
                    </Text>
                    <Text className="font-bold text-sm text-zinc-900 dark:text-white">
                      {dailyGoal.remaining}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Macronutrients Card */}
              <View className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800 mb-6">
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="donut-small" size={16} color="#f39849" />
                  <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                    Nutrition Tracking
                  </Text>
                </View>
                <View className="gap-y-4">
                  {/* Protein */}
                  <View>
                    <View className="flex-row justify-between mb-1.5">
                      <Text className="text-xs font-bold text-zinc-500">
                        Protein
                      </Text>
                      <Text className="text-xs font-bold text-zinc-900 dark:text-white">
                        {macros.protein.current}g{" "}
                        <Text className="text-zinc-300 font-normal">
                          / {macros.protein.target}g
                        </Text>
                      </Text>
                    </View>
                    <View className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-[#f39849] rounded-full"
                        style={{
                          width: `${
                            (macros.protein.current / macros.protein.target) *
                            100
                          }%`,
                        }}
                      />
                    </View>
                  </View>

                  {/* Carbs */}
                  <View>
                    <View className="flex-row justify-between mb-1.5">
                      <Text className="text-xs font-bold text-zinc-500">
                        Carbs
                      </Text>
                      <Text className="text-xs font-bold text-zinc-900 dark:text-white">
                        {macros.carbs.current}g{" "}
                        <Text className="text-zinc-300 font-normal">
                          / {macros.carbs.target}g
                        </Text>
                      </Text>
                    </View>
                    <View className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-blue-400 rounded-full"
                        style={{
                          width: `${
                            (macros.carbs.current / macros.carbs.target) * 100
                          }%`,
                        }}
                      />
                    </View>
                  </View>

                  {/* Fats */}
                  <View>
                    <View className="flex-row justify-between mb-1.5">
                      <Text className="text-xs font-bold text-zinc-500">
                        Fats
                      </Text>
                      <Text className="text-xs font-bold text-zinc-900 dark:text-white">
                        {macros.fats.current}g{" "}
                        <Text className="text-zinc-300 font-normal">
                          / {macros.fats.target}g
                        </Text>
                      </Text>
                    </View>
                    <View className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-orange-400 rounded-full"
                        style={{
                          width: `${
                            (macros.fats.current / macros.fats.target) * 100
                          }%`,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Water Intake Card */}
              <View className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="opacity" size={16} color="#3b82f6" />
                  <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                    Daily Water Intake
                  </Text>
                </View>
                <View className="flex-row items-center justify-between mb-3">
                  <View>
                    <Text className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {waterIntake.current}ml
                    </Text>
                    <Text className="text-xs text-zinc-500">
                      of {waterIntake.target}ml goal
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-lg font-bold text-blue-500">
                      {Math.round(waterProgressPercentage)}%
                    </Text>
                    <Text className="text-[10px] text-zinc-400 uppercase">
                      Complete
                    </Text>
                  </View>
                </View>
                <View className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${waterProgressPercentage}%`,
                    }}
                  />
                </View>
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-[10px] text-zinc-400">0ml</Text>
                  <Text className="text-[10px] text-zinc-400">
                    {waterIntake.target}ml
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            // Recipe Analytics Tab
            <View className="px-6 pb-24">
              {/* Recipe Stats Card */}
              <View className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800 mb-6">
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="restaurant" size={16} color="#f39849" />
                  <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                    Recipe Tracking
                  </Text>
                </View>
                <View className="flex-row gap-4">
                  <View className="flex-1 items-center py-4 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
                    <Text className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {recipeStats.totalScanned}
                    </Text>
                    <Text className="text-[10px] text-zinc-500 font-bold uppercase mt-1">
                      Total Scanned
                    </Text>
                  </View>
                  <View className="flex-1 items-center py-4 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
                    <Text className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {recipeStats.thisWeek}
                    </Text>
                    <Text className="text-[10px] text-zinc-500 font-bold uppercase mt-1">
                      This Week
                    </Text>
                  </View>
                </View>
              </View>

              {/* Stats Row */}
              <View className="flex-row gap-4 mb-6">
                {/* Avg Prep Time Card */}
                <View className="flex-1 bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
                  <View className="flex-row items-center gap-2 mb-2">
                    <MaterialIcons name="schedule" size={18} color="#f39849" />
                    <Text className="text-[10px] font-bold text-zinc-400 uppercase">
                      Avg Prep
                    </Text>
                  </View>
                  <View className="flex-row items-baseline gap-2">
                    <Text className="text-xl font-bold text-zinc-900 dark:text-white">
                      {recipeStats.avgPrepTime}{" "}
                      <Text className="text-xs font-normal text-zinc-500">
                        min
                      </Text>
                    </Text>
                    <View className="flex-row items-center">
                      <MaterialIcons
                        name="arrow-downward"
                        size={12}
                        color="#f39849"
                      />
                      <Text className="text-[10px] text-[#f39849] font-bold">
                        {Math.abs(recipeStats.prepTimeTrend)}%
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Difficulty Preference Card */}
                <View className="flex-1 bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
                  <Text className="text-[10px] font-bold text-zinc-400 uppercase text-center mb-2">
                    Difficulty
                  </Text>
                  <View className="flex-row items-center justify-center">
                    <Text className="text-xl font-bold text-zinc-900 dark:text-white">
                      {selectedDifficulty}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Activity Chart Card */}
              <View className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                    Last 7 Days Activity
                  </Text>
                  <Text className="text-[10px] font-normal text-zinc-400">
                    Avg 4.2/day
                  </Text>
                </View>
                <View className="flex-row items-end justify-between h-32 px-2">
                  {weekActivity.map((item, index) => (
                    <View
                      key={index}
                      className="flex-col items-center gap-2 flex-1"
                    >
                      <View
                        className={`w-6 rounded-t-sm ${
                          item.value >= 80
                            ? "bg-[#f39849]"
                            : "bg-orange-200 dark:bg-orange-500/20"
                        }`}
                        style={{ height: `${item.value}%` }}
                      />
                      <Text className="text-[9px] font-bold text-zinc-400 uppercase">
                        {item.day}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
