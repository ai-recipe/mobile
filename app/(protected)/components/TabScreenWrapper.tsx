import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TAB_ANIMATION_DURATION = 260;

/**
 * Wraps tab screen content and runs a short enter animation whenever the tab gains focus (tab switch).
 * Uses opacity + slight slide so the screen doesn't remount and state is preserved.
 */
export function TabScreenWrapper({ children }: { children: React.ReactNode }) {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      opacity.value = 0.52;
      translateY.value = 8;
      opacity.value = withTiming(1, { duration: TAB_ANIMATION_DURATION });
      translateY.value = withTiming(0, { duration: TAB_ANIMATION_DURATION });
    }, []),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
