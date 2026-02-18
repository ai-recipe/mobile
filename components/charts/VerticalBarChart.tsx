import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart as GiftedBarChart } from "react-native-gifted-charts";

/** Single segment in a stacked bar (value + color, optional label for legend) */
export type VerticalBarChartSegment = {
  value: number;
  color: string;
  label?: string;
};

export type VerticalBarChartDataPoint =
  | {
      value: number;
      label?: string;
      /** Per-bar color override */
      frontColor?: string;
    }
  | {
      /** Segments stacked in this bar (bottom to top). Use instead of value for segmented bars. */
      segments: VerticalBarChartSegment[];
      label?: string;
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
  /** When using segmented data, show a legend below the chart (uses segment labels from first bar) */
  showLegend?: boolean;
};

function isSegmentedPoint(
  d: VerticalBarChartDataPoint
): d is { segments: VerticalBarChartSegment[]; label?: string } {
  return "segments" in d && Array.isArray(d.segments);
}

function getBarTotal(d: VerticalBarChartDataPoint): number {
  if (isSegmentedPoint(d)) {
    return d.segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  }
  return d.value;
}

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
  showLegend = true,
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
  const legendTextColor = isDark ? "#D4D4D8" : "#475569";

  const useSegmented = data.some(isSegmentedPoint);

  const chartData = useSegmented
    ? undefined
    : data.map((d) => ({
        value: "value" in d ? d.value : 0,
        label: d.label,
        frontColor: "frontColor" in d ? d.frontColor ?? barColor : barColor,
      }));

  const stackData = useSegmented
    ? data.map((d) => {
        if (isSegmentedPoint(d)) {
          return {
            label: d.label,
            stacks: d.segments
              .filter((s) => s.value > 0)
              .map((s) => ({ value: s.value, color: s.color })),
          };
        }
        return {
          label: d.label,
          stacks: [
            {
              value: d.value,
              color: "frontColor" in d ? d.frontColor ?? barColor : barColor,
            },
          ],
        };
      })
    : undefined;

  const computedMaxValue =
    maxValue ??
    (data.length > 0
      ? Math.max(...data.map(getBarTotal), 0)
      : undefined);

  const legendSegments =
    useSegmented && showLegend && data.length > 0 && isSegmentedPoint(data[0])
      ? data[0].segments.filter(
          (s) => s.label != null && s.label !== "" && s.value > 0
        )
      : [];

  return (
    <View style={[styles.chartCard, { backgroundColor: cardBg }, style]}>
      {title != null && (
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      )}

      {useSegmented && stackData ? (
        <GiftedBarChart
          stackData={stackData}
          height={height}
          barWidth={barWidth}
          noOfSections={noOfSections}
          maxValue={computedMaxValue}
          isAnimated={isAnimated}
          formatYLabel={formatYLabel}
          scrollRef={scrollRef as React.RefObject<ScrollView | null>}
          yAxisThickness={1}
          yAxisColor={axisColor}
          hideYAxisText={false}
          yAxisLabelWidth={36}
          yAxisTextStyle={{
            color: axisTextColor,
            fontSize: 11,
          }}
          xAxisThickness={1}
          xAxisColor={axisColor}
          xAxisLabelTextStyle={{
            color: axisTextColor,
            fontSize: 12,
          }}
          labelsExtraHeight={8}
          hideRules={false}
          rulesColor={rulesColor}
          rulesType="solid"
          barBorderRadius={6}
        />
      ) : (
        <GiftedBarChart
          data={chartData}
          height={height}
          barWidth={barWidth}
          noOfSections={noOfSections}
          maxValue={maxValue}
          isAnimated={isAnimated}
          formatYLabel={formatYLabel}
          scrollRef={scrollRef as React.RefObject<ScrollView | null>}
          yAxisThickness={1}
          yAxisColor={axisColor}
          hideYAxisText={false}
          yAxisLabelWidth={36}
          yAxisTextStyle={{
            color: axisTextColor,
            fontSize: 11,
          }}
          xAxisThickness={1}
          xAxisColor={axisColor}
          xAxisLabelTextStyle={{
            color: axisTextColor,
            fontSize: 12,
          }}
          labelsExtraHeight={8}
          hideRules={false}
          rulesColor={rulesColor}
          rulesType="solid"
          barBorderRadius={6}
          frontColor={barColor}
        />
      )}

      {showLegend && legendSegments.length > 0 && (
        <View style={styles.legend}>
          {legendSegments.map((seg) => (
            <View key={seg.label} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: seg.color, borderRadius: 4 },
                ]}
              />
              <Text
                style={[styles.legendText, { color: legendTextColor }]}
                numberOfLines={1}
              >
                {seg.label}
              </Text>
            </View>
          ))}
        </View>
      )}
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
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(128,128,128,0.25)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
  },
  legendText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
