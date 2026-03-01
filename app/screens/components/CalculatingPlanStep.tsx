import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

const MESSAGES = [
  "Hedefleriniz analiz ediliyor...",
  "Makro hedefleriniz hesaplanıyor...",
  "Kişisel beslenme planınız oluşturuluyor...",
  "AI modeliniz kalibre ediliyor...",
  "Son rötuşlar yapılıyor...",
];

const AUTO_ADVANCE_MS = 3000;

interface Props {
  onNext: () => void;
}

export function CalculatingPlanStep({ onNext }: Props) {
  const [msgIndex, setMsgIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  const msgOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(onNext, AUTO_ADVANCE_MS);

    // Fill progress bar
    Animated.timing(progress, {
      toValue: 1,
      duration: AUTO_ADVANCE_MS,
      useNativeDriver: false,
    }).start();

    // Pulse icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.12,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 0.92,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Cycle messages with fade
    const cycleDuration = AUTO_ADVANCE_MS / MESSAGES.length;
    const msgTimer = setInterval(() => {
      Animated.sequence([
        Animated.timing(msgOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(msgOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, cycleDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(msgTimer);
    };
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900 items-center justify-center px-8">
      {/* Pulsing icon */}
      <Animated.View
        style={{ transform: [{ scale: iconScale }] }}
        className="w-28 h-28 rounded-full bg-[#f39849]/10 items-center justify-center mb-8"
      >
        <MaterialIcons name="psychology" size={52} color="#f39849" />
      </Animated.View>

      <Text className="text-2xl font-extrabold text-zinc-900 dark:text-white text-center leading-tight mb-3">
        Kişisel Planınız{"\n"}Hazırlanıyor
      </Text>

      <Animated.Text
        style={{ opacity: msgOpacity }}
        className="text-zinc-500 dark:text-zinc-400 text-base text-center mb-10"
        numberOfLines={1}
      >
        {MESSAGES[msgIndex]}
      </Animated.Text>

      {/* Progress bar */}
      <View className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <Animated.View
          className="h-full bg-[#f39849] rounded-full"
          style={{ width: barWidth }}
        />
      </View>

      <Text className="text-zinc-400 text-xs mt-4 text-center">
        Yapay zeka modeliniz özelleştiriliyor...
      </Text>
    </View>
  );
}
