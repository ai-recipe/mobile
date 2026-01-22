import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  withTabBar?: boolean;
  backgroundColor?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  withTabBar = false,
  backgroundColor = "transparent",
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
      backgroundColor,
      // Generic Top Padding
      // On Android, we sometimes need to account for StatusBar if transparency is used
      paddingTop:
        Platform.OS === "android"
          ? Math.max(insets.top, StatusBar.currentHeight || 0)
          : insets.top,

      // Generic Bottom Padding
      // If we have a tab bar, we add its height + safe area
      // If no tab bar, just safe area (for home indicator)
      paddingBottom: withTabBar
        ? insets.bottom + TAB_BAR_HEIGHT
        : insets.bottom + 16, // Extra 16 for breathing room
    },
  ];

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Default light background from design
  },
});
