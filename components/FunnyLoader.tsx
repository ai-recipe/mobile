import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Easing, Image, Text, View } from "react-native";

export const FunnyLoader = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  // Ensure fallback messages exist if translation fails
  const messages = t("loader.messages", { returnObjects: true }) as string[];
  const fallbackMessages = [
    "Summoning your focus...",
    "Peak productivity incoming...",
    "Loading your slay...",
    "Your AI Chef is ready...",
  ];
  const displayMessages =
    Array.isArray(messages) && messages.length > 0
      ? messages
      : fallbackMessages;

  // Animation Values
  const floatValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  // Dot Animation Values
  const dot1Scale = useRef(new Animated.Value(1)).current;
  const dot2Scale = useRef(new Animated.Value(1)).current;
  const dot3Scale = useRef(new Animated.Value(1)).current;

  const [currentMessage, setCurrentMessage] = useState(displayMessages[0]);

  // Floating animation for the logo
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatValue, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatValue]);

  // Rotation animation for the logo
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateValue]);

  // Pulse animation for the progress dots
  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1.5,
            duration: 600,
            delay: delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateDot(dot1Scale, 0);
    animateDot(dot2Scale, 200);
    animateDot(dot3Scale, 400);
  }, [dot1Scale, dot2Scale, dot3Scale]);

  // Message cycling animation
  useEffect(() => {
    const messageInterval = setInterval(() => {
      Animated.sequence([
        Animated.parallel([
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
        ]),
      ]).start(() => {
        let nextMessage;
        do {
          nextMessage =
            displayMessages[Math.floor(Math.random() * displayMessages.length)];
        } while (nextMessage === currentMessage && displayMessages.length > 1);

        setCurrentMessage(nextMessage);

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
    }, 4000);

    return () => clearInterval(messageInterval);
  }, [fadeValue, scaleValue, currentMessage, displayMessages]);

  // Interpolations
  const floatAnimation = floatValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const rotateAnimation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "5deg"],
  });

  return (
    <View
      className="flex-1 justify-center items-center px-8 relative overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Radiant Background Gradient Overlay */}
      <View
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundColor: colors.primary,
          borderRadius: 9999,
          width: "150%",
          height: "150%",
          top: "-25%",
          left: "-25%",
        }}
      />

      {/* Decorative top-left shape */}
      <View
        className="absolute top-12 left-12 opacity-30"
        style={{
          width: 128,
          height: 128,
          borderRadius: 24,
          backgroundColor: colors.primary,
          transform: [{ rotate: "12deg" }],
        }}
      />

      {/* Decorative bottom-right circle */}
      <View
        className="absolute bottom-12 right-12 opacity-40"
        style={{
          width: 192,
          height: 192,
          borderRadius: 9999,
          borderWidth: 24,
          borderColor: `${colors.primary}33`,
        }}
      />

      {/* Central Brand Unit */}
      <View className="flex items-center relative z-10">
        {/* Animated Logo Container */}
        <Animated.View
          style={{
            transform: [
              { translateY: floatAnimation },
              { rotate: rotateAnimation },
            ],
            marginBottom: 32,
          }}
        >
          <View
            className="w-32 h-32 rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
            style={{
              backgroundColor: colors.primary,
            }}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Animated Pulse Dots */}
        <View className="flex-row gap-4 mb-8">
          <Animated.View
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: colors.primary,
              transform: [{ scale: dot1Scale }],
            }}
          />
          <Animated.View
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: colors.primaryContainer,
              transform: [{ scale: dot2Scale }],
            }}
          />
          <Animated.View
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: colors.secondaryContainer,
              transform: [{ scale: dot3Scale }],
            }}
          />
        </View>

        {/* Main Message */}
        <Animated.View
          className="max-w-xs"
          style={{
            opacity: fadeValue,
            transform: [{ scale: scaleValue }],
          }}
        >
          <Text
            className="text-lg font-semibold text-center tracking-wide"
            style={{ color: colors.onSurfaceVariant }}
          >
            {currentMessage}
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Text
          className="text-xs font-bold uppercase mt-2 text-center tracking-widest"
          style={{ color: colors.outline, opacity: 0.6 }}
        >
          {displayMessages[1] || "Peak productivity incoming"}
        </Text>
      </View>

      {/* Footer Branding */}
      <View
        className="absolute bottom-10 flex-row items-center gap-2 px-6 py-2 rounded-full"
        style={{ backgroundColor: colors.surfaceContainerLow }}
      >
        <MaterialIcons name="auto-awesome" size={14} color={colors.primary} />
        <Text
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: colors.onSurfaceVariant }}
        >
          The Radiant Nutrition Tracker
        </Text>
      </View>
    </View>
  );
};
