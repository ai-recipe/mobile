import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MultiStepFormStep = {
  id: string;
  title: string;
  subtitle?: string;
  render: (ctx: {
    data: Record<string, unknown>;
    setValue: (key: string, value: unknown) => void;
    nextStep: () => void;
  }) => React.ReactNode;
};

type MultiStepFormProps = {
  steps: MultiStepFormStep[];
  initialData?: Record<string, unknown>;
  onFinish: (data: Record<string, unknown>) => void;
  headerTitle?: string;
  backButtonBehavior?: "pop" | "prevStep";
};

export function MultiStepForm({
  steps,
  initialData = {},
  onFinish,
  headerTitle = "Survey",
  backButtonBehavior = "pop",
}: MultiStepFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<Record<string, unknown>>(initialData);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const currentStep = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const setValue = useCallback((key: string, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const nextStep = useCallback(() => {
    if (isLast) {
      onFinish(data);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [isLast, data, onFinish, steps.length]);

  const handleBack = useCallback(() => {
    if (isFirst) {
      if (backButtonBehavior === "pop") router.back();
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  }, [isFirst, backButtonBehavior]);

  if (!currentStep) return null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header – padded for status bar / safe area */}
        <View
          className="flex-row items-center justify-between px-4 py-3 border-b"
          style={{
            paddingTop: insets.top,
            borderBottomColor: theme.border,
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
            className="size-12 items-center justify-center"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <MaterialIcons name="arrow-back-ios" size={20} color={theme.text} />
          </TouchableOpacity>
          <Text
            className="flex-1 text-center text-lg font-bold pr-12"
            style={{ color: theme.text }}
          >
            {headerTitle}
          </Text>
          <View className="w-12" />
        </View>

        {/* Progress */}
        <View className="flex-col gap-3 p-4">
          <View className="flex-row justify-between items-end">
            <Text
              className="text-base font-medium"
              style={{ color: isDark ? "rgba(255,255,255,0.8)" : theme.muted }}
            >
              Step {stepIndex + 1}
            </Text>
            <Text
              className="text-sm"
              style={{ color: isDark ? "rgba(255,255,255,0.6)" : theme.muted }}
            >
              {stepIndex + 1} of {steps.length}
            </Text>
          </View>
          <View
            className="h-2 rounded-full overflow-hidden"
            style={{
              backgroundColor: isDark ? "rgba(255,255,255,0.1)" : theme.border,
            }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: theme.tint,
              }}
            />
          </View>
        </View>

        {/* Step content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text
            className="text-[32px] font-bold leading-tight pt-2 pb-1"
            style={{ color: theme.text }}
          >
            {currentStep.title}
          </Text>
          {currentStep.subtitle && (
            <Text
              className="text-base pt-1 pb-4"
              style={{ color: isDark ? "rgba(255,255,255,0.7)" : theme.muted }}
            >
              {currentStep.subtitle}
            </Text>
          )}
          {currentStep.render({
            data,
            setValue,
            nextStep,
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
