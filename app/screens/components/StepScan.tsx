import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

interface StepScanProps {
  onNext: () => void;
  onNewCapture?: () => void;
  onPickFromGallery?: () => void;
  direction?: "forward" | "backward";
}

export function StepScan({
  onNext,
  onNewCapture,
  onPickFromGallery,
  direction = "forward",
}: StepScanProps) {
  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;

  const { scannedImage } = useSelector((state: any) => state.recipe);
  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      className="flex-1 px-5 pt-4"
    >
      <View className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-[32px] overflow-hidden border border-zinc-200 dark:border-zinc-700 relative mb-6">
        <Image
          source={{ uri: scannedImage }}
          className="w-full h-full object-contain"
        />
        <View className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md p-5">
          <Text className="text-white font-bold text-center text-lg">
            Taranan Görüntü
          </Text>
        </View>
      </View>

      <View className="pb-8 gap-4">
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={onNewCapture}
            className="flex-1 bg-white dark:bg-zinc-800 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex-row items-center justify-center gap-2"
          >
            <MaterialIcons name="photo-camera" size={20} color="#71717a" />
            <Text className="text-zinc-700 dark:text-zinc-300 font-bold">
              Yeni Çek
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPickFromGallery}
            className="flex-1 bg-white dark:bg-zinc-800 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex-row items-center justify-center gap-2"
          >
            <MaterialIcons name="collections" size={20} color="#71717a" />
            <Text className="text-zinc-700 dark:text-zinc-300 font-bold">
              Galeri
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onNext}
          disabled={!scannedImage}
          activeOpacity={0.9}
          className="bg-[#f39849] w-full py-4 rounded-2xl items-center justify-center shadow-lg shadow-orange-500/30 flex-row gap-2"
        >
          <Text className="text-white font-extrabold text-lg">
            İçerikleri Bul
          </Text>
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
