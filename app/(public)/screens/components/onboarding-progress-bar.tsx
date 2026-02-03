import React from "react";
import { View } from "react-native";

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingProgressBar = ({
  currentStep,
  totalSteps,
}: OnboardingProgressBarProps) => (
  <View className="flex-row justify-center items-center gap-3 py-6">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <View
        key={index}
        className={`h-2 rounded-full ${
          currentStep === index
            ? "w-8 bg-primary"
            : "w-2 bg-gray-300 dark:bg-gray-700"
        }`}
      />
    ))}
  </View>
);
