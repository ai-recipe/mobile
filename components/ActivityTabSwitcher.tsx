import React from "react";
import { Pressable, Text, View } from "react-native";

interface ActivityTabSwitcherProps {
  activeTab: "meal" | "water";
  onTabChange: (tab: "meal" | "water") => void;
  colors: string[];
}

export const ActivityTabSwitcher: React.FC<ActivityTabSwitcherProps> = ({
  activeTab,
  onTabChange,
  colors = ["#f39849", "#f39849"],
}) => {
  return (
    <View className="px-6 mb-4">
      <View className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1 flex-row">
        <Pressable
          onPress={() => onTabChange("meal")}
          className={`flex-1 py-3 rounded-xl ${
            activeTab === "meal"
              ? "bg-white dark:bg-zinc-800"
              : "bg-transparent"
          }`}
        >
          <Text
            className={`text-center text-sm font-bold ${
              activeTab === "meal"
                ? `text-[${colors[0]}]`
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            Meal Activity
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onTabChange("water")}
          className={`flex-1 py-3 rounded-xl ${
            activeTab === "water"
              ? "bg-white dark:bg-zinc-800"
              : "bg-transparent"
          }`}
        >
          <Text
            className={`text-center text-sm font-bold ${
              activeTab === "water"
                ? `text-[${colors[1]}]`
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            Water Activity
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
