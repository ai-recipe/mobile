import { Stack } from "expo-router";
import React, { useEffect } from "react";
import "../global.css";
import { Platform, View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import { store } from "@/store";
import { useAppSelector } from "@/store/hooks";

function RootLayoutNavigator() {
  const { isLoading } = useAppSelector((state) => state.app);

  useEffect(() => {}, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
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
