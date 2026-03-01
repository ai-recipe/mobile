import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CONFETTI = ["🎉", "🎊", "✨", "🌟", "🏆", "🎯", "💪", "🔥"];

export function GoalCelebrationModal({ visible, onClose }: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(
    Array.from({ length: 8 }, (_, i) => ({
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      // Spread confetti across the width using stable offsets
      xOffset: (i * 13) % 100,
    })),
  ).current;

  useEffect(() => {
    if (!visible) return;

    scale.setValue(0);
    Animated.spring(scale, {
      toValue: 1,
      tension: 70,
      friction: 7,
      useNativeDriver: true,
    }).start();

    confettiAnims.forEach((anim, i) => {
      anim.y.setValue(0);
      anim.opacity.setValue(0);
      Animated.sequence([
        Animated.delay(i * 90),
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(anim.y, {
            toValue: 55 + (i % 3) * 15,
            duration: 1100,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [visible]);

  const handleUpgrade = () => {
    onClose();
    router.push("/screens/paywall");
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 items-center justify-center px-6"
        onPress={onClose}
      >
        <Pressable onPress={() => {}}>
          <Animated.View
            style={{ transform: [{ scale }] }}
            className="bg-white dark:bg-zinc-900 rounded-[32px] px-6 pt-8 pb-6 w-full overflow-hidden"
          >
            {/* Confetti layer */}
            <View
              className="absolute top-0 left-0 right-0 h-24 overflow-hidden"
              pointerEvents="none"
            >
              {confettiAnims.map((anim, i) => (
                <Animated.Text
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${anim.xOffset}%`,
                    top: 4,
                    fontSize: 20,
                    opacity: anim.opacity,
                    transform: [{ translateY: anim.y }],
                  }}
                >
                  {CONFETTI[i % CONFETTI.length]}
                </Animated.Text>
              ))}
            </View>

            {/* Trophy */}
            <View className="items-center mb-4 mt-4">
              <View className="w-20 h-20 rounded-full bg-[#f39849]/10 items-center justify-center mb-4">
                <MaterialIcons name="emoji-events" size={40} color="#f39849" />
              </View>

              <Text className="text-2xl font-extrabold text-zinc-900 dark:text-white text-center">
                Günlük Hedefe Ulaştın!
              </Text>
              <Text className="text-zinc-500 dark:text-zinc-400 text-sm text-center mt-2 leading-relaxed px-2">
                Harika iş! Momentumunu Pro üyelikle sürdür ve daha fazlasına
                ulaş.{"\n"}
                <Text className="text-[#f39849] font-bold">
                  İlk ay %30 indirim
                </Text>{" "}
                ile şimdi başla!
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleUpgrade}
              activeOpacity={0.85}
              className="bg-[#f39849] h-[56px] rounded-2xl items-center justify-center mt-4 mb-3 shadow-lg shadow-orange-500/30"
            >
              <Text className="text-white font-extrabold text-base">
                %30 İndirimle Pro'ya Geç
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="h-[44px] rounded-2xl items-center justify-center"
            >
              <Text className="text-zinc-400 font-medium text-sm">
                Belki Daha Sonra
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
