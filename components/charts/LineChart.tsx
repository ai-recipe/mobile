import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart as GiftedLineChart } from "react-native-gifted-charts";

export type LineChartDataPoint = {
  value: number;
  label?: string;
};

export type LineChartProps = {
  /** Data points: value and optional x-axis label */
  data: LineChartDataPoint[];
  /** Chart title shown above the chart */
  title?: string;
  /** Height of the chart area in pixels */
  height?: number;
  /** Line/area color (defaults to theme primary) */
  color?: string;
  /** Line thickness */
  thickness?: number;
  /** Show curved line */
  curved?: boolean;
  /** Show filled area under the line */
  areaChart?: boolean;
  /** Show data point dots */
  showDataPoints?: boolean;
  /** Show horizontal rule lines */
  hideRules?: boolean;
  /** Show vertical lines */
  showVerticalLines?: boolean;
  /** Enable animation on mount/update */
  isAnimated?: boolean;
  /** Custom formatter for tooltip value */
  formatTooltipValue?: (value: number) => string;
  /** Override dark mode (defaults to useColorScheme) */
  isDark?: boolean;
  /** Optional container style */
  style?: object;
};

const defaultFormatTooltip = (value: number) => String(Math.round(value));

export function LineChart({
  data,
  title,
  height = 220,
  color,
  thickness = 3,
  curved = true,
  areaChart = true,
  showDataPoints = false,
  hideRules = false,
  showVerticalLines = false,
  isAnimated = true,
  formatTooltipValue = defaultFormatTooltip,
  isDark: isDarkProp,
  style,
}: LineChartProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const isDark = isDarkProp ?? colorScheme === "dark";
  const lineColor = color ?? theme.primary;

  const rulesColor = isDark ? "#333333" : "#F0F0F0";
  const xAxisColor = isDark ? "#333333" : "#E5E5E5";
  const axisTextColor = isDark ? "#888888" : "#A0A0A0";
  const tooltipBg = isDark ? "#333333" : "#FFFFFF";
  const tooltipTextColor = isDark ? "#FFFFFF" : "#1A1A1A";
  const titleColor = isDark ? "#FFFFFF" : "#1A1A1A";
  const cardBg = isDark ? "#1C1C1E" : "#FFFFFF";

  return (
    <View style={[styles.chartCard, { backgroundColor: cardBg }, style]}>
      {title != null && (
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      )}

      <GiftedLineChart
        data={data}
        height={height}
        spacing={Math.max(24, 320 / Math.max(1, data.length - 1))}
        initialSpacing={15}
        endSpacing={15}
        color={lineColor}
        thickness={thickness}
        curved={curved}
        isAnimated={isAnimated}
        areaChart={areaChart}
        startFillColor={lineColor}
        startOpacity={0.3}
        endFillColor={lineColor}
        endOpacity={0.02}
        hideDataPoints={!showDataPoints}
        showVerticalLines={showVerticalLines}
        hideRules={hideRules}
        rulesColor={rulesColor}
        rulesType="solid"
        yAxisColor="transparent"
        xAxisColor={xAxisColor}
        yAxisTextStyle={{
          color: axisTextColor,
          fontSize: 11,
        }}
        xAxisLabelTextStyle={{
          color: axisTextColor,
          fontSize: 11,
        }}
        pointerConfig={{
          pointerStripHeight: height - 20,
          pointerStripColor: lineColor,
          pointerStripWidth: 2,
          pointerColor: lineColor,
          radius: 6,
          pointerLabelWidth: 80,
          pointerLabelHeight: 90,
          activatePointersOnLongPress: false,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (items: { value: number }[]) => (
            <View style={[styles.tooltip, { backgroundColor: tooltipBg }]}>
              <Text style={[styles.tooltipText, { color: tooltipTextColor }]}>
                {formatTooltipValue(items[0]?.value ?? 0)}
              </Text>
            </View>
          ),
        }}
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
    marginLeft: 10,
  },
  tooltip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
