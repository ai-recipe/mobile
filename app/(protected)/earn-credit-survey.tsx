import {
  MultiStepForm,
  type MultiStepFormStep,
} from "@/components/MultiStepForm";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const COOKING_HABITS = [
  { id: "quick_meals", label: "Quick Meals", icon: "timer" as const },
  { id: "meal_prep", label: "Meal Prep", icon: "event" as const },
  { id: "baking", label: "Baking", icon: "restaurant" as const },
  {
    id: "exploring",
    label: "Exploring New Cuisines",
    icon: "explore" as const,
  },
] as const;

function useSurveySteps(): MultiStepFormStep[] {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";

  const inputBg = isDark ? "rgba(255,255,255,0.05)" : theme.card;
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : theme.border;
  const placeholderColor = isDark ? "rgba(255,255,255,0.3)" : theme.muted;

  return useMemo(
    () => [
      {
        id: "basic_info",
        title: "Tell us a bit about yourself",
        subtitle:
          "To personalize your recipe recommendations, we'd love to know your basics.",
        render: ({ data, setValue, nextStep }) => (
          <View className="gap-2 mt-2">
            <View className="py-3">
              <Text
                className="text-base font-medium pb-2"
                style={{ color: theme.text }}
              >
                Full Name
              </Text>
              <TextInput
                className="w-full rounded-xl h-14 px-4 text-base border"
                style={{
                  backgroundColor: inputBg,
                  borderColor: inputBorder,
                  color: theme.text,
                }}
                placeholder="Enter your full name"
                placeholderTextColor={placeholderColor}
                value={(data.fullName as string) ?? ""}
                onChangeText={(v) => setValue("fullName", v)}
              />
            </View>
            <View className="py-3">
              <Text
                className="text-base font-medium pb-2"
                style={{ color: theme.text }}
              >
                Age
              </Text>
              <TextInput
                className="w-full rounded-xl h-14 px-4 text-base border"
                style={{
                  backgroundColor: inputBg,
                  borderColor: inputBorder,
                  color: theme.text,
                }}
                placeholder="How old are you?"
                placeholderTextColor={placeholderColor}
                keyboardType="number-pad"
                value={(data.age as string) ?? ""}
                onChangeText={(v) => setValue("age", v)}
              />
            </View>
            <View className="flex-grow min-h-[120]" />
            <TouchableOpacity
              activeOpacity={0.9}
              className="w-full rounded-xl py-4 flex-row items-center justify-center gap-2"
              style={{ backgroundColor: theme.tint }}
              onPress={nextStep}
            >
              <Text className="text-white text-lg font-bold">Next</Text>
              <MaterialIcons name="arrow-forward" size={22} color="white" />
            </TouchableOpacity>
          </View>
        ),
      },
      {
        id: "cooking_goals",
        title: "What's your main cooking goal?",
        subtitle: "We'll tailor recipe suggestions to match.",
        render: ({ data, setValue, nextStep }) => {
          const goals = [
            { id: "health", label: "Eat healthier" },
            { id: "variety", label: "Try new recipes" },
            { id: "speed", label: "Cook faster" },
            { id: "family", label: "Feed the family well" },
          ];
          const selected = (data.cookingGoal as string) ?? "";
          return (
            <View className="gap-2 mt-2">
              {goals.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  activeOpacity={0.8}
                  className="p-4 rounded-xl border flex-row items-center justify-between"
                  style={{
                    backgroundColor:
                      selected === g.id ? "rgba(243,152,73,0.15)" : inputBg,
                    borderColor: selected === g.id ? theme.tint : inputBorder,
                  }}
                  onPress={() => setValue("cookingGoal", g.id)}
                >
                  <Text
                    className="text-lg font-medium"
                    style={{ color: theme.text }}
                  >
                    {g.label}
                  </Text>
                  {selected === g.id && (
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color={theme.tint}
                    />
                  )}
                </TouchableOpacity>
              ))}
              <View className="flex-grow min-h-[120]" />
              <TouchableOpacity
                activeOpacity={0.9}
                className="w-full rounded-xl py-4 flex-row items-center justify-center gap-2"
                style={{ backgroundColor: theme.tint }}
                onPress={nextStep}
              >
                <Text className="text-white text-lg font-bold">Next</Text>
                <MaterialIcons name="arrow-forward" size={22} color="white" />
              </TouchableOpacity>
            </View>
          );
        },
      },
      {
        id: "experience",
        title: "How would you describe your cooking experience?",
        subtitle: "This helps us set the right difficulty level.",
        render: ({ data, setValue, nextStep }) => {
          const options = [
            { id: "beginner", label: "Beginner" },
            { id: "intermediate", label: "Intermediate" },
            { id: "advanced", label: "Advanced" },
          ];
          const selected = (data.experience as string) ?? "";
          return (
            <View className="gap-2 mt-2">
              {options.map((o) => (
                <TouchableOpacity
                  key={o.id}
                  activeOpacity={0.8}
                  className="p-4 rounded-xl border flex-row items-center justify-between"
                  style={{
                    backgroundColor:
                      selected === o.id ? "rgba(243,152,73,0.15)" : inputBg,
                    borderColor: selected === o.id ? theme.tint : inputBorder,
                  }}
                  onPress={() => setValue("experience", o.id)}
                >
                  <Text
                    className="text-lg font-medium"
                    style={{ color: theme.text }}
                  >
                    {o.label}
                  </Text>
                  {selected === o.id && (
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color={theme.tint}
                    />
                  )}
                </TouchableOpacity>
              ))}
              <View className="flex-grow min-h-[120]" />
              <TouchableOpacity
                activeOpacity={0.9}
                className="w-full rounded-xl py-4 flex-row items-center justify-center gap-2"
                style={{ backgroundColor: theme.tint }}
                onPress={nextStep}
              >
                <Text className="text-white text-lg font-bold">Next</Text>
                <MaterialIcons name="arrow-forward" size={22} color="white" />
              </TouchableOpacity>
            </View>
          );
        },
      },
      {
        id: "cooking_habits",
        title: "What are your cooking habits?",
        subtitle:
          "Select all that apply to personalize your recipe recommendations.",
        render: ({ data, setValue, nextStep }) => {
          const selectedSet = new Set((data.habits as string[]) ?? []);
          const toggle = (id: string) => {
            const next = new Set(selectedSet);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            setValue("habits", Array.from(next));
          };
          return (
            <View className="gap-2 mt-2">
              {COOKING_HABITS.map((h) => {
                const checked = selectedSet.has(h.id);
                return (
                  <TouchableOpacity
                    key={h.id}
                    activeOpacity={0.8}
                    className="p-4 rounded-xl border flex-row-reverse items-center gap-3 justify-between"
                    style={{
                      backgroundColor: inputBg,
                      borderColor: checked ? theme.tint : inputBorder,
                    }}
                    onPress={() => toggle(h.id)}
                  >
                    <View
                      className="h-6 w-6 rounded border items-center justify-center"
                      style={{
                        borderColor: checked ? theme.tint : inputBorder,
                        backgroundColor: checked ? theme.tint : "transparent",
                      }}
                    >
                      {checked && (
                        <MaterialIcons name="check" size={16} color="white" />
                      )}
                    </View>
                    <View className="flex-row items-center gap-3 flex-1">
                      <MaterialIcons
                        name={h.icon}
                        size={24}
                        color={theme.tint}
                      />
                      <Text
                        className="text-lg font-medium"
                        style={{ color: theme.text }}
                      >
                        {h.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
              <View className="flex-grow min-h-[120]" />
              <TouchableOpacity
                activeOpacity={0.9}
                className="w-full rounded-xl py-5 flex-row items-center justify-center gap-2"
                style={{ backgroundColor: theme.tint }}
                onPress={nextStep}
              >
                <MaterialIcons name="check-circle" size={22} color="white" />
                <Text className="text-white text-lg font-bold">
                  Finish Survey
                </Text>
              </TouchableOpacity>
              <Text
                className="text-center text-xs mt-4"
                style={{ color: theme.muted }}
              >
                You can change these preferences later in settings
              </Text>
            </View>
          );
        },
      },
    ],
    [theme, isDark, inputBg, inputBorder, placeholderColor]
  );
}

export default function EarnCreditSurveyScreen() {
  const steps = useSurveySteps();

  const handleFinish = (data: Record<string, unknown>) => {
    // TODO: submit to API / grant credits
    console.log("Survey completed", data);
    router.back();
  };

  return (
    <MultiStepForm
      steps={steps}
      onFinish={handleFinish}
      headerTitle="Kredi Kazan"
      backButtonBehavior="pop"
    />
  );
}
