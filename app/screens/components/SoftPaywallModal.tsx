import { useAppDispatch } from "@/store/hooks";
import { closeSoftPaywall } from "@/store/slices/modalSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SPRING_CONFIG = { damping: 22, stiffness: 260 };

interface Props {
  visible: boolean;
}

export function SoftPaywallModal({ visible }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.88);
  const cardOpacity = useSharedValue(0);

  const runClose = useCallback(() => {
    dispatch(closeSoftPaywall());
  }, [dispatch]);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 220 });
      cardScale.value = withSpring(1, SPRING_CONFIG);
      cardOpacity.value = withTiming(1, { duration: 200 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 180 });
      cardScale.value = withTiming(0.88, { duration: 180 });
      cardOpacity.value = withTiming(0, { duration: 160 });
    }
  }, [visible, backdropOpacity, cardScale, cardOpacity]);

  const handleClose = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 180 });
    cardScale.value = withTiming(0.88, { duration: 180 });
    cardOpacity.value = withTiming(0, { duration: 160 });
  }, [backdropOpacity, cardScale, cardOpacity, runClose]);

  const handleUpgrade = useCallback(() => {
    runClose();
    router.push("/screens/paywall");
  }, [runClose]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={handleClose}
      animationType="none"
    >
      {/* Backdrop */}
      <Animated.View
        style={[backdropStyle, { flex: 1 }]}
        className="bg-black/50"
      >
        <Pressable style={{ flex: 1 }} onPress={handleClose} />
      </Animated.View>

      {/* Centered card */}
      <Animated.View
        style={[
          cardStyle,
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
            pointerEvents: "box-none",
          },
        ]}
      >
        <View
          className="w-full bg-white dark:bg-zinc-900 rounded-[28px] items-center px-8 py-10 overflow-hidden"
          style={{
            shadowColor: "#904d00",
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.08,
            shadowRadius: 40,
            elevation: 16,
          }}
        >
          {/* Decorative glow — top right */}
          <View
            className="absolute -top-10 -right-10 w-36 h-36 rounded-full"
            style={{ backgroundColor: "rgba(242,153,73,0.15)" }}
            pointerEvents="none"
          />
          {/* Decorative glow — bottom left */}
          <View
            className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full"
            style={{ backgroundColor: "rgba(110,57,0,0.08)" }}
            pointerEvents="none"
          />

          {/* Icon */}
          <View
            className="w-24 h-24 rounded-full items-center justify-center mb-7"
            style={{ backgroundColor: "rgba(248,220,220,0.9)" }}
          >
            <MaterialIcons name="bolt" size={52} color="#ef4444" />
          </View>

          {/* Title */}
          <Text
            className="text-3xl font-black text-zinc-900 dark:text-white text-center mb-3 leading-tight"
            style={{ letterSpacing: -0.5 }}
          >
            {t("paywall.softTitle")}
          </Text>

          {/* Subtitle */}
          <Text className="text-base text-zinc-500 dark:text-zinc-400 text-center leading-relaxed mb-9 max-w-[260px]">
            {t("paywall.softDesc")}
          </Text>

          {/* Primary CTA — gradient pill */}
          <TouchableOpacity
            onPress={handleUpgrade}
            activeOpacity={0.88}
            className="w-full mb-5"
            style={{ borderRadius: 999 }}
          >
            <LinearGradient
              colors={["#ffb77d", "#f48d4d", "#904d00"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 999,
                paddingVertical: 18,
                paddingHorizontal: 32,
                alignItems: "center",
                shadowColor: "#904d00",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
                elevation: 8,
              }}
            >
              <Text className="text-white font-extrabold text-lg">
                {t("paywall.upgradeButton")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary — underlined text link */}
          <TouchableOpacity
            onPress={handleClose}
            activeOpacity={0.7}
            className="py-2 px-4"
          >
            <Text
              className="text-sm font-semibold text-[#904d00] dark:text-[#ffb77d]"
              style={{
                textDecorationLine: "underline",
                textDecorationColor: "rgba(144,77,0,0.35)",
              }}
            >
              {t("paywall.wait24h")}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}
