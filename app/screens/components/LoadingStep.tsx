import React from "react";
import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOut,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

interface LoadingStepProps {
  loadingText: string;
  direction?: "forward" | "backward";
}

export function LoadingStep({
  loadingText,
  direction = "forward",
}: LoadingStepProps) {
  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      className="flex-1 items-center justify-center px-8 bg-white dark:bg-zinc-900"
    >
      <StatusBar barStyle="dark-content" />
      <View className="absolute size-80 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />

      <View className="items-center mb-10 z-10">
        <View className="size-28 bg-white dark:bg-zinc-800 rounded-[32px] items-center justify-center shadow-2xl shadow-orange-500/20 mb-10 border border-orange-50 dark:border-zinc-700">
          <ActivityIndicator
            size="large"
            color="#f39849"
            style={{ transform: [{ scale: 1.5 }] }}
          />
        </View>

        <Animated.View
          key={loadingText}
          entering={FadeInDown.springify()}
          exiting={FadeOut}
        >
          <Text className="text-2xl font-black text-center text-zinc-900 dark:text-white mb-3">
            {loadingText}
          </Text>
        </Animated.View>

        <Text className="text-zinc-500 dark:text-zinc-400 text-center font-medium leading-6 max-w-[250px]">
          Fotoğraftaki malzemeler taranıyor ve analiz ediliyor...
        </Text>
      </View>
    </Animated.View>
  );
}
