import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

export type FeatureType = "ai-chef" | "progress";

interface OnboardingStepFeatureProps {
  featureType: FeatureType;
  title: string;
  titleHighlight: string;
  description: string;
  onNext: () => void;
}

const AIChefIllustration = () => (
  <View className="w-full bg-primary/5 rounded-3xl p-5 border border-primary/15 gap-3">
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
      <View className="flex-row items-center gap-2 mb-3">
        <View className="w-7 h-7 bg-primary/10 rounded-full items-center justify-center">
          <MaterialCommunityIcons name="camera-outline" size={14} color="#f39849" />
        </View>
        <Text className="text-[10px] font-black tracking-widest text-secondary uppercase">
          Ingredients Detected
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {[
          { icon: "food-apple-outline" as const, label: "Tomato" },
          { icon: "chili-mild" as const, label: "Pepper" },
          { icon: "food-drumstick-outline" as const, label: "Chicken" },
          { icon: "leaf" as const, label: "Garlic" },
        ].map((item) => (
          <View
            key={item.label}
            className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full gap-1"
          >
            <MaterialCommunityIcons name={item.icon} size={11} color="#f39849" />
            <Text className="text-[11px] font-bold text-primary">{item.label}</Text>
          </View>
        ))}
      </View>
    </View>

    <View className="items-center">
      <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center">
        <MaterialCommunityIcons name="arrow-down" size={18} color="#f39849" />
      </View>
    </View>

    <View className="bg-primary rounded-2xl p-4">
      <Text className="text-white/70 text-[10px] font-black tracking-widest mb-1 uppercase">
        AI Recipe
      </Text>
      <Text className="text-white text-base font-black mb-3">
        Spicy Chicken Stir-Fry
      </Text>
      <View className="flex-row gap-4">
        {[
          { label: "Calories", value: "420" },
          { label: "Protein", value: "38g" },
          { label: "Carbs", value: "24g" },
          { label: "Fat", value: "18g" },
        ].map((m) => (
          <View key={m.label} className="items-center">
            <Text className="text-white/60 text-[9px] font-bold">{m.label}</Text>
            <Text className="text-white text-sm font-black">{m.value}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

const ProgressIllustration = () => (
  <View className="w-full bg-primary/5 rounded-3xl p-5 border border-primary/15 gap-3">
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-4">
      <Text className="text-[10px] font-black tracking-widest text-secondary uppercase mb-3">
        Today's Nutrition
      </Text>
      {[
        { label: "Calories", current: "1,840", goal: "2,200", percent: 84, color: "#f39849" },
        { label: "Protein", current: "98g", goal: "120g", percent: 82, color: "#60B5FF" },
        { label: "Carbs", current: "180g", goal: "250g", percent: 72, color: "#a78bfa" },
        { label: "Fat", current: "48g", goal: "70g", percent: 69, color: "#fb923c" },
      ].map((m) => (
        <View key={m.label} className="mb-2.5">
          <View className="flex-row justify-between mb-1">
            <Text className="text-xs font-bold text-text dark:text-white">{m.label}</Text>
            <Text className="text-[11px] text-secondary">
              {m.current} / {m.goal}
            </Text>
          </View>
          <View className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{ width: `${m.percent}%`, backgroundColor: m.color }}
            />
          </View>
        </View>
      ))}
    </View>

    <View className="flex-row gap-2">
      {[
        {
          icon: "water" as const,
          color: "#60B5FF",
          value: "1.6L",
          sub: "of 2.5L",
          bg: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
          icon: "scale-bathroom" as const,
          color: "#22c55e",
          value: "22.4",
          sub: "BMI",
          bg: "bg-green-50 dark:bg-green-900/20",
        },
        {
          icon: "trending-down" as const,
          color: "#f39849",
          value: "-3.2kg",
          sub: "30 days",
          bg: "bg-orange-50 dark:bg-orange-900/20",
        },
      ].map((s) => (
        <View
          key={s.sub}
          className={`flex-1 ${s.bg} rounded-2xl p-3 items-center`}
        >
          <MaterialCommunityIcons name={s.icon} size={20} color={s.color} />
          <Text
            className="text-sm font-black mt-1 text-text dark:text-white"
            style={{ color: s.color }}
          >
            {s.value}
          </Text>
          <Text className="text-[10px] text-secondary">{s.sub}</Text>
        </View>
      ))}
    </View>
  </View>
);

export const OnboardingStepFeature = ({
  featureType,
  title,
  titleHighlight,
  description,
  onNext,
}: OnboardingStepFeatureProps) => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 px-6">
      <View className="flex-1 justify-center">
        {featureType === "ai-chef" ? (
          <AIChefIllustration />
        ) : (
          <ProgressIllustration />
        )}
      </View>

      <View className="py-8 items-center">
        <Text className="text-3xl font-black text-center text-text dark:text-white mb-1">
          {title}{" "}
          <Text className="text-primary">{titleHighlight}</Text>
        </Text>
        <Text className="text-base text-center text-secondary dark:text-gray-300 leading-relaxed font-medium mt-2">
          {description}
        </Text>
      </View>

      <View className="pb-10">
        <Pressable
          onPress={onNext}
          className="w-full bg-primary py-5 rounded-full shadow-xl shadow-primary/30 flex-row items-center justify-center gap-2 active:opacity-90"
        >
          <Text className="text-white text-lg font-bold">{t("common.next")}</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
};
