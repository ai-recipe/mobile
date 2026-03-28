import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/node_modules/react-i18next";
import { Animated, Easing, Text, View } from "react-native";

export const FunnyLoader = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  const messages = t("loader.messages", { returnObjects: true }) as string[];

  const spinValue = useRef(new Animated.Value(0)).current;
  const floatValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const [currentMessage, setCurrentMessage] = useState(
    messages[0] || "Loading...",
  );

  // Spinning animation for the ring
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  // Floating animation for the logo
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatValue, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatValue]);

  // Message cycling animation
  useEffect(() => {
    const messageInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.95,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentMessage(
          messages[Math.floor(Math.random() * messages.length)],
        );
        Animated.parallel([
          Animated.timing(fadeValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3500);

    return () => clearInterval(messageInterval);
  }, [fadeValue, scaleValue]);

  const spinAnimation = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const floatAnimation = floatValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: colors.background }}
    >
      {/* Central Animation Block */}
      <View className="relative w-64 h-64 flex items-center justify-center mb-12">
        {/* Rotating Ring with Orbs */}
        <Animated.View
          style={{
            width: "100%",
            height: "100%",
            transform: [{ rotate: spinAnimation }],
          }}
          className="absolute inset-0"
        >
          {/* Top orb */}
          <View
            className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
            style={{
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 8,
              elevation: 8,
            }}
          />
          {/* Bottom orb */}
          <View
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
            style={{
              backgroundColor: colors.primary,
              opacity: 0.6,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 6,
              elevation: 6,
            }}
          />
          {/* Left orb */}
          <View
            className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              backgroundColor: colors.text,
              opacity: 0.5,
            }}
          />
          {/* Right orb */}
          <View
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              backgroundColor: colors.text,
              opacity: 0.5,
            }}
          />

          {/* Spinning Path Border */}
          <View
            className="w-full h-full border-2 rounded-full"
            style={{
              borderColor: `${colors.text}20`,
              borderStyle: "dashed",
            }}
          />
        </Animated.View>

        {/* Floating Logo (Fire Icon) */}
        <Animated.View
          style={{
            transform: [{ translateY: floatAnimation }],
            zIndex: 10,
          }}
        >
          <View
            className="w-32 h-32 rounded-3xl flex items-center justify-center"
            style={{
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 12,
            }}
          >
            <MaterialIcons
              name="local-fire-department"
              size={64}
              color="white"
            />
          </View>
        </Animated.View>
      </View>

      {/* Funny Messages */}
      <View className="h-20 items-center justify-center">
        <Animated.Text
          style={{
            opacity: fadeValue,
            transform: [{ scale: scaleValue }],
          }}
          className="text-2xl font-bold text-center px-6"
          style={{ color: colors.text }}
        >
          {currentMessage}
        </Animated.Text>
      </View>

      {/* Subtitle */}
      <Text
        className="text-xs tracking-wider uppercase mt-2 font-semibold"
        style={{ color: colors.primary, opacity: 0.7 }}
      >
        {t("loader.subtitle")}
      </Text>

      {/* Progress Dots */}
      <View className="flex-row gap-2 mt-12">
        <Animated.View
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: colors.primary,
            opacity: Animated.sequence([
              Animated.timing(new Animated.Value(1), {
                toValue: 0.3,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(new Animated.Value(0.3), {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
            ]),
          }}
        />
        <View
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: colors.primary, opacity: 0.6 }}
        />
        <View
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: colors.primary, opacity: 0.3 }}
        />
      </View>
    </View>
  );
};
