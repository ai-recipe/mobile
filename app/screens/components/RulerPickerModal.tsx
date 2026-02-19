import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

interface RulerPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  title?: string;
  fractionDigits?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TICK_SPACING = 20;

export function RulerPickerModal({
  visible,
  onClose,
  onSave,
  initialValue = 75.4,
  min = 30,
  max = 200,
  step = 0.1,
  unit = "kg",
  title = "Current weight",
  fractionDigits = 1,
}: RulerPickerModalProps) {
  const [value, setValue] = useState(initialValue);
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const totalTicks = Math.round((max - min) / step);

  // Initial scroll position
  useEffect(() => {
    if (visible) {
      setValue(initialValue);
      const initialOffset = ((initialValue - min) / step) * TICK_SPACING + 20;
      scrollViewRef.current?.scrollTo({
        x: initialOffset,
        animated: false,
      });
    }
  }, [visible, initialValue, min, step]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = event.nativeEvent.contentOffset.x;
      const index = Math.round(offset / TICK_SPACING);
      const newValue = min + index * step - step;
      if (newValue >= min && newValue <= max) {
        const fixedValue = Number(newValue.toFixed(fractionDigits));
        if (fixedValue !== value) {
          setValue(fixedValue);
          // Trigger pop animation
          scale.value = withSequence(
            withSpring(1.05, { damping: 10, stiffness: 100 }),
            withSpring(1),
          );
        }
      }
    },
    [min, max, step, fractionDigits, value, scale],
  );

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  const ticks = [];
  // Number of ticks between numbers
  const majorTickFreq = step < 1 ? Math.round(1 / step) : 5;

  for (let i = 0; i <= totalTicks; i++) {
    const isMajor = i % majorTickFreq === 0;
    const isHalf =
      majorTickFreq > 1 && i % (majorTickFreq / 2) === 0 && !isMajor;
    const tickValue = min + i * step;

    ticks.push(
      <View
        key={i}
        style={{
          width: TICK_SPACING,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {isMajor && (
          <Text
            className="text-zinc-900 dark:text-white mb-6 absolute -top-6"
            style={{
              width: 60,
              textAlign: "center",
              fontWeight: "500",
              left: -20, // Centers 60px wide label over 20px wide parent
            }}
          >
            {tickValue.toFixed(0)}
          </Text>
        )}
        <View
          className={`w-[2px] rounded-full ${
            isMajor
              ? "bg-zinc-400 dark:bg-zinc-500"
              : "bg-zinc-200 dark:bg-zinc-700"
          }`}
          style={{
            height: isMajor ? 40 : isHalf ? 25 : 15,
          }}
        />
      </View>,
    );
  }

  const fadeColors: [string, string] = [
    "rgba(255,255,255,1)",
    "rgba(255,255,255,0)",
  ];
  const fadeColorsRev: [string, string] = [
    "rgba(255,255,255,0)",
    "rgba(255,255,255,1)",
  ];
  const darkFadeColors: [string, string] = [
    "rgba(26,46,34,1)",
    "rgba(26,46,34,0)",
  ];
  const darkFadeColorsRev: [string, string] = [
    "rgba(26,46,34,0)",
    "rgba(26,46,34,1)",
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full bg-white dark:bg-[#1a2e22] rounded-t-[32px] p-6 pb-10 shadow-2xl">
          {/* Drag Handle */}
          <View className="w-12 h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full self-center mb-6" />

          {/* Header */}
          <View className="flex-row justify-between items-center mb-8">
            <Pressable onPress={onClose} className="p-1">
              <MaterialIcons
                name="close"
                size={24}
                className="text-zinc-400 dark:text-zinc-500"
              />
            </Pressable>
            <Text className="text-xl font-bold text-zinc-900 dark:text-white">
              {title}
            </Text>
            <View style={{ width: 32 }} />
          </View>

          {/* Value Display */}
          <View className="items-center mb-10">
            <View className="flex-row items-baseline">
              <Animated.Text
                className="text-7xl font-bold text-zinc-900 dark:text-white tracking-tighter"
                style={[{ fontVariant: ["tabular-nums"] }, animatedStyle]}
              >
                {value.toFixed(fractionDigits)}
              </Animated.Text>
              <Text className="text-2xl font-medium text-zinc-400 dark:text-zinc-500 ml-2">
                {unit}
              </Text>
            </View>
          </View>

          {/* Ruler Scale */}
          <View className="relative h-24 mb-10 justify-center">
            {/* Center Indicator */}
            <View
              className="absolute left-1/2 -ml-[2px] w-1 h-12 bg-primary rounded-full z-20"
              style={{
                bottom: 0,
              }}
            />

            {/* Fade Gradients */}
            {colorScheme !== "dark" && (
              <>
                <LinearGradient
                  colors={fadeColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                />
                <LinearGradient
                  colors={fadeColorsRev}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                />
              </>
            )}

            {colorScheme === "dark" && (
              <>
                <LinearGradient
                  colors={darkFadeColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                />
                <LinearGradient
                  colors={darkFadeColorsRev}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                />
              </>
            )}

            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={TICK_SPACING}
              onScroll={onScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{
                paddingHorizontal: SCREEN_WIDTH / 2 - TICK_SPACING / 2,
                height: 80,
                alignItems: "flex-end",
              }}
              decelerationRate="fast"
            >
              {ticks}
            </ScrollView>
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSave}
            className="w-full bg-primary dark:bg-white py-4 rounded-2xl active:scale-[0.98] "
          >
            <Text className="text-white dark:text-black text-center font-bold text-lg">
              Save{" "}
              {title.toLowerCase().includes("weight")
                ? "weight"
                : title.toLowerCase()}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
