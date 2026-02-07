import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useCopilot } from "react-native-copilot";

export const TourTooltip = () => {
  const { goToNext, goToPrev, stop, currentStep, isFirstStep, isLastStep } =
    useCopilot();

  if (!currentStep) return null;

  return (
    <View className="bg-white dark:bg-zinc-800 p-6 rounded-[32px] w-[280px] shadow-2xl border border-zinc-100 dark:border-zinc-700">
      <View className="flex-row items-center justify-between mb-4">
        <View className="bg-orange-100 dark:bg-orange-500/20 px-3 py-1.5 rounded-full">
          <Text className="text-[#f39849] font-black text-[10px] uppercase tracking-[1px]">
            {currentStep.name}
          </Text>
        </View>
        <TouchableOpacity onPress={stop}>
          <MaterialIcons name="close" size={20} color="#a1a1aa" />
        </TouchableOpacity>
      </View>

      <Text className="text-zinc-900 dark:text-white text-lg font-bold mb-2">
        {currentStep.text}
      </Text>

      <View className="flex-row items-center justify-between mt-6">
        <View className="flex-row gap-1">
          {!isFirstStep && (
            <TouchableOpacity
              onPress={goToPrev}
              className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-700"
            >
              <Text className="text-zinc-600 dark:text-zinc-300 font-bold text-xs">
                Geri
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={isLastStep ? stop : goToNext}
          className="bg-[#f39849] px-6 py-2.5 rounded-xl shadow-lg shadow-orange-200 dark:shadow-none"
        >
          <Text className="text-white font-black text-xs uppercase tracking-[0.5px]">
            {isLastStep ? "Anladım!" : "Sıradaki"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
