import React, { useCallback, useEffect } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { BadgeRarity, dismissCurrentBadge } from "@/store/slices/gamificationSlice";
import { RARITY, RARITY_FALLBACK } from "@/components/coach/constants";

const SPRING_IN = { damping: 14, stiffness: 220, mass: 0.75 };
const DISMISS_MS = 180;

export default function GlobalBadgeModal() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isDisplayingBadge, badgeQueue } = useAppSelector((s) => s.gamification);

  const currentBadge = badgeQueue[0] ?? null;
  const rarity: BadgeRarity = currentBadge?.rarity ?? "common";
  const rarityMeta = RARITY[rarity] ?? RARITY_FALLBACK;

  const scale = useSharedValue(0.72);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(32);

  const enter = useCallback(() => {
    opacity.value = withTiming(1, { duration: 220 });
    scale.value = withSpring(1, SPRING_IN);
    translateY.value = withSpring(0, SPRING_IN);
  }, []);

  const exit = useCallback((onDone: () => void) => {
    opacity.value = withTiming(0, { duration: DISMISS_MS });
    scale.value = withTiming(0.88, { duration: DISMISS_MS });
    translateY.value = withTiming(20, { duration: DISMISS_MS }, (finished) => {
      if (finished) runOnJS(onDone)();
    });
  }, []);

  useEffect(() => {
    if (isDisplayingBadge) {
      scale.value = 0.72;
      opacity.value = 0;
      translateY.value = 32;
      enter();
    }
  }, [isDisplayingBadge, currentBadge?._id]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handleDismiss = useCallback(() => {
    exit(() => dispatch(dismissCurrentBadge()));
  }, [exit, dispatch]);

  if (!currentBadge) return null;

  const moreCount = badgeQueue.length - 1;

  return (
    <Modal
      transparent
      visible={isDisplayingBadge}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      <Animated.View
        style={backdropStyle}
        className="flex-1 items-center justify-center px-6"
      >
        <Pressable onPress={handleDismiss} className="absolute inset-0 bg-black/70" />

        <Animated.View style={cardStyle} className="w-full max-w-sm">
          <View className="rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 shadow-2xl">
            {/* Gradient header */}
            <LinearGradient
              colors={rarityMeta.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="items-center pt-8 pb-10"
            >
              <View className="bg-white/20 px-4 py-1.5 rounded-full mb-5">
                <Text className="text-white text-xs font-bold uppercase tracking-widest">
                  {t("coach.badgeModal.unlocked")}
                </Text>
              </View>

              <View
                className="w-32 h-32 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
              >
                <View
                  className="w-24 h-24 rounded-full items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                >
                  <Text style={{ fontSize: 52, lineHeight: 62 }}>
                    {currentBadge.icon}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Content */}
            <View className="px-6 pt-5 pb-6 items-center">
              <View
                className="px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: `${rarityMeta.color}18` }}
              >
                <Text
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: rarityMeta.color }}
                >
                  {t(`coach.badgeModal.rarity.${rarity}`)}
                </Text>
              </View>

              <Text className="text-[22px] font-extrabold text-zinc-900 dark:text-white text-center mb-2 tracking-tight">
                {currentBadge.name}
              </Text>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400 text-center leading-[20px] mb-6">
                {currentBadge.description}
              </Text>

              <Pressable
                onPress={handleDismiss}
                accessibilityRole="button"
                className="w-full rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={rarityMeta.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ paddingVertical: 15, alignItems: "center" }}
                >
                  <Text className="text-white font-extrabold text-base tracking-tight">
                    {t("coach.badgeModal.awesome")}
                  </Text>
                </LinearGradient>
              </Pressable>

              {moreCount > 0 && (
                <Text className="text-xs text-zinc-400 dark:text-zinc-600 mt-3">
                  {t(moreCount === 1 ? "coach.badgeModal.moreWaiting" : "coach.badgeModal.moreWaitingPlural", { count: moreCount })}
                </Text>
              )}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
