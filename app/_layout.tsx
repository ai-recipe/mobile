import React, { useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useDispatch } from "react-redux";
import "../global.css";

import { ThemeSync } from "@/components/ThemeSync";
import { useThemeColor } from "@/hooks/use-theme-color";
import useInitApp from "@/hooks/useInitApp";
import { store } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { initDeviceAsync } from "@/store/slices/authSlice";
import { Stack } from "expo-router";
function RootLayoutNavigator() {
  const { isLoading } = useAppSelector((state) => state.app);
  useInitApp();
  const { token, isInitDeviceLoading } = useAppSelector((state) => state.auth);
  console.log(token);
  const { currentLanguage } = useAppSelector((state) => state.app);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("currentLanguage", currentLanguage);
    if (currentLanguage) {
      dispatch(initDeviceAsync() as any);
    }
  }, [dispatch, currentLanguage]);
  const colors = useThemeColor();
  if (isLoading || isInitDeviceLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return (
    <ThemeSync>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeSync>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView
        className={`bg-background  ${Platform.OS === "ios" ? "pb-0 " : ""}`}
        style={{ flex: 1 }}
      >
        <RootLayoutNavigator />
      </GestureHandlerRootView>
    </Provider>
  );
}
