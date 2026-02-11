import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface StepSurveyLoaderProps {
  onNext: () => void;
  message?: string;
}

export function StepSurveyLoader({
  onNext,
  message = "Size özel planınız hazırlanıyor...",
}: StepSurveyLoaderProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1);

    const timer = setTimeout(() => {
      onNext();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onNext, rotation]);

  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);
  const messages = [
    "Tercihleriniz analiz ediliyor...",
    "Size özel planınız hazırlanıyor...",
    "Beslenme haritanız oluşturuluyor...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1100);
    return () => clearInterval(interval);
  }, [messages.length]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="flex-1 items-center justify-center py-12"
    >
      <View className="items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-[40px] border border-zinc-100 dark:border-zinc-700 w-full">
        <Animated.View
          style={animatedStyle}
          className="size-24 items-center justify-center mb-8"
        >
          <View className="size-20 bg-[#f39849]/10 rounded-full items-center justify-center">
            <MaterialCommunityIcons name="auto-fix" size={48} color="#f39849" />
          </View>
        </Animated.View>

        <ActivityIndicator size="small" color="#f39849" className="mb-4" />

        <Text className="text-xl font-bold text-center text-zinc-900 dark:text-white mb-2 leading-relaxed h-16">
          {messages[currentMessageIndex]}
        </Text>
        <Text className="text-sm text-center text-zinc-500 dark:text-zinc-400">
          Analiz ediliyor ve hedefleriniz belirleniyor...
        </Text>
      </View>
    </Animated.View>
  );
}
