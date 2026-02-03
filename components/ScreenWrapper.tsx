import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  withTabBar?: boolean;
  backgroundColor?: string;
  showBackButton?: boolean;
  withTabNavigation?: boolean;
  title?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  backgroundColor = "transparent",
  showBackButton = false,
  withTabNavigation = true,
  title = "",
}) => {
  const insets = useSafeAreaInsets();

  /**
   * Constants for Layout
   * TAB_BAR_HEIGHT is the estimated height of our custom tab bar
   */
  const TAB_BAR_HEIGHT = 70;

  const containerStyle = [
    styles.container,
    {
      backgroundColor: "#fff",
      // Generic Top Padding
      // On Android, we sometimes need to account for StatusBar if transparency is used
      ...(withTabNavigation
        ? {
            marginBottom: 76,
            paddingTop:
              Platform.OS === "android"
                ? Math.max(insets.top, StatusBar.currentHeight || 0)
                : insets.top,

            // Generic Bottom Padding
            // If we have a tab bar, we add its height + safe area
            // If no tab bar, just safe area (for home indicator)
            paddingBottom: insets.bottom + 16, // Extra 16 for breathing room
          }
        : {
            marginBottom: 0,
            paddingTop: Platform.OS === "android" ? insets.top : insets.top,
          }),
    },
  ];

  return (
    <View style={containerStyle}>
      <View className="flex-row items-center">
        {showBackButton && (
          <TouchableOpacity onPress={() => router.back()} className="p-5">
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        )}
        {title && <Text className="text-xl font-bold p-5">{title}</Text>}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Default light background from design
  },
});
