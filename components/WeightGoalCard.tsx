import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

// Custom hook to handle smooth number counting animations
const useAnimatedNumber = (targetValue: number, duration: number = 400) => {
  const [value, setValue] = useState(targetValue || 0);
  const anim = useRef(new Animated.Value(targetValue || 0)).current;

  useEffect(() => {
    anim.removeAllListeners();
    const listenerId = anim.addListener((state) => {
      setValue(state.value);
    });

    Animated.timing(anim, {
      toValue: targetValue || 0,
      duration,
      useNativeDriver: false, // State updates require non-native driver
    }).start();

    return () => {
      anim.removeListener(listenerId);
    };
  }, [targetValue, duration]);

  return value;
};

interface WeightGoalCardProps {
  currentWeight: number;
  goalWeight: number;
  unit?: string;
  onUpdateCurrentWeight?: () => void;
  onUpdateGoalWeight?: () => void;
}

export const WeightGoalCard: React.FC<WeightGoalCardProps> = ({
  currentWeight,
  goalWeight,
  unit = "kg",
  onUpdateCurrentWeight,
  onUpdateGoalWeight,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  const secondaryText = isDark ? "#A1A1AA" : "#64748B";

  // Feed the props into our custom animation hook
  const animatedCurrent = useAnimatedNumber(currentWeight);
  const animatedGoal = useAnimatedNumber(goalWeight);

  // Calculate the remaining weight using the animated values so it also animates!
  const animatedRemaining = Math.abs(animatedCurrent - animatedGoal);

  return (
    <View className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1E]">
      <View className="flex-row items-center">
        <View className="flex-1 items-center">
          <Text
            className="text-sm font-semibold mb-2 uppercase tracking-[0.5px]"
            style={{ color: secondaryText }}
          >
            Current Weight
          </Text>
          <Text
            className="text-4xl font-extrabold mb-3"
            style={{ color: theme.text }}
          >
            {/* Format to 1 decimal place to make the animation look fluid */}
            {animatedCurrent.toFixed(1)}{" "}
            <Text
              className="text-base font-medium opacity-60"
              style={{ color: theme.text }}
            >
              {unit}
            </Text>
          </Text>
          <TouchableOpacity
            className="px-6 py-2 rounded-full flex-row items-center justify-center bg-transparent border border-primary"
            onPress={onUpdateCurrentWeight}
          >
            <Text className="text-primary font-bold text-md text-center">
              Update
            </Text>
          </TouchableOpacity>
        </View>

        <View
          className="w-[1px] h-full mx-2.5"
          style={{ backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0" }}
        />

        <View className="flex-1 items-center">
          <Text
            className="text-sm font-semibold mb-2 uppercase tracking-[0.5px]"
            style={{ color: secondaryText }}
          >
            Goal Weight
          </Text>
          <Text
            className="text-4xl font-extrabold mb-3"
            style={{ color: theme.text }}
          >
            {animatedGoal.toFixed(1)}{" "}
            <Text
              className="text-base font-medium opacity-60"
              style={{ color: theme.text }}
            >
              {unit}
            </Text>
          </Text>
          <TouchableOpacity
            className="px-6 py-2 rounded-full flex-row items-center justify-center bg-transparent border border-primary"
            onPress={onUpdateGoalWeight}
          >
            <Text className="text-primary font-bold text-md text-center">
              Update
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-5 gap-2">
        <View
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0" }}
        >
          <View
            className="h-full rounded-full"
            style={{
              backgroundColor: theme.primary,
              width: "65%", // TODO: You can also use Animated.View here later to animate the bar's width
            }}
          />
        </View>
        <Text
          className="text-xs font-medium text-center"
          style={{ color: secondaryText }}
        >
          {animatedRemaining.toFixed(1)} {unit} to go
        </Text>
      </View>
    </View>
  );
};
