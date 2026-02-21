import { NumberInputModal } from "@/app/screens/components/NumberInputModal";
import { BMICard } from "@/components/BMICard";
import { WeightGoalCard } from "@/components/WeightGoalCard";
import { LineChartDataPoint } from "@/components/charts";
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
import React, { useCallback, useState } from "react";
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
            onUpdateGoalWeight={() => setIsGoalWeightModalVisible(true)}
          />
          {/**    <LineChart
            data={activityLineData}
            title="Weight Progress"
            height={220}
            color={theme.primary}
            formatTooltipValue={(v) => `${Math.round(v)}%`}
          /> */}

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
        </ScrollView>
      </TabScreenWrapper>
    </ScreenWrapper>
  );
}
