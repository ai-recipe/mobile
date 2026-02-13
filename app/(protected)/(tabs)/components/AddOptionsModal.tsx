import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type AddOption = "scan-food" | "manual-log" | "ai-chef";

interface AddOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onManualLog: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export function AddOptionsModal({
  visible,
  onClose,
  onManualLog,
}: AddOptionsModalProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 25,
          stiffness: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleScanFood = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    router.push("/screens/meal-scanner");
  };

  const handleManualLog = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    onManualLog();
  };

  const handleAIChef = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    router.push("/screens/ai-scan-form");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropAnim,
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheetContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
        pointerEvents="box-none"
      >
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: isDark ? "#18181b" : "#FFFFFF",
              borderTopColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.2)",
            },
          ]}
        >
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View
              style={[
                styles.handle,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.12)",
                },
              ]}
            />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Log Food</Text>
            <Text style={[styles.subtitle, { color: theme.icon }]}>
              Choose how you'd like to add your meal today.
            </Text>
          </View>

          {/* Options */}
          <View style={styles.options}>
            {/* Scan Meal */}
            <Pressable
              onPress={handleScanFood}
              style={({ pressed }) => [
                styles.optionCardOuter,
                {
                  backgroundColor: isDark ? "#27272a" : "#FFFFFF",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "#F3F4F6",
                },
                pressed && styles.optionPressed,
              ]}
            >
              <View style={styles.optionCardRow}>
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor: isDark
                        ? "rgba(234,88,12,0.15)"
                        : "#FFF7ED",
                    },
                  ]}
                >
                  <MaterialIcons name="photo-camera" size={24} color="#EA580C" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: theme.text }]}>
                    Scan Meal
                  </Text>
                  <Text style={[styles.optionDesc, { color: theme.icon }]}>
                    Take a photo of your plate
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={isDark ? "#52525b" : "#9CA3AF"}
                />
              </View>
            </Pressable>

            {/* Manual Log */}
            <Pressable
              onPress={handleManualLog}
              style={({ pressed }) => [
                styles.optionCardOuter,
                {
                  backgroundColor: isDark ? "#27272a" : "#FFFFFF",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "#F3F4F6",
                },
                pressed && styles.optionPressed,
              ]}
            >
              <View style={styles.optionCardRow}>
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor: isDark
                        ? "rgba(59,130,246,0.15)"
                        : "#EFF6FF",
                    },
                  ]}
                >
                  <MaterialIcons name="edit-note" size={24} color="#3B82F6" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: theme.text }]}>
                    Manual Log
                  </Text>
                  <Text style={[styles.optionDesc, { color: theme.icon }]}>
                    Search database or quick add
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={isDark ? "#52525b" : "#9CA3AF"}
                />
              </View>
            </Pressable>

            {/* AI Chef - Premium Card */}
            <Pressable
              onPress={handleAIChef}
              style={({ pressed }) => [
                styles.aiChefCard,
                pressed && styles.optionPressed,
              ]}
            >
              <LinearGradient
                colors={
                  isDark
                    ? ["#431407", "#7C2D12"]
                    : ["#FFF7ED", "#FFEDD5"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.aiChefGradient,
                  {
                    borderColor: isDark ? "#7C2D12" : "#FFEDD5",
                  },
                ]}
              >
                {/* Icon */}
                <LinearGradient
                  colors={["#EA580C", "#C2410C"]}
                  style={styles.aiChefIconWrap}
                >
                  <MaterialIcons
                    name="auto-awesome"
                    size={24}
                    color="#FFFFFF"
                  />
                </LinearGradient>

                {/* Text */}
                <View style={styles.optionTextContainer}>
                  <View style={styles.aiChefTitleRow}>
                    <Text style={[styles.optionTitle, { fontWeight: "700", color: theme.text }]}>
                      AI Chef
                    </Text>
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.optionDesc,
                      { color: isDark ? "#D4D4D8" : "#4B5563" },
                    ]}
                  >
                    Create a recipe from ingredients
                  </Text>
                </View>

                <MaterialIcons
                  name="arrow-forward"
                  size={24}
                  color={isDark ? "#FB923C" : "#EA580C"}
                />
              </LinearGradient>
            </Pressable>
          </View>

          {/* Cancel */}
          <View style={styles.cancelContainer}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelBtn,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text
                style={[
                  styles.cancelText,
                  { color: isDark ? "#52525b" : "#9CA3AF" },
                ]}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  handleContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 24,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  options: {
    gap: 14,
  },
  optionCardOuter: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  optionCardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  optionPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  aiChefCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#EA580C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  aiChefGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  aiChefIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#EA580C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  aiChefTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  newBadge: {
    backgroundColor: "#EA580C",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  newBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  cancelContainer: {
    marginTop: 28,
    alignItems: "center",
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 100,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
