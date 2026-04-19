import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";

interface OnboardingStepWelcomeProps {
  onNext: () => void;
  animatedScanStyle: any;
  description: string;
}

export const OnboardingStepWelcome = ({
  onNext,
  animatedScanStyle,
  description,
}: OnboardingStepWelcomeProps) => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 px-6">
      {/* Dashboard Illustration */}
      <View className="flex-1 justify-center items-center">
        <View className="w-full bg-primary/8 rounded-3xl p-5 border border-primary/15 gap-3 overflow-hidden">
          {/* Scanning line animation */}
          <Animated.View
            style={[animatedScanStyle]}
            className="absolute left-0 right-0 h-0.5 bg-primary/50 shadow-lg shadow-primary z-10"
          />

          {/* App bar */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                {t("common.today")}
              </Text>
              <Text className="text-xs font-black text-text dark:text-white">
                {t("onboarding.illustrationDate")}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-full">
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={11}
                color="#f39849"
              />
              <Text className="text-[11px] font-black text-primary">
                {t("onboarding.illustrationCredits")}
              </Text>
            </View>
          </View>

          {/* Calorie ring + macros */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex-row items-center gap-4">
            {/* Ring mockup */}
            <View className="items-center justify-center w-20 h-20">
              <View className="w-20 h-20 rounded-full border-4 border-gray-100 dark:border-gray-700 items-center justify-center">
                <View
                  className="absolute w-20 h-20 rounded-full border-4 border-primary"
                  style={{
                    borderTopColor: "transparent",
                    borderLeftColor: "transparent",
                    transform: [{ rotate: "45deg" }],
                  }}
                />
                <View className="items-center">
                  <Text className="text-base font-black text-text dark:text-white leading-tight">
                    480
                  </Text>
                  <Text className="text-[9px] text-secondary font-bold">
                    kcal
                  </Text>
                </View>
              </View>
            </View>
            {/* Macro bars */}
            <View className="flex-1 gap-2">
              {[
                {
                  label: "Protein",
                  value: "38g",
                  goal: "120g",
                  pct: 32,
                  color: "#60B5FF",
                },
                {
                  label: "Carbs",
                  value: "42g",
                  goal: "250g",
                  pct: 17,
                  color: "#a78bfa",
                },
                {
                  label: "Fat",
                  value: "18g",
                  goal: "70g",
                  pct: 26,
                  color: "#fb923c",
                },
              ].map((m) => (
                <View key={m.label}>
                  <View className="flex-row justify-between mb-0.5">
                    <Text className="text-[10px] font-bold text-secondary">
                      {m.label}
                    </Text>
                    <Text className="text-[10px] text-secondary">
                      {m.value}
                    </Text>
                  </View>
                  <View className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{ width: `${m.pct}%`, backgroundColor: m.color }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Scanned meal entry */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 flex-row items-center gap-3">
            <View className="w-9 h-9 bg-primary/10 rounded-xl items-center justify-center">
              <MaterialCommunityIcons
                name="camera-outline"
                size={18}
                color="#f39849"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-black text-text dark:text-white">
                Lemon Garlic Salmon
              </Text>
              <Text className="text-[10px] text-secondary font-medium">
                Lunch · 480 kcal · P 38g · C 42g · F 18g
              </Text>
            </View>
            <View className="w-5 h-5 bg-green-100 rounded-full items-center justify-center">
              <MaterialCommunityIcons name="check" size={12} color="#22c55e" />
            </View>
          </View>

          {/* Water + steps quick row */}
          <View className="flex-row gap-2">
            <View className="flex-1 bg-white dark:bg-gray-800 rounded-2xl px-3 py-2.5 flex-row items-center gap-2">
              <MaterialCommunityIcons name="water" size={16} color="#60B5FF" />
              <View>
                <Text className="text-xs font-black text-text dark:text-white">
                  1.2L
                </Text>
                <Text className="text-[9px] text-secondary">of 2.5L</Text>
              </View>
            </View>
            <View className="flex-1 bg-white dark:bg-gray-800 rounded-2xl px-3 py-2.5 flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="trending-down"
                size={16}
                color="#22c55e"
              />
              <View>
                <Text className="text-xs font-black text-text dark:text-white">
                  -2.4kg
                </Text>
                <Text className="text-[9px] text-secondary">this month</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Headline */}
      <View className="py-7 items-center">
        <Text className="text-4xl font-black text-center text-text dark:text-white leading-tight mb-3">
          {t("onboarding.headlinePrefix")}{" "}
          <Text className="text-primary">
            {t("onboarding.headlineHighlight")}
          </Text>
        </Text>
        <Text className="text-base text-center text-secondary dark:text-gray-300 leading-relaxed font-medium">
          {description}
        </Text>
      </View>

      <View className="pb-10">
        <Pressable
          onPress={onNext}
          className="w-full bg-primary py-5 rounded-full shadow-xl shadow-primary/30 flex-row items-center justify-center gap-2 active:opacity-90"
        >
          <Text className="text-white text-lg font-bold">
            {t("common.next")}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );
};
