import { TabScreenWrapper } from "@/app/(protected)/(tabs)/components/TabScreenWrapper";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

const PRIMARY = "#f39849";
const SECONDARY = "#4d8df3";

type PeriodType = "weekly" | "monthly";

const WEEK_CALORIE_BARS = [
  { day: "Mon", height: 0.8 },
  { day: "Tue", height: 0.95 },
  { day: "Wed", height: 0.6 },
  { day: "Thu", height: 0.8 },
  { day: "Fri", height: 0.7 },
  { day: "Sat", height: 0.4 },
  { day: "Sun", height: 0 },
];

const MILESTONES = [
  {
    id: "streak",
    title: "7 Day Streak",
    subtitle: "Unlocked 2h ago",
    icon: "local-fire-department" as const,
    color: PRIMARY,
    bgClass: "bg-orange-100 dark:bg-orange-900/30",
    unlocked: true,
  },
  {
    id: "goal",
    title: "Goal Reached",
    subtitle: "2,500 kcal limit",
    icon: "emoji-events" as const,
    color: SECONDARY,
    bgClass: "bg-blue-100 dark:bg-blue-900/30",
    unlocked: true,
    bordered: true,
  },
  {
    id: "water",
    title: "Water Hero",
    subtitle: "5 more days",
    icon: "lock" as const,
    color: "#71717a",
    bgClass: "bg-zinc-100 dark:bg-zinc-800",
    unlocked: false,
  },
];

const BAR_HEIGHT = 96;

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const backgroundColor = theme.background;
  const isDark = colorScheme === "dark";
  const [period, setPeriod] = React.useState<PeriodType>("weekly");

  const calorieAvg = 1840;
  const calorieTrend = -12;
  const waterGoalPercent = 75;
  const avgWaterLiters = 2.1;
  const weightKg = 72.4;
  const weightChangeKg = -0.8;

  const waterCircumference = 2 * Math.PI * 40;
  const waterStrokeOffset = useMemo(
    () => waterCircumference - (waterGoalPercent / 100) * waterCircumference,
    [waterGoalPercent, waterCircumference],
  );

  const mutedText = isDark ? "#a1a1aa" : "#71717a";
  const trackBg = isDark ? "#3f3f46" : "#f4f4f5";

  return (
    <ScreenWrapper>
      <TabScreenWrapper>
        <View className="flex-1" style={{ backgroundColor }}>
          {/* Tab Navigation - same design as index (Meal/Water) */}
          <View className="px-6 mb-4 mt-4">
            <View className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1 flex-row">
              <Pressable
                onPress={() => setPeriod("weekly")}
                className={`flex-1 py-3 rounded-xl ${
                  period === "weekly"
                    ? "bg-white dark:bg-zinc-800"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    period === "weekly"
                      ? "text-[#f39849]"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  Weekly
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setPeriod("monthly")}
                className={`flex-1 py-3 rounded-xl ${
                  period === "monthly"
                    ? "bg-white dark:bg-zinc-800"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    period === "monthly"
                      ? "text-[#f39849]"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  Monthly
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Main Content - same ScrollView pattern as index */}
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Calorie Intake card */}
            <View className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 mb-6">
              <View style={styles.calorieHeader}>
                <View>
                  <Text style={[styles.labelUppercase, { color: mutedText }]}>
                    CALORIE INTAKE
                  </Text>
                  <Text style={[styles.calorieValue, { color: theme.text }]}>
                    {calorieAvg.toLocaleString()}{" "}
                    <Text style={[styles.calorieUnit, { color: mutedText }]}>
                      avg/day
                    </Text>
                  </Text>
                </View>
                <View
                  style={[
                    styles.trendBadge,
                    {
                      backgroundColor: isDark
                        ? "rgba(34,197,94,0.25)"
                        : "#dcfce7",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.trendText,
                      {
                        color: isDark ? "#86efac" : "#166534",
                      },
                    ]}
                  >
                    {calorieTrend}% vs last week
                  </Text>
                </View>
              </View>
              <View style={styles.barChartRow}>
                {WEEK_CALORIE_BARS.map((item, i) => (
                  <View
                    key={item.day}
                    style={[styles.barCol, { marginHorizontal: 2 }]}
                  >
                    <View
                      style={[
                        styles.barTrack,
                        {
                          height: BAR_HEIGHT,
                          backgroundColor: trackBg,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: BAR_HEIGHT * item.height,
                            backgroundColor: PRIMARY,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.barLabel, { color: mutedText }]}>
                      {item.day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Avg Water + Weight Trend row */}
            <View className="flex-row gap-4 mb-5">
              <View className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 items-center">
                <Text
                  style={[
                    styles.labelUppercase,
                    { color: mutedText, marginBottom: 16 },
                  ]}
                >
                  AVG WATER
                </Text>
                <View style={styles.waterRingWrap}>
                  <Svg
                    width={96}
                    height={96}
                    style={{ transform: [{ rotate: "-90deg" }] }}
                  >
                    <Circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke={trackBg}
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <Circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke={SECONDARY}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={waterCircumference}
                      strokeDashoffset={waterStrokeOffset}
                      strokeLinecap="round"
                    />
                  </Svg>
                  <View style={StyleSheet.absoluteFillObject}>
                    <View style={styles.waterRingCenter}>
                      <Text style={[styles.waterValue, { color: theme.text }]}>
                        {avgWaterLiters}
                      </Text>
                      <Text style={[styles.waterUnit, { color: mutedText }]}>
                        Liters
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.waterGoalText, { color: mutedText }]}>
                  {waterGoalPercent}% of daily goal
                </Text>
              </View>

              <View className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 flex-col">
                <Text
                  style={[
                    styles.labelUppercase,
                    { color: mutedText, marginBottom: 8 },
                  ]}
                >
                  WEIGHT TREND
                </Text>
                <View style={{ flex: 1, justifyContent: "flex-start" }}>
                  <Text style={[styles.weightValue, { color: theme.text }]}>
                    {weightKg}{" "}
                    <Text style={[styles.weightUnit, { color: mutedText }]}>
                      kg
                    </Text>
                  </Text>
                  <Text style={[styles.weightChange, { color: SECONDARY }]}>
                    {weightChangeKg >= 0 ? "+" : ""}
                    {weightChangeKg} kg this week
                  </Text>
                </View>
                <View style={styles.weightChartWrap}>
                  <Svg width="100%" height={48} viewBox="0 0 100 40">
                    <Path
                      d="M0,35 Q25,30 50,15 T100,5"
                      fill="none"
                      stroke={SECONDARY}
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </Svg>
                </View>
              </View>
            </View>

            {/* Milestones 
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-4 px-1">
                <Text className="text-lg font-bold text-zinc-900 dark:text-white">
                  Milestones
                </Text>
                <Pressable hitSlop={12}>
                  <Text className="text-sm font-semibold text-[#f39849]">
                    View all
                  </Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  gap: 16,
                  paddingBottom: 8,
                }}
              >
                {MILESTONES.map((m) => (
                  <View
                    key={m.id}
                    className={`min-w-[140px] bg-white dark:bg-zinc-900 p-4 rounded-3xl flex-col items-center border ${
                      m.bordered
                        ? "border-[#f39849]/20"
                        : "border-zinc-100 dark:border-zinc-800"
                    }`}
                    style={{ opacity: m.unlocked ? 1 : 0.5 }}
                  >
                    <View
                      style={[
                        styles.milestoneIconWrap,
                        isDark
                          ? m.id === "streak"
                            ? { backgroundColor: "rgba(249,115,22,0.2)" }
                            : m.id === "goal"
                            ? { backgroundColor: "rgba(59,130,246,0.2)" }
                            : { backgroundColor: "#3f3f46" }
                          : m.id === "streak"
                          ? { backgroundColor: "#ffedd5" }
                          : m.id === "goal"
                          ? { backgroundColor: "#dbeafe" }
                          : { backgroundColor: "#f4f4f5" },
                      ]}
                    >
                      <MaterialIcons
                        name={m.icon}
                        size={28}
                        color={m.unlocked ? m.color : mutedText}
                      />
                    </View>
                    <Text
                      style={[styles.milestoneTitle, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {m.title}
                    </Text>
                    <Text
                      style={[styles.milestoneSubtitle, { color: mutedText }]}
                      numberOfLines={1}
                    >
                      {m.subtitle}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            */}
          </ScrollView>
        </View>
      </TabScreenWrapper>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  labelUppercase: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  calorieHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  calorieUnit: {
    fontSize: 14,
    fontWeight: "400",
  },
  trendBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "700",
  },
  barChartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: BAR_HEIGHT + 24,
    paddingHorizontal: 4,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  barTrack: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  barFill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
  waterRingWrap: {
    width: 96,
    height: 96,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  waterRingCenter: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  waterValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  waterUnit: {
    fontSize: 10,
  },
  waterGoalText: {
    marginTop: 16,
    fontSize: 11,
  },
  weightValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  weightUnit: {
    fontSize: 12,
    fontWeight: "400",
  },
  weightChange: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 4,
  },
  weightChartWrap: {
    height: 48,
    marginTop: 8,
    width: "100%",
  },
  milestoneIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  milestoneSubtitle: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
  },
});
