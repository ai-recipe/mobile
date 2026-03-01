import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/store/hooks";
import { closeSoftPaywall } from "@/store/slices/modalSlice";

interface Props {
  visible: boolean;
}

export function SoftPaywallModal({ visible }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(closeSoftPaywall());

  const handleUpgrade = () => {
    dispatch(closeSoftPaywall());
    router.push("/screens/paywall");
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={handleClose}
      >
        {/* Stop touch propagation on the sheet itself */}
        <Pressable onPress={() => {}}>
          <Animated.View
            entering={SlideInDown.springify().damping(18)}
            exiting={SlideOutDown.springify().damping(18)}
            className="bg-white dark:bg-zinc-900 rounded-t-[32px] px-6 pt-5 pb-10"
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}
