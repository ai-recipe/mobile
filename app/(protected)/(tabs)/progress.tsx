import { BMICard } from "@/components/BMICard";
import { WeightGoalCard } from "@/components/WeightGoalCard";
import { LineChart, LineChartDataPoint } from "@/components/charts";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, TouchableOpacity } from "react-native";
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

  return (
    <ScreenWrapper>
      <TabScreenWrapper>
        <>
          <TouchableOpacity
            className="w-full bg-white dark:bg-zinc-900 py-4  items-center justify-center flex-row gap-3"
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
        </>
        <ScrollView>
          <BMICard bmi={26.5} />
          <WeightGoalCard
            currentWeight={82.4}
            goalWeight={75.0}
            onUpdateCurrentWeight={() => console.log("Update current")}
            onUpdateGoalWeight={() => console.log("Update goal")}
          />
          <LineChart
            data={activityLineData}
            title="Weight Progress"
            height={220}
            color={theme.primary}
            formatTooltipValue={(v) => `${Math.round(v)}%`}
          />
        </ScrollView>
      </TabScreenWrapper>
    </ScreenWrapper>
  );
}
