import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type Segment = {
  value: number;
  color: string;
  label?: string;
};

export type SegmentedBar = {
  /** Label for this bar (e.g. "Mon", "Protein") */
  label: string;
  /** Segments that make up the bar (order = left to right) */
  segments: Segment[];
};

export type SegmentedBarChartProps = {
  /** Bars to render; each bar is split into segments */
  bars: SegmentedBar[];
  /** Chart title */
  title?: string;
  /** Height of each bar in pixels */
  barHeight?: number;
  /** Gap between bars */
  barGap?: number;
  /** Border radius of each segment */
  borderRadius?: number;
  /** Show legend below chart (uses segment labels/colors from first bar) */
  showLegend?: boolean;
  /** Override dark mode */
  isDark?: boolean;
  /** Optional container style */
  style?: object;
};

function getSegmentTotal(segments: Segment[]) {
  return segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
}

export function SegmentedBarChart({
  bars,
  title,
  barHeight = 28,
  barGap = 14,
  borderRadius = 10,
  showLegend = true,
  isDark: isDarkProp,
  style,
}: SegmentedBarChartProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const isDark = isDarkProp ?? colorScheme === "dark";

  const cardBg = isDark ? "#1C1C1E" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1A1A1A";
  const labelColor = isDark ? "#A1A1AA" : "#64748B";
  const legendTextColor = isDark ? "#D4D4D8" : "#475569";

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 600 });
  }, [bars]);

  const legendSegments =
    showLegend && bars.length > 0
      ? bars[0].segments.filter((s) => s.label != null && s.label !== "")
      : [];

  return (
    <View style={[styles.chartCard, { backgroundColor: cardBg }, style]}>
      {title != null && (
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      )}

      <View style={styles.barsContainer}>
        {bars.map((bar, barIndex) => {
          const total = getSegmentTotal(bar.segments);
          const scale = total > 0 ? 1 : 0;

          return (
            <View
              key={bar.label + barIndex}
              style={[
                styles.barRow,
                { marginBottom: barIndex < bars.length - 1 ? barGap : 0 },
              ]}
            >
              <View style={styles.barLabel}>
                <Text
                  style={[styles.barLabelText, { color: labelColor }]}
                  numberOfLines={1}
                >
                  {bar.label}
                </Text>
              </View>
              <View
                style={[styles.barTrack, { height: barHeight, borderRadius }]}
              >
                {total === 0 ? (
                  <View
                    style={[
                      styles.segment,
                      {
                        flex: 1,
                        backgroundColor: isDark ? "#27272A" : "#E4E4E7",
                        borderTopLeftRadius: borderRadius,
                        borderBottomLeftRadius: borderRadius,
                        borderTopRightRadius: borderRadius,
                        borderBottomRightRadius: borderRadius,
                      },
                    ]}
                  />
                ) : (
                  bar.segments
                    .filter((s) => s.value > 0)
                    .map((segment, segIndex) => {
                      const widthPercent =
                        total > 0 ? segment.value / total : 0;
                      const isFirst = segIndex === 0;
                      const isLast =
                        segIndex ===
                        bar.segments.filter((s) => s.value > 0).length - 1;
                      return (
                        <SegmentBar
                          key={segment.label ?? segIndex}
                          widthPercent={widthPercent}
                          color={segment.color}
                          barHeight={barHeight}
                          borderRadius={borderRadius}
                          isFirst={isFirst}
                          isLast={isLast}
                          progress={progress}
                        />
                      );
                    })
                )}
              </View>
            </View>
          );
        })}
      </View>

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

type SegmentBarProps = {
  widthPercent: number;
  color: string;
  barHeight: number;
  borderRadius: number;
  isFirst: boolean;
  isLast: boolean;
  progress: Animated.SharedValue<number>;
};

function SegmentBar({
  widthPercent,
  color,
  barHeight,
  borderRadius,
  isFirst,
  isLast,
  progress,
}: SegmentBarProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    flex: widthPercent * progress.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        styles.segment,
        {
          height: barHeight,
          backgroundColor: color,
          borderTopLeftRadius: isFirst ? borderRadius : 0,
          borderBottomLeftRadius: isFirst ? borderRadius : 0,
          borderTopRightRadius: isLast ? borderRadius : 0,
          borderBottomRightRadius: isLast ? borderRadius : 0,
          marginLeft: isFirst ? 0 : 2,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  chartCard: {
    margin: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    marginLeft: 4,
  },
  barsContainer: {
    marginBottom: 8,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  barLabel: {
    width: 44,
    marginRight: 10,
  },
  barLabelText: {
    fontSize: 13,
    fontWeight: "500",
  },
  barTrack: {
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  segment: {
    minWidth: 4,
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
