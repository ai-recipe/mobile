import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
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
import { TopNavBar } from "./TopNavBar";

interface ScreenWrapperProps {
  children: React.ReactNode;
  withTabBar?: boolean;
  backgroundColor?: string;
  showBackButton?: boolean;
  withTabNavigation?: boolean;
  title?: string;
  showTopNavBar?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  showBackButton = false,
  withTabNavigation = true,
  title = "",
  showTopNavBar = true,
}) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme];

  const containerStyle = [
    styles.container,
    {
      backgroundColor: themeColors.background,
      ...(withTabNavigation
        ? {
            marginBottom: 76,
            paddingTop:
              Platform.OS === "android"
                ? Math.max(insets.top, StatusBar.currentHeight || 0)
                : insets.top,
            paddingBottom: insets.bottom + 16,
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
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={themeColors.text}
            />
          </TouchableOpacity>
        )}
        {title && (
          <Text
            style={[styles.title, { color: themeColors.text }]}
            className="text-xl font-bold p-5"
          >
            {title}
          </Text>
        )}
      </View>
      {showTopNavBar && <TopNavBar />}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {},
});
