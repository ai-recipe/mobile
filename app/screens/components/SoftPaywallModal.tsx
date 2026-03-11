import { useAppDispatch } from "@/store/hooks";
import { closeSoftPaywall } from "@/store/slices/modalSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
};

interface Props {
  visible: boolean;
}

export function SoftPaywallModal({ visible }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(SCREEN_HEIGHT);

  const runClose = useCallback(() => {
    dispatch(closeSoftPaywall());
  }, [dispatch]);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 220 });
      translateY.value = withSpring(0, SPRING_CONFIG);
    } else {
      backdropOpacity.value = withTiming(0, { duration: 180 });
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 220 });
    }
  }, [visible, backdropOpacity, translateY]);

  const handleClose = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withSpring(SCREEN_HEIGHT, {
      ...SPRING_CONFIG,
      damping: 24,
    });
    setTimeout(runClose, 280);
  }, [backdropOpacity, translateY, runClose]);

  const handleUpgrade = useCallback(() => {
    runClose();
    router.push("/screens/paywall");
  }, [runClose]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        <Animated.View
          style={backdropStyle}
          className="absolute inset-0 bg-black/50"
          pointerEvents={visible ? "auto" : "none"}
        >
          <Pressable className="flex-1" onPress={handleClose} />
        </Animated.View>

        <Animated.View
          style={[sheetStyle, { paddingBottom: bottomPadding }]}
          className="w-full rounded-t-3xl bg-white dark:bg-zinc-900 px-6 pt-4 pb-6"
          pointerEvents="box-none"
        >
          {/* Handle bar */}
          <View className="w-10 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full self-center mb-6" />

          {/* Icon */}
          <View className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center self-center mb-5">
            <MaterialIcons name="bolt" size={32} color="#ef4444" />
          </View>

          <Text className="text-2xl font-extrabold text-zinc-900 dark:text-white text-center mb-2">
            {t("paywall.softTitle")}
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-400 text-base text-center leading-relaxed mb-8">
            {t("paywall.softDesc")}
          </Text>

          <TouchableOpacity
            onPress={handleUpgrade}
            activeOpacity={0.85}
            className="bg-[#f39849] h-[58px] rounded-2xl items-center justify-center mb-3 shadow-lg shadow-orange-500/30"
          >
            <Text className="text-white font-extrabold text-base">
              {t("paywall.upgradeButton")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClose}
            activeOpacity={0.7}
            className="h-[48px] rounded-2xl items-center justify-center"
          >
            <Text className="text-zinc-500 dark:text-zinc-400 font-medium">
              {t("paywall.wait24h")}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
