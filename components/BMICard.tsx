import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

// Custom hook to handle smooth number counting and sliding animations
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
      useNativeDriver: false, // Required because we are updating state for text/layout
    }).start();

    return () => {
      anim.removeListener(listenerId);
    };
  }, [targetValue, duration]);

  return value;
};

interface BMICardProps {
  bmi: number;
}

export const BMICard: React.FC<BMICardProps> = ({ bmi }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  // Feed the prop into our custom animation hook
  const animatedBMI = useAnimatedNumber(bmi);

  const getBMIStatus = (val: number) => {
    if (val < 18.5) return { label: "Underweight", color: "#5C8CE4" };
    if (val < 25) return { label: "Healthy", color: "#27AE60" };
    if (val < 30) return { label: "Overweight", color: "#E2B15B" };
    return { label: "Obese", color: "#D15F5F" };
  };

  // Derive status from the animated value so color/label change dynamically
  const status = getBMIStatus(animatedBMI);

  // Calculate position percentage for the indicator using animated value
  const maxBMI = 50;
  const clampedBMI = Math.min(Math.max(animatedBMI, 0), maxBMI);
  const positionPercent = (clampedBMI / maxBMI) * 100;

  return (
    <View className="p-6 rounded-[20px] bg-white dark:bg-[#1C1C1E]">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-lg font-semibold" style={{ color: theme.text }}>
          Your BMI
        </Text>
      </View>

      <View className="flex-row items-center mb-7 gap-3">
        <Text
          className="text-[48px] font-extrabold leading-[56px]"
          style={{ color: theme.text }}
        >
          {animatedBMI.toFixed(1)}
        </Text>
        <View className="flex-row items-center shrink">
          <Text
            className="text-base font-medium"
            style={{ color: isDark ? "#A1A1AA" : "#64748B" }}
          >
            Your weight is{" "}
          </Text>
          <View
            className="px-3 py-1.5 rounded-2xl ml-1"
            style={{ backgroundColor: status.color + "15" }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: status.color }}
            >
              {status.label}
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-4">
        <View className="h-4 relative justify-center">
          <View className="flex-row h-2.5 gap-0.5">
            <View
              className="h-full rounded-l-md"
              style={{
                flex: 18.5,
                backgroundColor: "#5C8CE4",
              }}
            />
            <View
              className="h-full"
              style={{ flex: 25 - 18.5, backgroundColor: "#27AE60" }}
            />
            <View
              className="h-full"
              style={{ flex: 30 - 25, backgroundColor: "#E2B15B" }}
            />
            <View
              className="h-full rounded-r-md"
              style={{
                flex: 50 - 30,
                backgroundColor: "#D15F5F",
              }}
            />
          </View>
          {/* Because positionPercent changes every frame from the useAnimatedNumber state, 
            this vertical line will smoothly slide across the bar. 
          */}
          <View
            className="absolute top-[-4px] bottom-[-4px] w-[2.5px] z-10 rounded-sm"
            style={{
              left: `${positionPercent}%`,
              backgroundColor: isDark ? "#FFFFFF" : "#1A1A1A",
            }}
          />
        </View>

        <View className="flex-row mt-2 h-5 relative">
          <Text
            className="absolute text-[10px] font-semibold"
            style={{ left: "0%", color: isDark ? "#71717A" : "#94A3B8" }}
          >
            0
          </Text>
          <Text
            className="absolute text-[10px] font-semibold"
            style={{ left: "37%", color: isDark ? "#71717A" : "#94A3B8" }}
          >
            18.5
          </Text>
          <Text
            className="absolute text-[10px] font-semibold"
            style={{ left: "50%", color: isDark ? "#71717A" : "#94A3B8" }}
          >
            25
          </Text>
          <Text
            className="absolute text-[10px] font-semibold"
            style={{ left: "60%", color: isDark ? "#71717A" : "#94A3B8" }}
          >
            30
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between mt-6 gap-y-4">
        <LegendItem
          color="#5C8CE4"
          label="Underweight"
          range="<18.5"
          isDark={isDark}
        />
        <LegendItem
          color="#27AE60"
          label="Healthy"
          range="18.5-24.9"
          isDark={isDark}
        />
        <LegendItem
          color="#E2B15B"
          label="Overweight"
          range="25.0-29.9"
          isDark={isDark}
        />
        <LegendItem
          color="#D15F5F"
          label="Obese"
          range=">30.0"
          isDark={isDark}
        />
      </View>
    </View>
  );
};

const LegendItem = ({
  color,
  label,
  range,
  isDark,
}: {
  color: string;
  label: string;
  range: string;
  isDark: boolean;
}) => (
  <View className="w-[48%]">
    <View className="flex-row items-center gap-1.5 mb-1">
      <View
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text
        className="text-xs font-semibold"
        style={{ color: isDark ? "#A1A1AA" : "#64748B" }}
      >
        {label}
      </Text>
    </View>
    <Text
      className="text-[11px] pl-3.5"
      style={{ color: isDark ? "#71717A" : "#94A3B8" }}
    >
      {range}
    </Text>
  </View>
);
