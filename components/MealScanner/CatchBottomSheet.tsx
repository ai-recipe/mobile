import type { DetectionResult } from "@/hooks/use-food-detection";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

interface CatchBottomSheetProps {
  detection: DetectionResult | null;
  onConfirm: (label: string) => void;
  onRetry: () => void;
}

/**
 * Bottom sheet shown when a food item is "caught" (confidently detected).
 * Displays the detected meal name, confidence, and action buttons.
 */
export const CatchBottomSheet = forwardRef<BottomSheet, CatchBottomSheetProps>(
  function CatchBottomSheet({ detection, onConfirm, onRetry }, ref) {
    const snapPoints = useMemo(() => ["42%"], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
        />
      ),
      [],
    );

    if (!detection) return null;

    const confidencePercent = Math.round(detection.confidence * 100);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: "#18181b",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        handleIndicatorStyle={{
          backgroundColor: "#52525b",
          width: 40,
        }}
        backdropComponent={renderBackdrop}
        onChange={(index) => {
          if (index === -1) {
            onRetry();
          }
        }}
      >
        <BottomSheetView className="flex-1 px-6 pt-2 pb-8">
          {/* Success icon */}
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-green-500/20 items-center justify-center">
              <MaterialIcons name="restaurant" size={32} color="#22c55e" />
            </View>
          </View>

          {/* Meal identified title */}
          <Text className="text-white/60 text-sm font-semibold text-center uppercase tracking-wider mb-1">
            Meal Identified
          </Text>

          {/* Detected food name */}
          <Text className="text-white text-3xl font-bold text-center mb-3">
            {detection.label}
          </Text>

          {/* Confidence badge */}
          <View className="items-center mb-6">
            <View className="flex-row items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
              <MaterialIcons name="verified" size={16} color="#22c55e" />
              <Text className="text-green-400 text-sm font-bold">
                {confidencePercent}% confidence
              </Text>
            </View>
          </View>

          {/* Action buttons */}
          <View className="gap-3 mt-auto">
            {/* Confirm button */}
            <Pressable
              onPress={() => onConfirm(detection.label)}
              className="bg-[#f39849] py-4 rounded-2xl flex-row items-center justify-center gap-2 active:opacity-90"
            >
              <MaterialIcons name="check" size={22} color="#000" />
              <Text className="text-black font-bold text-base">
                Confirm & Log Meal
              </Text>
            </Pressable>

            {/* Retry button */}
            <Pressable
              onPress={onRetry}
              className="bg-zinc-800 border border-zinc-700 py-4 rounded-2xl flex-row items-center justify-center gap-2 active:opacity-80"
            >
              <MaterialIcons name="refresh" size={20} color="#a1a1aa" />
              <Text className="text-zinc-400 font-bold text-base">
                Scan Again
              </Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);
