import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";

interface OnboardingStepWelcomeProps {
  onNext: () => void;
  animatedScanStyle: any;
  image: string;
  description: string;
  welcomeText: string;
}

export const OnboardingStepWelcome = ({
  onNext,
  animatedScanStyle,
  image,
  description,
  welcomeText,
}: OnboardingStepWelcomeProps) => {
  return (
    <View className="flex-1 px-6">
      <View className="flex-1 justify-center items-center">
        <View className="w-full aspect-square bg-primary/10 rounded-3xl items-center justify-center border-primary/20 overflow-hidden">
          {/* Phone Illustration Mockup */}
          <View className="w-48 h-80 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-4 border-gray-100 dark:border-gray-700 overflow-hidden relative">
            <View className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full z-10" />
            <View className="mt-8 flex-1 bg-gray-50 dark:bg-gray-900 m-2 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
              <View className="absolute inset-2 border-2 border-primary rounded-lg items-center justify-center">
                <View className="bg-primary/90 px-3 py-1 rounded-full mb-1">
                  <Text className="text-[10px] text-white font-bold">
                    Domates
                  </Text>
                </View>
                <View className="bg-primary/90 px-3 py-1 rounded-full">
                  <Text className="text-[10px] text-white font-bold">
                    Biber
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Scanning Line Animation */}
          <Animated.View
            style={[animatedScanStyle]}
            className="absolute left-0 right-0 h-1 bg-primary shadow-lg shadow-primary"
          />
        </View>
      </View>

      <View className="py-8 items-center">
        <Text className="text-3xl font-black text-center text-text dark:text-white mb-3">
          {welcomeText}
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
          <Text className="text-white text-lg font-bold">Sonraki</Text>
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
