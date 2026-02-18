import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Text, View } from "react-native";
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

const defaultFormatTooltip = (value: number) => `${value}kg`;

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
  const axisTextColor = isDark ? "#888888" : "#A0A0A0";

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900 p-4 rounded-2xl  mx-4">
      {title != null && (
        <Text className="text-md font-semibold mb-4">{title}</Text>
      )}

      <GiftedLineChart
        data={data}
        height={height}
        spacing={40}
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
        hideRules={true}
        rulesColor={rulesColor}
        rulesType="solid"
        yAxisColor="transparent"
        xAxisColor={"transparent"}
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
            <View className="bg-zinc-900 dark:bg-white p-2 rounded-lg flex-row items-center justify-center">
              <Text className="text-white dark:text-zinc-900">
                {items[0]?.value ?? 0} kg
              </Text>
            </View>
          ),
        }}
      />
    </View>
  );
}
