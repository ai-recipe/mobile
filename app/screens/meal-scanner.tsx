import { CatchBottomSheet } from "@/components/MealScanner/CatchBottomSheet";
import { ScanningOverlay } from "@/components/MealScanner/ScanningOverlay";
import {
  DetectionResult,
  useConsecutiveDetection,
  useFoodDetection,
} from "@/hooks/use-food-detection";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";

/**
 * Live Meal Scanner screen.
 *
 * Uses VisionCamera + TFLite to detect food in real-time.
 * When a food item is confidently identified (>85% for 5+ frames),
 * triggers a "catch" with haptic feedback, freezes the camera,
 * and shows a bottom sheet for confirmation.
 */
export default function MealScannerScreen() {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [caughtDetection, setCaughtDetection] = useState<DetectionResult | null>(null);

  // Camera permission
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  // Request camera permission on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then((granted) => {
        if (!granted) {
          Alert.alert(
            "Camera Permission Required",
            "Please enable camera access in Settings to use the meal scanner.",
            [
              { text: "Cancel", style: "cancel", onPress: () => router.back() },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ],
          );
        }
      });
    }
  }, [hasPermission, requestPermission]);

  // Handle catch from consecutive detection
  const handleCatch = useCallback(async (result: DetectionResult) => {
    // Heavy haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Freeze camera
    setIsCameraActive(false);
    setCaughtDetection(result);

    // Open bottom sheet
    setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(0);
    }, 100);
  }, []);

  // Food detection hook
  const {
    frameProcessor,
    detectedLabel,
    confidence,
    status,
    isModelReady,
    modelError,
    reset: resetDetection,
  } = useFoodDetection({
    onCatch: handleCatch,
    isActive: isCameraActive,
  });

  // Consecutive detection tracking (JS-thread based 5-frame counter)
  const { consecutiveCount, resetConsecutive } = useConsecutiveDetection({
    label: detectedLabel,
    confidence,
    status,
    onThresholdReached: handleCatch,
  });

  // Confirm detected meal -> navigate back to daily-log with meal name
  const handleConfirm = useCallback(
    (label: string) => {
      bottomSheetRef.current?.close();
      // Navigate to daily-log with the scanned meal name as a param
      router.navigate({
        pathname: "/(protected)/(tabs)/daily-log",
        params: { scannedMeal: label },
      });
    },
    [],
  );

  // Retry -> resume scanning
  const handleRetry = useCallback(() => {
    bottomSheetRef.current?.close();
    setCaughtDetection(null);
    resetDetection();
    resetConsecutive();
    setIsCameraActive(true);
  }, [resetDetection, resetConsecutive]);

  // Manual capture fallback
  const handleManualCapture = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (detectedLabel && confidence > 0.5) {
      // If we have a partial detection, use it
      handleCatch({ label: detectedLabel, confidence });
    } else {
      // No detection at all - open meal entry directly with empty name
      router.navigate({
        pathname: "/(protected)/(tabs)/daily-log",
        params: { scannedMeal: "__manual__" },
      });
    }
  }, [detectedLabel, confidence, handleCatch]);

  // Close scanner
  const handleClose = useCallback(() => {
    setIsCameraActive(false);
    router.back();
  }, []);

  // Permission denied state
  if (!hasPermission) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-8">
        <StatusBar barStyle="light-content" />
        <MaterialIcons name="no-photography" size={64} color="#52525b" />
        <Text className="text-white text-xl font-bold mt-4 text-center">
          Camera Access Required
        </Text>
        <Text className="text-zinc-400 text-sm mt-2 text-center leading-relaxed">
          We need camera permission to scan your meals. Please enable it in your
          device settings.
        </Text>
        <Pressable
          onPress={() => Linking.openSettings()}
          className="mt-6 bg-[#f39849] px-8 py-3 rounded-2xl"
        >
          <Text className="text-black font-bold">Open Settings</Text>
        </Pressable>
        <Pressable onPress={handleClose} className="mt-3 px-8 py-3">
          <Text className="text-zinc-400 font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // No camera device
  if (!device) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <StatusBar barStyle="light-content" />
        <MaterialIcons name="videocam-off" size={64} color="#52525b" />
        <Text className="text-white text-lg font-bold mt-4">
          No Camera Found
        </Text>
        <Pressable onPress={handleClose} className="mt-4 px-8 py-3">
          <Text className="text-zinc-400 font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Full-screen camera */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
        frameProcessor={frameProcessor}
        pixelFormat="rgb"
        photo={true}
      />

      {/* Scanning overlay */}
      <ScanningOverlay
        status={status}
        detectedLabel={detectedLabel}
        confidence={confidence}
        consecutiveCount={consecutiveCount}
        isModelReady={isModelReady}
      />

      {/* Top bar: close button + model status */}
      <View
        className="absolute left-0 right-0 flex-row items-center justify-between px-4"
        style={{ top: insets.top + 8 }}
      >
        {/* Close button */}
        <Pressable
          onPress={handleClose}
          className="active:opacity-70"
        >
          <BlurView
            intensity={40}
            tint="dark"
            className="w-10 h-10 rounded-full overflow-hidden items-center justify-center border border-white/10"
          >
            <MaterialIcons name="close" size={22} color="white" />
          </BlurView>
        </Pressable>

        {/* Model status indicator */}
        <BlurView
          intensity={40}
          tint="dark"
          className="overflow-hidden rounded-full border border-white/10"
        >
          <View className="px-3 py-1.5 flex-row items-center gap-1.5">
            {isModelReady ? (
              <>
                <View className="w-2 h-2 rounded-full bg-green-400" />
                <Text className="text-white/80 text-[10px] font-bold uppercase tracking-wider">
                  AI Ready
                </Text>
              </>
            ) : modelError ? (
              <>
                <View className="w-2 h-2 rounded-full bg-red-400" />
                <Text className="text-white/80 text-[10px] font-bold uppercase tracking-wider">
                  Model Error
                </Text>
              </>
            ) : (
              <>
                <ActivityIndicator size="small" color="#f39849" />
                <Text className="text-white/80 text-[10px] font-bold uppercase tracking-wider">
                  Loading AI
                </Text>
              </>
            )}
          </View>
        </BlurView>
      </View>

      {/* Bottom controls */}
      <View
        className="absolute left-0 right-0 items-center"
        style={{ bottom: insets.bottom + 24 }}
      >
        {/* Manual capture button */}
        {status !== "caught" && (
          <View className="items-center gap-3">
            <Pressable
              onPress={handleManualCapture}
              className="active:scale-95"
            >
              <View className="w-20 h-20 rounded-full border-4 border-white/80 items-center justify-center">
                <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
                  <MaterialIcons name="camera" size={32} color="white" />
                </View>
              </View>
            </Pressable>
            <BlurView
              intensity={30}
              tint="dark"
              className="overflow-hidden rounded-full border border-white/10"
            >
              <Text className="text-white/70 text-xs font-semibold px-3 py-1">
                Manual Capture
              </Text>
            </BlurView>
          </View>
        )}
      </View>

      {/* Catch bottom sheet */}
      <CatchBottomSheet
        ref={bottomSheetRef}
        detection={caughtDetection}
        onConfirm={handleConfirm}
        onRetry={handleRetry}
      />
    </View>
  );
}
