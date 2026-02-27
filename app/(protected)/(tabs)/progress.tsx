import { NumberInputModal } from "@/app/screens/components/NumberInputModal";
import { BMICard } from "@/components/BMICard";
import { LineChart } from "@/components/charts";
import { WeightGoalCard } from "@/components/WeightGoalCard";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppSelector } from "@/store/hooks";
import { postGoalPlanLogAsync } from "@/store/slices/goalPlansSlice";
import {
  fetchProgressDataAsync,
  postWeightLogAsync,
} from "@/store/slices/progressSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useDispatch } from "react-redux";
import { ScreenWrapper } from "../../../components/ScreenWrapper";
import { TabScreenWrapper } from "./components/TabScreenWrapper";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const dispatch = useDispatch();
  const { startDate, endDate, progressData, isProgressDataLoading } =
    useAppSelector((state) => state.progress);
  const { goalPlan: activeGoalPlan } = useAppSelector(
    (state) => state.goalPlans,
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProgressDataAsync({ startDate, endDate }) as any);
    }, [startDate, endDate, dispatch]),
  );

  const [isCurrentWeightModalVisible, setIsCurrentWeightModalVisible] =
    useState(false);
  const [isGoalWeightModalVisible, setIsGoalWeightModalVisible] =
    useState(false);

  const handleSaveCurrentWeight = (value: number) => {
    dispatch(postWeightLogAsync({ weightKg: value }) as any);
  };
  const handleSaveGoalWeight = (value: number) => {
    dispatch(
      postGoalPlanLogAsync({
        from: "progress",

        targetWeightKg: value,
        targetCalories: activeGoalPlan?.targetCalories,
        targetProteinG: activeGoalPlan?.targetProteinG,
        targetCarbsG: activeGoalPlan?.targetCarbsG,
        targetFatG: activeGoalPlan?.targetFatG,
        targetWaterMl: activeGoalPlan?.targetWaterMl,
      }) as any,
    );
  };

  const chartData = useMemo(() => {
    return [
      {
        date: "2026-02-15",
        weightKg: 101.2,
        targetWeightKg: 105.2,
      },
      {
        date: "2026-02-16",
        weightKg: 100.8,
        targetWeightKg: 105.2,
      },
      {
        date: "2026-02-17",
        weightKg: 99.5,
        targetWeightKg: 105.2,
      },
      {
        date: "2026-02-18",
        weightKg: 99.1,
        targetWeightKg: 105.2,
      },
      {
        date: "2026-02-19",
        weightKg: 98.5,
        targetWeightKg: 105.2,
      },
      {
        date: "2026-02-20",
        weightKg: 85.0,
        targetWeightKg: 102.5,
      },
      {
        date: "2026-02-21",
        weightKg: 72.0,
        targetWeightKg: 100.0,
      },
    ].map((item) => {
      // Parse the date to make it more readable (e.g., "Feb 19")
      const dateObj = new Date(item.date);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const day = dateObj.getDay();
      const dayName = dayNames[day];

      return {
        value: item.weightKg,
        label: formattedDate,
      };
    });
  }, [progressData.weightTrend.dailyBreakdown]);

  const stackData = useMemo(() => {
    return progressData.calorieIntake.dailyBreakdown.map((day) => {
      const date = new Date(day.date);
      // day and month name
      const label = `${date.getDay()} ${date.toLocaleDateString("en-US", {
        month: "short",
      })}`;

      // Calorie calculation
      const proteinCals = day.totalProteinGrams * 4;
      const carbCals = day.totalCarbsGrams * 4;
      const fatCals = day.totalFatGrams * 9;

      return {
        label: label,
        stacks: [
          {
            value: proteinCals,
            color: "#5C8CE4", // Protein
          },
          {
            value: carbCals,
            color: "#27AE60", // Carbs
          },
          {
            value: fatCals,
            color: "#E2B15B", // Fat
          },
        ],
      };
    });
  }, [progressData.calorieIntake.dailyBreakdown]);
  console.log(progressData.calorieIntake.dailyBreakdown);
  return (
    <ScreenWrapper>
      <TabScreenWrapper>
        <ScrollView>
          <View className="mx-4 flex-col gap-4">
            <WeightGoalCard
              currentWeight={progressData.weightTrend.currentKg}
              goalWeight={progressData.weightTrend.targetKg}
              onUpdateCurrentWeight={() => setIsCurrentWeightModalVisible(true)}
              onUpdateGoalWeight={() => setIsGoalWeightModalVisible(true)}
            />
            <BMICard bmi={progressData.weightTrend.bmi} />

            <View className="bg-white dark:bg-zinc-900 p-4 rounded-3xl overflow-hidden flex-1 relative mb-4">
              <Text className="text-lg font-bold mb-6">Calorie Intake</Text>
              <View className="absolute top-6 right-4 flex-row gap-2">
                <View className="h-4 w-4  rounded-full bg-[#5C8CE4]" />
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                  Protein
                </Text>
                <View className="h-4 w-4  rounded-full bg-[#47AE60]"></View>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                  Carbs
                </Text>
                <View className="h-4 w-4  rounded-full bg-[#E2B15B]"></View>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                  Fat
                </Text>
              </View>
              <BarChart
                width={300}
                barWidth={20}
                spacing={35}
                noOfSections={5}
                stackData={stackData}
                // Y-Axis formatting
                yAxisThickness={0}
                yAxisColor="#ccc"
                xAxisThickness={0}
                yAxisTextStyle={{ color: "#94A3B8", fontSize: 11 }}
                xAxisLabelTextStyle={{ color: "#94A3B8", fontSize: 11 }}
                // Styling
                showVerticalLines={false}
                yAxisLabelSuffix=" kcal"
              />
            </View>
            {false && (
              <LineChart
                title="Weight Progress Weekly"
                data={chartData}
                showDataPoints={false}
              />
            )}
          </View>

          <NumberInputModal
            visible={isCurrentWeightModalVisible}
            onClose={() => setIsCurrentWeightModalVisible(false)}
            onSave={handleSaveCurrentWeight}
            initialValue={progressData.weightTrend.currentKg || 0}
            min={30}
            max={200}
            unit="kg"
            title="Current weight"
            fractionDigits={1}
          />
          <NumberInputModal
            visible={isGoalWeightModalVisible}
            onClose={() => setIsGoalWeightModalVisible(false)}
            onSave={handleSaveGoalWeight}
            initialValue={progressData.weightTrend.targetKg || 0}
            min={30}
            max={200}
            unit="kg"
            title="Goal weight"
            fractionDigits={1}
          />
          <View className="p-4 flex flex-row gap-3 mb-8">
            <TouchableOpacity
              className="flex-1 bg-primary py-4 rounded-full items-center justify-center flex-row gap-3 "
              activeOpacity={0.7}
            >
              <MaterialIcons name="auto-awesome" size={18} color="white" />
              <Pressable
                onPress={() => {
                  router.push("/screens/survey");
                }}
              >
                <Text className="text-white font-bold text-base">
                  Auto Generate Goals
                </Text>
              </Pressable>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TabScreenWrapper>
    </ScreenWrapper>
  );
}
