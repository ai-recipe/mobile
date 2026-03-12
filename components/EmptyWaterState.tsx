import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

interface EmptyWaterStateProps {
  onAddWater: (amountMl: number) => void;
  waterAdding: boolean;
}

export const EmptyWaterState: React.FC<EmptyWaterStateProps> = ({
  onAddWater,
  waterAdding,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  return (
    <View className="px-6 mb-6">
      <View
        className="rounded-3xl border border-zinc-100 dark:border-zinc-800 px-6 py-12 flex-col items-center justify-center gap-6"
        style={{
          backgroundColor: colors.background,
        }}
      >
        {/* Icon Container */}
        <View
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{
            backgroundColor: "#3b82f620",
          }}
        >
          <MaterialIcons name="opacity" size={40} color="#3b82f6" />
        </View>

        {/* Main Text */}
        <View className="items-center gap-2">
          <Text
            className="text-xl font-bold text-center"
            style={{ color: colors.text }}
          >
            {t("water.noWaterLogged")}
          </Text>
          <Text
            className="text-sm text-center max-w-[280px] leading-relaxed"
            style={{ color: `${colors.text}99` }}
          >
            {t("water.noWaterHint")}
          </Text>
        </View>
      </View>
    </View>
  );
};
