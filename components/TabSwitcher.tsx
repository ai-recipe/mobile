import React from "react";
import { Pressable, Text, View } from "react-native";

interface TabOption {
  id: string;
  label: string;
}

interface TabSwitcherProps {
  options: TabOption[];
  activeTab: string;
  onTabChange: (id: string) => void;
  activeColor?: string;
  inactiveColor?: string;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({
  options,
  activeTab,
  onTabChange,
  activeColor = "#f39849",
}) => {
  return (
    <View className="px-6 mb-4">
      <View className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1 flex-row">
        {options.map((option) => {
          const isActive = activeTab === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onTabChange(option.id)}
              className={`flex-1 py-3 rounded-xl ${
                isActive ? "bg-white dark:bg-zinc-800" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-center text-sm font-bold ${
                  isActive ? "" : "text-zinc-500 dark:text-zinc-400"
                }`}
                style={isActive ? { color: activeColor } : {}}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
