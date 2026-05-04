import React from "react";
import { View } from "react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { BRAND } from "./constants";

export function LiveDot() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(2.2, { duration: 900 }),
        withTiming(1, { duration: 900 }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 900 }),
        withTiming(0.6, { duration: 900 }),
      ),
      -1,
      false,
    );
  }, []);

  const pingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View className="w-3 h-3 mr-2 items-center justify-center">
      <Reanimated.View
        className="absolute w-3 h-3 rounded-full"
        style={[{ backgroundColor: BRAND }, pingStyle]}
      />
      <View className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND }} />
    </View>
  );
}
