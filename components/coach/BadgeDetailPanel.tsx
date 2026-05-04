import React, { useCallback, useEffect } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Reanimated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import type { BadgeListItem } from "@/api/badges";
import { Colors } from "@/constants/theme";
import { RARITY, RARITY_FALLBACK } from "./constants";

const SPRING_IN = { damping: 15, stiffness: 220, mass: 0.8 };

export function BadgeDetailPanel({
  badge,
  onClose,
  isDark,
  theme,
}: {
  badge: BadgeListItem | null;
  onClose: () => void;
  isDark: boolean;
  theme: typeof Colors.light;
}) {
  const scale = useSharedValue(0.82);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  const { t } = useTranslation();
  const [displayed, setDisplayed] = React.useState<BadgeListItem | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  useEffect(() => {
    if (badge) {
      setDisplayed(badge);
      setModalVisible(true);
      scale.value = 0.82;
      opacity.value = 0;
      translateY.value = 24;
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, SPRING_IN);
      translateY.value = withSpring(0, SPRING_IN);
    }
  }, [badge]);

  const dismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 160 });
    scale.value = withTiming(0.88, { duration: 160 });
    translateY.value = withTiming(16, { duration: 160 }, (done) => {
      if (done) runOnJS(setModalVisible)(false);
    });
    onClose();
  }, [onClose]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  if (!displayed) return null;

  const rarity = RARITY[displayed.rarity] ?? RARITY_FALLBACK;
  const locked = !displayed.unlocked;

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismiss}
    >
      <Reanimated.View
        style={backdropStyle}
        className="flex-1 items-center justify-center px-6"
      >
        <Pressable onPress={dismiss} className="absolute inset-0 bg-black/65" />

        <Reanimated.View style={cardStyle} className="w-full max-w-sm">
          <View
            className="rounded-3xl overflow-hidden"
            style={{ backgroundColor: isDark ? "#18181b" : "#fff" }}
          >
            {/* Gradient header */}
            <LinearGradient
              colors={locked ? (isDark ? ["#27272a", "#3f3f46"] : ["#e4e4e7", "#f4f4f5"]) : rarity.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="items-center pt-8 pb-10"
            >
              {/* Close button */}
              <Pressable
                onPress={dismiss}
                className="absolute top-4 right-4 w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              >
                <MaterialIcons name="close" size={18} color="#fff" />
              </Pressable>

              {/* Icon rings */}
              <View
                className="w-28 h-28 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
              >
                <View
                  className="w-20 h-20 rounded-full items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                >
                  <Text style={{ fontSize: 46, lineHeight: 56, opacity: locked ? 0.35 : 1 }}>
                    {displayed.icon}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Body */}
            <View className="px-6 pt-5 pb-6 items-center">
              {/* Rarity chip */}
              <View
                className="px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: rarity.color + "18" }}
              >
                <Text
                  className="text-[11px] font-extrabold uppercase tracking-widest"
                  style={{ color: rarity.color }}
                >
                  {rarity.label}
                </Text>
              </View>

              <Text
                className="text-[20px] font-extrabold text-center tracking-tight mb-2"
                style={{ color: theme.text }}
              >
                {locked ? t("coach.badgeDetail.lockedTitle") : displayed.name}
              </Text>

              <Text
                className="text-[13px] text-center leading-[20px] mb-5"
                style={{ color: theme.muted }}
              >
                {locked
                  ? t("coach.badgeDetail.lockedDesc")
                  : displayed.description}
              </Text>

              <View
                className="w-full h-px mb-4"
                style={{ backgroundColor: theme.border }}
              />

              <View className="flex-row items-center gap-2">
                <MaterialIcons
                  name={locked ? "lock" : "verified"}
                  size={15}
                  color={locked ? theme.muted : rarity.color}
                />
                <Text
                  className="text-[13px] font-bold"
                  style={{ color: locked ? theme.muted : rarity.color }}
                >
                  {locked
                    ? t("coach.badgeDetail.notUnlocked")
                    : displayed.unlockedAt
                    ? t("coach.badgeDetail.earnedOn", {
                        date: new Date(displayed.unlockedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }),
                      })
                    : t("coach.badgeDetail.earned")}
                </Text>
              </View>
            </View>
          </View>
        </Reanimated.View>
      </Reanimated.View>
    </Modal>
  );
}
