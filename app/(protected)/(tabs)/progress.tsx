import { RulerPickerModal } from "@/app/screens/components/RulerPickerModal";
import { BMICard } from "@/components/BMICard";
import { WeightGoalCard } from "@/components/WeightGoalCard";
import { LineChart, LineChartDataPoint } from "@/components/charts";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppSelector } from "@/store/hooks";
import { fetchProgressDataAsync } from "@/store/slices/progressSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
const activityLineData: LineChartDataPoint[] = [
  { value: 78, label: "Mon" },
  { value: 82, label: "Tue" },
  { value: 80, label: "Wed" },
  { value: 85, label: "Thu" },
  { value: 88, label: "Fri" },
  { value: 90, label: "Sat" },
  { value: 92, label: "Sun" },
  { value: 95, label: "Now" },
];

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const dispatch = useDispatch();
  const { startDate, endDate, progressData, isProgressDataLoading } =
    useAppSelector((state) => state.progress);
  const { goalPlan: activeGoalPlan } = useAppSelector(
    (state) => state.goalPlans,
  );

  console.log("activeGoalPlan", JSON.stringify(activeGoalPlan, null, 2));
  console.log("progressData", JSON.stringify(progressData, null, 2));

  useEffect(() => {
    dispatch(fetchProgressDataAsync({ startDate, endDate }) as any);
  }, [startDate, endDate, dispatch]);

  const [isCurrentWeightModalVisible, setIsCurrentWeightModalVisible] =
    useState(false);
  return (
    <ScreenWrapper>
      <TabScreenWrapper>
        <></>
        <ScrollView>
          <View className="p-4">
            <TouchableOpacity
              className="w-full bg-white dark:bg-zinc-900 py-4 rounded-3xl items-center justify-center flex-row gap-3 shadow-sm"
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="auto-awesome"
                size={18}
                color={Colors[colorScheme].primary}
              />
              <Pressable
                onPress={() => {
                  router.push("/screens/survey");
                }}
              >
                <Text className="text-primary dark:text-white font-bold text-base">
                  Auto Generate Goals
                </Text>
              </Pressable>
            </TouchableOpacity>
          </View>
          <BMICard bmi={progressData.weightTrend.bmi} />
          <WeightGoalCard
            currentWeight={progressData.weightTrend.currentKg}
            goalWeight={progressData.weightTrend.targetKg}
            onUpdateCurrentWeight={() => setIsCurrentWeightModalVisible(true)}
            onUpdateGoalWeight={() => console.log("Update goal")}
          />
          <LineChart
            data={activityLineData}
            title="Weight Progress"
            height={220}
            color={theme.primary}
            formatTooltipValue={(v) => `${Math.round(v)}%`}
          />
          <RulerPickerModal
            visible={isCurrentWeightModalVisible}
            onClose={() => setIsCurrentWeightModalVisible(false)}
            onSave={(value) => console.log("Save current weight", value)}
            initialValue={progressData.weightTrend.currentKg}
            min={30}
            max={200}
            step={0.1}
            unit="kg"
          />
        </ScrollView>
      </TabScreenWrapper>
    </ScreenWrapper>
  );
}
