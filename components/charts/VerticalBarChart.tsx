import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart as GiftedBarChart } from "react-native-gifted-charts";

export type VerticalBarChartDataPoint = {
  value: number;
  label?: string;
  /** Per-bar color override */
  frontColor?: string;
};

export type VerticalBarChartProps = {
  /** Bar data: value and optional x-axis label */
  data: VerticalBarChartDataPoint[];
  /** Chart title shown above the chart */
  title?: string;
  /** Height of the chart area in pixels */
  height?: number;
  /** Bar color (defaults to theme primary); overridden by data[].frontColor */
  color?: string;
  /** Width of each bar */
  barWidth?: number;
  /** Number of horizontal sections on the Y-axis (controls Y labels) */
  noOfSections?: number;
  /** Override max value for Y-axis; default is derived from data */
  maxValue?: number;
  /** Enable bar animation on mount/update */
  isAnimated?: boolean;
  /** Format Y-axis label (e.g. "1000" → "1k") */
  formatYLabel?: (label: string) => string;
  /** Override dark mode (defaults to useColorScheme) */
  isDark?: boolean;
  /** Optional container style */
  style?: object;
  /** Ref for the chart's scroll view (scrollToEnd, scrollToIndex); see gifted-charts barchart docs */
  scrollRef?: React.RefObject<unknown>;
};

export function VerticalBarChart({
  data,
  title,
  height = 220,
  color,
  barWidth = 28,
  noOfSections = 4,
  maxValue,
  isAnimated = true,
  formatYLabel,
  isDark: isDarkProp,
  style,
  scrollRef: scrollRefProp,
}: VerticalBarChartProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const isDark = isDarkProp ?? colorScheme === "dark";
  const defaultScrollRef = useRef(null);
  const scrollRef = scrollRefProp ?? defaultScrollRef;

  const barColor = color ?? theme.primary;
  const cardBg = isDark ? "#1C1C1E" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1A1A1A";
  const axisColor = isDark ? "#404040" : "#D4D4D4";
  const axisTextColor = isDark ? "#888888" : "#64748B";
  const rulesColor = isDark ? "#2A2A2A" : "#F0F0F0";

  const chartData = data.map((d) => ({
    value: d.value,
    label: d.label,
    frontColor: d.frontColor ?? barColor,
  }));

  return (
    <View style={[styles.chartCard, { backgroundColor: cardBg }, style]}>
      {title != null && (
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      )}

      <GiftedBarChart
        data={chartData}
        height={height}
        barWidth={barWidth}
        noOfSections={noOfSections}
        maxValue={maxValue}
        isAnimated={isAnimated}
        formatYLabel={formatYLabel}
        scrollRef={scrollRef as React.RefObject<ScrollView | null>}
        // Visible Y-axis line and labels
        yAxisThickness={1}
        yAxisColor={axisColor}
        hideYAxisText={false}
        yAxisLabelWidth={36}
        yAxisTextStyle={{
          color: axisTextColor,
          fontSize: 11,
        }}
        // Visible X-axis line and labels
        xAxisThickness={1}
        xAxisColor={axisColor}
        xAxisLabelTextStyle={{
          color: axisTextColor,
          fontSize: 12,
        }}
        labelsExtraHeight={8}
        // Grid
        hideRules={false}
        rulesColor={rulesColor}
        rulesType="solid"
        barBorderRadius={6}
        frontColor={barColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    margin: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 24,
    marginLeft: 4,
  },
});
