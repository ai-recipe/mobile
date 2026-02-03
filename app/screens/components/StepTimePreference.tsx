import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

const TIME_OPTIONS = [15, 30, 60];

interface StepTimePreferenceProps {
  value: number;
  onChange: (time: number) => void;
  onNext: () => void;
  direction?: "forward" | "backward";
}

export function StepTimePreference({
  value,
  onChange,
  onNext,
  direction = "forward",
}: StepTimePreferenceProps) {
  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      className="flex-1 px-5 pt-2"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
          Hazırlık <Text className="text-[#f39849]">Süresi</Text>
        </Text>
        <Text className="text-zinc-500 dark:text-zinc-400 text-base mb-8">
          Yemek hazırlamak için ne kadar vaktiniz var?
        </Text>

        <View className="flex-row gap-3">
          {TIME_OPTIONS.map((time) => (
            <TouchableOpacity
              key={time.toString()}
              onPress={() => onChange(time)}
              className={`flex-1 py-6 px-2 rounded-[32px] border-2 items-center justify-center ${
                value === time
                  ? "bg-[#f39849] border-[#f39849]"
                  : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700"
              }`}
            >
              <Text
                className={`font-black text-2xl ${
                  value === time
                    ? "text-white"
                    : "text-zinc-900 dark:text-white"
                }`}
              >
                {time}
              </Text>
              <Text
                className={`font-bold text-sm mt-1 ${
                  value === time
                    ? "text-white/80"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                Dakika
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-10 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800">
          <View className="flex-row items-center gap-3 mb-2">
            <View className="size-8 bg-orange-100 dark:bg-orange-500/20 rounded-full items-center justify-center">
              <MaterialIcons name="lightbulb" size={18} color="#f39849" />
            </View>
            <Text className="text-zinc-900 dark:text-white font-bold">
              İpucu
            </Text>
          </View>
          <Text className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Seçtiğiniz süreye göre yapay zeka şefimiz en lezzetli ve pratik
            tarifleri listeleyecektir.
          </Text>
        </View>
      </ScrollView>

      <View className="pb-8 pt-2">
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.9}
          className="bg-[#f39849] w-full h-[64px] rounded-2xl items-center justify-center shadow-lg shadow-orange-500/30 flex-row gap-2"
        >
          <Text className="text-white font-extrabold text-lg">Devam Et</Text>
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
