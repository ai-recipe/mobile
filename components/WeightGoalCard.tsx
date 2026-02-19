import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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

  return (
    <View className="m-4 p-5 rounded-3xl  bg-white dark:bg-[#1C1C1E]">
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
            {currentWeight}{" "}
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
            {goalWeight}{" "}
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
              width: "65%", // TODO
            }}
          />
        </View>
        <Text
          className="text-xs font-medium text-center"
          style={{ color: secondaryText }}
        >
          {Math.abs(currentWeight - goalWeight).toFixed(1)} {unit} to go
        </Text>
      </View>
    </View>
  );
};
