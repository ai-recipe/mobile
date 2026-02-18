import {
  LineChart,
  type LineChartDataPoint,
  type SegmentedBar,
  SegmentedBarChart,
  VerticalBarChart,
  type VerticalBarChartDataPoint,
} from "@/components/charts";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ScreenWrapper } from "../../../components/ScreenWrapper";
import { TabScreenWrapper } from "./components/TabScreenWrapper";

// Example line chart data (e.g. weekly activity or weight trend)
const activityLineData: LineChartDataPoint[] = [
  { value: 0, label: "Mon" },
  { value: 20, label: "Tue" },
  { value: 18, label: "Wed" },
  { value: 40, label: "Thu" },
  { value: 36, label: "Fri" },
  { value: 60, label: "Sat" },
  { value: 54, label: "Sun" },
  { value: 85, label: "Now" },
];

// Example vertical bar chart data (e.g. daily calories or steps)
const weeklyBarData: VerticalBarChartDataPoint[] = [
  { value: 250, label: "Mon" },
  { value: 500, label: "Tue" },
  { value: 320, label: "Wed" },

  { value: 600, label: "Thu" },
  { value: 256, label: "Fri" },
  { value: 400, label: "Sat" },
  { value: 380, label: "Sun" },
];

// Example segmented bars (e.g. macros per day or category breakdown)
const weeklyMacroBars: SegmentedBar[] = [
  {
    label: "Mon",
    segments: [
      { value: 45, color: "#f39849", label: "Carbs" },
      { value: 30, color: "#22c55e", label: "Protein" },
      { value: 25, color: "#3b82f6", label: "Fat" },
    ],
  },
  {
    label: "Tue",
    segments: [
      { value: 50, color: "#f39849", label: "Carbs" },
      { value: 28, color: "#22c55e", label: "Protein" },
      { value: 22, color: "#3b82f6", label: "Fat" },
    ],
  },
  {
    label: "Wed",
    segments: [
      { value: 42, color: "#f39849", label: "Carbs" },
      { value: 35, color: "#22c55e", label: "Protein" },
      { value: 23, color: "#3b82f6", label: "Fat" },
    ],
  },
  {
    label: "Thu",
    segments: [
      { value: 48, color: "#f39849", label: "Carbs" },
      { value: 32, color: "#22c55e", label: "Protein" },
      { value: 20, color: "#3b82f6", label: "Fat" },
    ],
  },
  {
    label: "Fri",
    segments: [
      { value: 52, color: "#f39849", label: "Carbs" },
      { value: 30, color: "#22c55e", label: "Protein" },
      { value: 18, color: "#3b82f6", label: "Fat" },
    ],
  },
  {
    label: "Sat",
    segments: [
      { value: 55, color: "#f39849", label: "Carbs" },
      { value: 25, color: "#22c55e", label: "Protein" },
      { value: 20, color: "#3b82f6", label: "Fat" },
    ],
  },
  {
    label: "Sun",
    segments: [
      { value: 40, color: "#f39849", label: "Carbs" },
      { value: 38, color: "#22c55e", label: "Protein" },
      { value: 22, color: "#3b82f6", label: "Fat" },
    ],
  },
];

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <ScreenWrapper>
      <TabScreenWrapper>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LineChart
            data={activityLineData}
            title="Activity Progress"
            height={220}
            color={theme.primary}
            formatTooltipValue={(v) => `${Math.round(v)}%`}
          />

          <VerticalBarChart
            data={weeklyBarData}
            title="Weekly overview"
            height={220}
            color={theme.primary}
            noOfSections={4}
          />

          <SegmentedBarChart
            title="Weekly macros"
            bars={weeklyMacroBars}
            barHeight={26}
            barGap={12}
            borderRadius={8}
            showLegend
          />
        </ScrollView>
      </TabScreenWrapper>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
