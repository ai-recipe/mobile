import { CONFIDENCE_THRESHOLD } from "@/constants/food-labels";
import type { ScanStatus } from "@/hooks/use-food-detection";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface ScanningOverlayProps {
  status: ScanStatus;
  detectedLabel: string | null;
  confidence: number;
  consecutiveCount: number;
  isModelReady: boolean;
}

/**
 * Animated overlay shown on top of the camera view during scanning.
 * Displays a pulsing ring animation and contextual status text.
 */
export function ScanningOverlay({
  status,
  detectedLabel,
  confidence,
  consecutiveCount,
  isModelReady,
}: ScanningOverlayProps) {
  // Pulse animation values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  // Secondary ring for a layered effect
  const ring2Scale = useSharedValue(1);
  const ring2Opacity = useSharedValue(0.3);

  useEffect(() => {
    if (status === "searching" || status === "detecting") {
      // Primary pulse
      pulseScale.value = withRepeat(
        withTiming(1.8, { duration: 1500, easing: Easing.out(Easing.ease) }),
        -1,
        true,
      );
      pulseOpacity.value = withRepeat(
        withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
        -1,
        true,
      );

      // Secondary ring (offset timing)
      ring2Scale.value = withRepeat(
        withTiming(2.2, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        true,
      );
      ring2Opacity.value = withRepeat(
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        true,
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
      pulseOpacity.value = withTiming(0, { duration: 300 });
      ring2Scale.value = withTiming(1, { duration: 300 });
      ring2Opacity.value = withTiming(0, { duration: 300 });
    }
  }, [status]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Opacity.value,
  }));

  const getStatusText = (): string => {
    if (!isModelReady) return "Loading AI model...";
    switch (status) {
      case "idle":
        return "Tap Start to begin scanning";
      case "searching":
        return "Point at your meal...";
      case "detecting":
        return detectedLabel
          ? `Detecting: ${detectedLabel}`
          : "Something detected...";
      case "caught":
        return "Meal identified!";
      default:
        return "";
    }
  };

  const getStatusIcon = (): keyof typeof MaterialIcons.glyphMap => {
    if (!isModelReady) return "hourglass-empty";
    switch (status) {
      case "idle":
        return "center-focus-strong";
      case "searching":
        return "search";
      case "detecting":
        return "restaurant";
      case "caught":
        return "check-circle";
      default:
        return "center-focus-strong";
    }
  };

  const getAccentColor = (): string => {
    switch (status) {
      case "searching":
        return "#f39849";
      case "detecting":
        return confidence >= CONFIDENCE_THRESHOLD ? "#22c55e" : "#f39849";
      case "caught":
        return "#22c55e";
      default:
        return "#f39849";
    }
  };

  if (status === "caught") return null;

  const accentColor = getAccentColor();

  return (
    <View className="absolute inset-0 items-center justify-center">
      {/* Pulse rings - center of screen */}
      {(status === "searching" || status === "detecting") && (
        <View className="items-center justify-center">
          {/* Outer ring */}
          <Animated.View
            style={[
              ring2Style,
              {
                position: "absolute",
                width: 160,
                height: 160,
                borderRadius: 80,
                borderWidth: 2,
                borderColor: accentColor,
              },
            ]}
          />

          {/* Inner pulse ring */}
          <Animated.View
            style={[
              pulseStyle,
              {
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 2.5,
                borderColor: accentColor,
              },
            ]}
          />

          {/* Center icon */}
          <View
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: `${accentColor}30` }}
          >
            <MaterialIcons
              name={getStatusIcon()}
              size={28}
              color={accentColor}
            />
          </View>
        </View>
      )}

      {/* Status bar at top */}
      <View className="absolute top-24 left-4 right-4 items-center">
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
          <BlurView
            intensity={40}
            tint="dark"
            className="overflow-hidden rounded-2xl border border-white/10"
          >
            <View className="px-5 py-3 flex-row items-center gap-3">
              <MaterialIcons
                name={getStatusIcon()}
                size={18}
                color={accentColor}
              />
              <Text
                className="text-white text-sm font-semibold"
                numberOfLines={1}
              >
                {getStatusText()}
              </Text>
            </View>
          </BlurView>
        </Animated.View>
      </View>

      {/* Confidence indicator when detecting */}
      {status === "detecting" && detectedLabel && (
        <View className="absolute bottom-48 left-4 right-4 items-center">
          <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
            <BlurView
              intensity={50}
              tint="dark"
              className="overflow-hidden rounded-2xl border border-white/10"
            >
              <View className="px-5 py-3 items-center gap-2">
                <Text className="text-white text-lg font-bold">
                  {detectedLabel}
                </Text>
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-white/60 text-xs">Confidence:</Text>
                    <Text
                      className="text-sm font-bold"
                      style={{
                        color:
                          confidence >= CONFIDENCE_THRESHOLD
                            ? "#22c55e"
                            : "#f39849",
                      }}
                    >
                      {Math.round(confidence * 100)}%
                    </Text>
                  </View>
                  <View className="w-px h-3 bg-white/20" />
                  <View className="flex-row items-center gap-1">
                    <Text className="text-white/60 text-xs">Frames:</Text>
                    <Text className="text-white text-sm font-bold">
                      {consecutiveCount}/5
                    </Text>
                  </View>
                </View>
                {/* Progress dots */}
                <View className="flex-row gap-1.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <View
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          i < consecutiveCount ? accentColor : "rgba(255,255,255,0.2)",
                      }}
                    />
                  ))}
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </View>
      )}

      {/* Corner brackets for scanning viewfinder effect */}
      {(status === "searching" || status === "detecting") && (
        <>
          {/* Top-left bracket */}
          <View className="absolute top-40 left-8">
            <View
              className="w-10 h-10 border-t-2 border-l-2 rounded-tl-lg"
              style={{ borderColor: `${accentColor}80` }}
            />
          </View>
          {/* Top-right bracket */}
          <View className="absolute top-40 right-8">
            <View
              className="w-10 h-10 border-t-2 border-r-2 rounded-tr-lg"
              style={{ borderColor: `${accentColor}80` }}
            />
          </View>
          {/* Bottom-left bracket */}
          <View className="absolute bottom-56 left-8">
            <View
              className="w-10 h-10 border-b-2 border-l-2 rounded-bl-lg"
              style={{ borderColor: `${accentColor}80` }}
            />
          </View>
          {/* Bottom-right bracket */}
          <View className="absolute bottom-56 right-8">
            <View
              className="w-10 h-10 border-b-2 border-r-2 rounded-br-lg"
              style={{ borderColor: `${accentColor}80` }}
            />
          </View>
        </>
      )}
    </View>
  );
}
