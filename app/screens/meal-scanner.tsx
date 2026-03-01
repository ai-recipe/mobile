import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  disconnectScan,
  resetScan,
  setCapturedPhotoUri,
  startScanAsync,
} from "@/store/slices/scanMealSlice";
import { fetchFoodLogsAsync } from "@/store/slices/dailyLogsSlice";
import { decrementCredit } from "@/store/slices/authSlice";
import { openSoftPaywall } from "@/store/slices/modalSlice";
import { SoftPaywallModal } from "./components/SoftPaywallModal";

/**
 * Meal Scanner screen.
 * Takes a photo → uploads via WebSocket scan flow → shows result → navigates home.
 */
export default function MealScannerScreen() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<Camera>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  const dispatch = useAppDispatch();
  const { status, progress, progressMessage, result, error, capturedPhotoUri } =
    useAppSelector((state) => state.scanMeal);
  const { creditRemaining, softPaywallOpen } = useAppSelector((state) => ({
    creditRemaining: state.auth.creditRemaining,
    softPaywallOpen: state.modal.softPaywallOpen,
  }));

  // Rotating campaign messages shown during the scan loading phase
  const CAMPAIGN_MESSAGES = [
    "Pro kullanıcılar 3x daha hızlı AI analizi alır.",
    "Sınırsız tarama için Pro'ya geç.",
    "Pro ile tüm besin değerlerini otomatik kaydet.",
    "Yapay zeka şefin her öğünde yanında.",
  ];
  const [campaignIdx, setCampaignIdx] = useState(0);

  const scanning =
    status === "connecting" ||
    status === "uploading" ||
    status === "scanning";

  useEffect(() => {
    if (!scanning) return;
    const t = setInterval(
      () => setCampaignIdx((i) => (i + 1) % CAMPAIGN_MESSAGES.length),
      2500,
    );
    return () => clearInterval(t);
  }, [scanning]);

  // Camera permission
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  // Reset scan state on mount; disconnect socket on unmount
  useEffect(() => {
    dispatch(resetScan());
    return () => {
      disconnectScan();
    };
  }, []);

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

  const handleTakePhoto = useCallback(async () => {
    if (!cameraRef.current || isTakingPhoto) return;

    // Guard: no credits left
    if (creditRemaining !== null && creditRemaining <= 0) {
      dispatch(openSoftPaywall());
      return;
    }

    try {
      setIsTakingPhoto(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const photo = await cameraRef.current.takePhoto({
        enableShutterSound: true,
      });

      const uri = photo.path;
      dispatch(decrementCredit());
      dispatch(setCapturedPhotoUri(uri));
      dispatch(startScanAsync(uri));
    } catch (e) {
      console.error("[MealScanner] Take photo error:", e);
    } finally {
      setIsTakingPhoto(false);
    }
  }, [isTakingPhoto, dispatch, creditRemaining]);

  const handleClose = useCallback(() => {
    disconnectScan();
    dispatch(resetScan());
    router.back();
  }, [dispatch]);

  const handleScanAgain = useCallback(() => {
    dispatch(resetScan());
  }, [dispatch]);

  const handleCompleteScan = useCallback(() => {
    dispatch(fetchFoodLogsAsync());
    dispatch(resetScan());
    router.navigate("/(protected)/(tabs)/");
  }, [dispatch]);

  const isScanning = scanning;

  // ── Permission denied ───────────────────────────────────────────
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

  // ── No device ───────────────────────────────────────────────────
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

      {/* Full-screen camera (always rendered so it stays warm) */}
      <Camera
        ref={cameraRef}
        style={[StyleSheet.absoluteFill, isScanning && { opacity: 0.35 }]}
        device={device}
        isActive={status === "idle"}
        photo={true}
      />

      {/* ── Close button (always visible) ─────────────────────── */}
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

      {/* ── IDLE: take-photo button ────────────────────────────── */}
      {status === "idle" && (
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
      )}

      {/* ── SCANNING: progress overlay ────────────────────────── */}
      {isScanning && (
        <View
          className="absolute left-0 right-0 bottom-0 px-5"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          <BlurView
            intensity={60}
            tint="dark"
            className="rounded-3xl overflow-hidden border border-white/10 p-5"
          >
            {/* Photo thumbnail + spinner */}
            <View className="flex-row items-center gap-4 mb-4">
              {capturedPhotoUri ? (
                <Image
                  source={{ uri: capturedPhotoUri }}
                  className="w-14 h-14 rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-14 h-14 rounded-xl bg-white/10 items-center justify-center">
                  <MaterialIcons name="restaurant" size={24} color="#f39849" />
                </View>
              )}
              <View className="flex-1">
                <Text className="text-white font-bold text-base">
                  Analyzing Meal
                </Text>
                <Text className="text-zinc-400 text-xs mt-0.5" numberOfLines={1}>
                  {progressMessage || "Please wait..."}
                </Text>
              </View>
              <ActivityIndicator size="small" color="#f39849" />
            </View>

            {/* Progress bar */}
            <View className="h-2 bg-white/10 rounded-full overflow-hidden">
              <View
                className="h-full bg-[#f39849] rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
            <Text className="text-zinc-500 text-xs mt-1.5 text-right">
              {progress}%
            </Text>

            {/* Rotating campaign nudge */}
            <View className="flex-row items-center gap-1.5 mt-3 pt-3 border-t border-white/10">
              <Text className="text-[#f39849] text-[10px] font-black uppercase tracking-wider">
                PRO
              </Text>
              <Text className="text-zinc-400 text-xs flex-1">
                {CAMPAIGN_MESSAGES[campaignIdx]}
              </Text>
            </View>
          </BlurView>
        </View>
      )}

      {/* ── COMPLETED: result card ────────────────────────────── */}
      {status === "completed" && result && (
        <View
          className="absolute left-0 right-0 bottom-0 px-5"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          <BlurView
            intensity={70}
            tint="dark"
            className="rounded-3xl overflow-hidden border border-white/10 p-5"
          >
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-4">
              {capturedPhotoUri && (
                <Image
                  source={{ uri: capturedPhotoUri }}
                  className="w-14 h-14 rounded-xl"
                  resizeMode="cover"
                />
              )}
              <View className="flex-1">
                <Text className="text-[#f39849] text-xs font-semibold uppercase tracking-wider">
                  Scan Complete
                </Text>
                <Text
                  className="text-white font-bold text-lg leading-tight"
                  numberOfLines={2}
                >
                  {result.foodName ?? "Meal Detected"}
                </Text>
              </View>
              <MaterialIcons name="check-circle" size={28} color="#4ade80" />
            </View>

            {/* Nutrition row */}
            {(result.calories != null ||
              result.proteinGrams != null ||
              result.carbsGrams != null ||
              result.fatGrams != null) && (
              <View className="flex-row justify-between bg-white/5 rounded-2xl px-4 py-3 mb-4">
                <NutrientBadge label="Cal" value={result.calories} unit="kcal" />
                <NutrientBadge label="Protein" value={result.proteinGrams} unit="g" />
                <NutrientBadge label="Carbs" value={result.carbsGrams} unit="g" />
                <NutrientBadge label="Fat" value={result.fatGrams} unit="g" />
              </View>
            )}

            {/* Actions */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleScanAgain}
                className="flex-1 py-3 rounded-2xl border border-white/20 items-center active:opacity-70"
              >
                <Text className="text-white font-semibold text-sm">
                  Scan Again
                </Text>
              </Pressable>
              <Pressable
                onPress={handleCompleteScan}
                className="flex-1 py-3 rounded-2xl bg-[#f39849] items-center active:opacity-80"
              >
                <Text className="text-black font-bold text-sm">
                  Complete Scan
                </Text>
              </Pressable>
            </View>
          </BlurView>
        </View>
      )}

      {/* ── SOFT PAYWALL ─────────────────────────────────────── */}
      <SoftPaywallModal visible={softPaywallOpen} />

      {/* ── ERROR: error card ─────────────────────────────────── */}
      {status === "error" && (
        <View
          className="absolute left-0 right-0 bottom-0 px-5"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          <BlurView
            intensity={60}
            tint="dark"
            className="rounded-3xl overflow-hidden border border-red-500/30 p-5"
          >
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-12 h-12 rounded-full bg-red-500/20 items-center justify-center">
                <MaterialIcons name="error-outline" size={24} color="#ef4444" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-base">
                  Scan Failed
                </Text>
                <Text
                  className="text-zinc-400 text-xs mt-0.5"
                  numberOfLines={2}
                >
                  {error ?? "Something went wrong. Please try again."}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleScanAgain}
              className="py-3 rounded-2xl bg-[#f39849] items-center active:opacity-80"
            >
              <Text className="text-black font-bold text-sm">Try Again</Text>
            </Pressable>
          </BlurView>
        </View>
      )}
    </View>
  );
}

// ── Small helper component ─────────────────────────────────────────
function NutrientBadge({
  label,
  value,
  unit,
}: {
  label: string;
  value?: number;
  unit: string;
}) {
  if (value == null) return null;
  return (
    <View className="items-center">
      <Text className="text-white font-bold text-base">
        {Math.round(value)}
        <Text className="text-zinc-400 text-xs font-normal"> {unit}</Text>
      </Text>
      <Text className="text-zinc-500 text-xs mt-0.5">{label}</Text>
    </View>
  );
}
