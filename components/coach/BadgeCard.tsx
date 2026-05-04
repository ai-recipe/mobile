import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Reanimated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import type { BadgeListItem } from "@/api/badges";
import { RARITY, RARITY_FALLBACK } from "./constants";

export function BadgeCard({
  item,
  index,
  onPress,
  isDark,
}: {
  item: BadgeListItem;
  index: number;
  onPress: (b: BadgeListItem) => void;
  isDark: boolean;
}) {
  const rarity = RARITY[item.rarity] ?? RARITY_FALLBACK;

  const entryOpacity = useSharedValue(0);
  const entryY = useSharedValue(16);
  React.useEffect(() => {
    entryOpacity.value = withDelay(
      index * 55,
      withTiming(1, { duration: 320 }),
    );
    entryY.value = withDelay(
      index * 55,
      withSpring(0, { damping: 18, stiffness: 200 }),
    );
  }, []);

  const pressScale = useSharedValue(1);
  const handlePressIn = () => {
    pressScale.value = withSpring(0.91, { damping: 14, stiffness: 280 });
  };
  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 14, stiffness: 280 });
  };

  const shimmer = useSharedValue(0);
  React.useEffect(() => {
    if (item.unlocked && item.rarity === "legendary") {
      shimmer.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
    }
  }, [item.unlocked]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: entryOpacity.value,
    transform: [{ translateY: entryY.value }, { scale: pressScale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0, 0.35]),
  }));

  const locked = !item.unlocked;

  return (
    <Pressable
      onPress={() => onPress(item)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Reanimated.View className="w-20 items-center mr-2" style={cardStyle}>
        <LinearGradient
          colors={
            locked
              ? isDark
                ? ["#27272a", "#27272a"]
                : ["#f4f4f5", "#f4f4f5"]
              : rarity.gradient
          }
          className="w-[72px] h-[72px] rounded-xl items-center justify-center overflow-hidden"
          style={{ borderRadius: 12 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {!locked && item.rarity === "legendary" && (
            <Reanimated.View
              style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: "#fff", borderRadius: 22 },
                shimmerStyle,
              ]}
              pointerEvents="none"
            />
          )}
          <Text
            className="text-[30px]"
            style={locked ? { opacity: 0.25 } : undefined}
          >
            {item.icon}
          </Text>
          {locked && (
            <View
              className="absolute bottom-1 right-1 w-[18px] h-[18px] rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            >
              <MaterialIcons name="lock" size={12} color="#fff" />
            </View>
          )}
        </LinearGradient>

        <Text
          numberOfLines={2}
          className="text-[10px] font-bold text-center mt-1.5 leading-[13px]"
          style={{
            color: locked
              ? isDark
                ? "#52525b"
                : "#a1a1aa"
              : isDark
              ? "#e4e4e7"
              : "#18181b",
          }}
        >
          {item.name}
        </Text>
      </Reanimated.View>
    </Pressable>
  );
}
