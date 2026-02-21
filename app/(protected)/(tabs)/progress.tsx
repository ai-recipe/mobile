import { NumberInputModal } from "@/app/screens/components/NumberInputModal";
import { BMICard } from "@/components/BMICard";
import { LineChart, SegmentedBarChart } from "@/components/charts";
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
    console.log("value", value);
    dispatch(postWeightLogAsync({ weightKg: value }) as any);
  };
  const handleSaveGoalWeight = (value: number) => {
    dispatch(postGoalPlanLogAsync({ targetWeightKg: value }) as any);
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

  const chartBars = useMemo(() => {
    return progressData.calorieIntake.dailyBreakdown.map((day) => {
      // Format date to "Wed", "Thu", etc.
      const label = new Date(day.date).toLocaleDateString("en-US", {
        weekday: "short",
      });

      return {
        label: label,
        segments: [
          {
            label: "Protein",
            value: day.totalProteinGrams,
            color: "#5C8CE4", // Blue
          },
          {
            label: "Carbs",
            value: day.totalCarbsGrams,
            color: "#27AE60", // Green
          },
          {
            label: "Fat",
            value: day.totalFatGrams,
            color: "#E2B15B", // Yellow/Orange
          },
        ],
      };
    });
  }, [progressData.calorieIntake.dailyBreakdown]);
  return (
    <ScreenWrapper>
      <TabScreenWrapper>
        <></>
        <ScrollView>
          <WeightGoalCard
            currentWeight={progressData.weightTrend.currentKg}
            goalWeight={progressData.weightTrend.targetKg}
            onUpdateCurrentWeight={() => setIsCurrentWeightModalVisible(true)}
            onUpdateGoalWeight={() => setIsGoalWeightModalVisible(true)}
          />
          <SegmentedBarChart
            title="Calorie Intake Weekly"
            bars={chartBars}
            showLegend={false}
          />

          <LineChart
            title="Weight Progress Weekly"
            data={chartData}
            showDataPoints={false}
          />

          <BMICard bmi={progressData.weightTrend.bmi} />

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
          <View className="p-4 flex flex-row gap-3">
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
            <TouchableOpacity
              className="flex-1 bg-white dark:bg-zinc-900 py-4 rounded-full items-center justify-center flex-row gap-3 "
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="edit"
                size={18}
                color={Colors[colorScheme].primary}
              />
              <Pressable
                onPress={() => {
                  router.push("/screens/survey");
                }}
              >
                <Text className="text-primary dark:text-white font-bold text-base">
                  Edit Nutrition Goals
                </Text>
              </Pressable>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TabScreenWrapper>
    </ScreenWrapper>
  );
}
