import { useAppDispatch } from "@/store/hooks";
import { closePurchaseSuccess } from "@/store/slices/modalSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const CARD_SPRING = { damping: 22, stiffness: 240 };
const ICON_SPRING = {
  damping: 14,
  stiffness: 120,
  restDisplacementThreshold: 0.001,
};

const PERKS = [
  "paywall.featureRecipes",
  "paywall.featureCalories",
  "paywall.featureNutrition",
  "paywall.featureFavorites",
  "paywall.featureTools",
  "paywall.featureAnalytics",
] as const;

interface Props {
  visible: boolean;
}

export function PurchaseSuccessModal({ visible }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.86);
  const cardOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const iconTranslateY = useSharedValue(16);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 240 });
      cardScale.value = withSpring(1, CARD_SPRING);
      cardOpacity.value = withTiming(1, { duration: 200 });
      iconOpacity.value = withDelay(
        240,
        withTiming(1, { duration: 280, easing: Easing.out(Easing.quad) }),
      );
      iconTranslateY.value = withDelay(240, withSpring(0, ICON_SPRING));
      iconScale.value = withDelay(
        240,
        withSequence(
          withSpring(1.08, { damping: 18, stiffness: 140 }),
          withSpring(1.0, {
            damping: 20,
            stiffness: 200,
            restDisplacementThreshold: 0.001,
          }),
        ),
      );
    } else {
      backdropOpacity.value = withTiming(0, { duration: 180 });
      cardScale.value = withTiming(0.86, { duration: 180 });
      cardOpacity.value = withTiming(0, { duration: 160 });
      iconOpacity.value = 0;
      iconScale.value = 0;
      iconTranslateY.value = 16;
    }
  }, [
    visible,
    backdropOpacity,
    cardScale,
    cardOpacity,
    iconScale,
    iconOpacity,
    iconTranslateY,
  ]);

  const handleClose = useCallback(() => {
    dispatch(closePurchaseSuccess());
    router.replace("/(protected)/(tabs)/");
  }, [dispatch]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [
      { translateY: iconTranslateY.value },
      { scale: iconScale.value },
    ],
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
        style={[backdropStyle, { position: "absolute", inset: 0 }]}
        className="bg-black/50"
        pointerEvents="none"
      />

      {/* Centered card */}
      <Animated.View
        style={[
          cardStyle,
          {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
          },
        ]}
      >
        <View
          className="w-full bg-white dark:bg-zinc-900 rounded-[24px] items-center px-8 pt-10 pb-8 overflow-hidden"
          style={{
            shadowColor: "#333139",
            shadowOffset: { width: 0, height: 40 },
            shadowOpacity: 0.12,
            shadowRadius: 80,
            elevation: 20,
          }}
        >
          {/* Decorative glow — top right */}
          <View
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
            style={{ backgroundColor: "rgba(252,161,81,0.1)" }}
            pointerEvents="none"
          />

          {/* Icon — workspace_premium in golden container with ambient glow */}
          <Animated.View style={iconStyle} className="mb-6">
            <View
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{
                backgroundColor: "rgba(251,243,173,0.95)",
                shadowColor: "rgba(251,243,173,1)",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 24,
                elevation: 0,
              }}
            >
              <MaterialIcons
                name="workspace-premium"
                size={52}
                color="#7a6a00"
              />
            </View>
          </Animated.View>

          {/* Title */}
          <Text
            className="text-3xl font-black text-zinc-900 dark:text-white text-center mb-3 leading-tight"
            style={{ letterSpacing: -0.5 }}
          >
            {t("purchaseSuccess.title")}
          </Text>

          {/* Subtitle */}
          <Text className="text-base text-zinc-500 dark:text-zinc-400 text-center leading-relaxed mb-8 px-2">
            {t("purchaseSuccess.subtitle")}
          </Text>

          {/* Perks list */}
          <View className="w-full gap-y-5 mb-10 px-2">
            {PERKS.map((key) => (
              <View key={key} className="flex-row items-center gap-4">
                <View className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center flex-shrink-0">
                  <MaterialIcons name="check" size={16} color="#755a45" />
                </View>
                <Text className="text-base font-semibold text-zinc-800 dark:text-zinc-200 flex-1">
                  {t(key)}
                </Text>
              </View>
            ))}
          </View>

          {/* CTA — gradient button */}
          <TouchableOpacity
            onPress={handleClose}
            activeOpacity={0.88}
            className="w-full"
            style={{ borderRadius: 16 }}
          >
            <LinearGradient
              colors={["#f39849", "#d4682a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 16,
                paddingVertical: 18,
                alignItems: "center",
                shadowColor: "#914d00",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.22,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Text
                className="text-white font-bold text-lg"
                style={{ letterSpacing: 0.3 }}
              >
                {t("purchaseSuccess.cta")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}
