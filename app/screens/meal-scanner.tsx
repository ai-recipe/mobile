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

/**
 * Meal Scanner screen.
 * Camera view with take-photo button. Navigates to daily-log meal entry on capture.
 */
export default function MealScannerScreen() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<Camera>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

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

  // Take photo and navigate to meal entry
  const handleTakePhoto = useCallback(async () => {
    if (!cameraRef.current || isTakingPhoto) return;

    try {
      setIsTakingPhoto(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const photo = await cameraRef.current.takePhoto({
        enableShutterSound: true,
      });

      router.navigate({
        pathname: "/(protected)/(tabs)/daily-log",
        params: {
          scannedMeal: "__manual__",
          photoUri: photo.path,
        },
      });
    } catch (e) {
      console.error("[MealScanner] Take photo error:", e);
    } finally {
      setIsTakingPhoto(false);
    }
  }, [isTakingPhoto]);

  // Close scanner
  const handleClose = useCallback(() => {
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
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Top bar: close button */}
      <View
        className="absolute left-0 right-0 flex-row items-center justify-between px-4"
        style={{ top: insets.top + 8 }}
      >
        <Pressable onPress={handleClose} className="active:opacity-70">
          <BlurView
            intensity={40}
            tint="dark"
            className="w-10 h-10 rounded-full overflow-hidden items-center justify-center border border-white/10"
          >
            <MaterialIcons name="close" size={22} color="white" />
          </BlurView>
        </Pressable>
      </View>

      {/* Bottom controls: take photo button */}
      <View
        className="absolute left-0 right-0 items-center"
        style={{ bottom: insets.bottom + 24 }}
      >
        <View className="items-center gap-3">
          <Pressable
            onPress={handleTakePhoto}
            disabled={isTakingPhoto}
            className="active:scale-95"
          >
            <View className="w-20 h-20 rounded-full border-4 border-white/80 items-center justify-center">
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
                {isTakingPhoto ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialIcons name="camera" size={32} color="white" />
                )}
              </View>
            </View>
          </Pressable>
          <BlurView
            intensity={30}
            tint="dark"
            className="overflow-hidden rounded-full border border-white/10"
          >
            <Text className="text-white/70 text-xs font-semibold px-3 py-1">
              Take Photo
            </Text>
          </BlurView>
        </View>
      </View>
    </View>
  );
}
