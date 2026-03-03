import React, { useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { CopilotProvider } from "react-native-copilot";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useDispatch } from "react-redux";
import { TourTooltip } from "../components/TourTooltip";
import "../global.css";

import { ThemeSync } from "@/components/ThemeSync";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import useInitApp from "@/hooks/useInitApp";
import { store } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { initDeviceAsync } from "@/store/slices/authSlice";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
function CopilotLabelsWrapper({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <CopilotProvider
      tooltipComponent={TourTooltip}
      tooltipStyle={{
        backgroundColor: "transparent",
        boxShadow: "none",
        margin: 0,
        padding: 0,
        borderRadius: 0,
      }}
      stepNumberComponent={() => null}
      overlay="view"
      animated={true}
      labels={{
        finish: t("copilot.finish"),
        next: t("copilot.next"),
        previous: t("copilot.previous"),
        skip: t("copilot.skip"),
      }}
    >
      {children}
    </CopilotProvider>
  );
}

function RootLayoutNavigator() {
  const { isLoading } = useAppSelector((state) => state.app);
  useInitApp();
  const { token, isInitDeviceLoading } = useAppSelector((state) => state.auth);
  const { currentLanguage } = useAppSelector((state) => state.app);
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentLanguage) {
      dispatch(initDeviceAsync() as any);
    }
  }, [dispatch, currentLanguage]);
  const colors = useThemeColor();
  const colorScheme = useColorScheme();

  if (isLoading || isInitDeviceLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors[colorScheme].background,
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
        <CopilotLabelsWrapper>
          <RootLayoutNavigator />
        </CopilotLabelsWrapper>
      </GestureHandlerRootView>
    </Provider>
  );
}
