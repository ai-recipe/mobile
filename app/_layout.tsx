//import messaging from "@react-native-firebase/messaging";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { CopilotProvider } from "react-native-copilot";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { TourTooltip } from "../components/TourTooltip";
import "../global.css";

// Must be registered outside the React tree (module scope)
/*messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background notification:", remoteMessage.notification);
});*/

import { FunnyLoader } from "@/components/FunnyLoader";
import { ThemeSync } from "@/components/ThemeSync";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import useInitApp from "@/hooks/useInitApp";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initDeviceAsync } from "@/store/slices/authSlice";
import { Stack } from "expo-router";
import { useTranslation } from "@/node_modules/react-i18next";
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
  const { isInitDeviceLoading } = useAppSelector((state) => state.auth);
  const { currentLanguage } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (currentLanguage) {
      dispatch(initDeviceAsync());
    }
  }, [dispatch, currentLanguage]);

  if (isLoading || isInitDeviceLoading) {
    return <FunnyLoader />;
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

function RootLayoutWithLanguageSupport() {
  // Listen to language changes from Redux to trigger re-renders
  const { currentLanguage } = useAppSelector((state) => state.app);

  return (
    <CopilotLabelsWrapper key={currentLanguage}>
      <RootLayoutNavigator />
    </CopilotLabelsWrapper>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView
        className={`bg-background  ${Platform.OS === "ios" ? "pb-0 " : ""}`}
        style={{ flex: 1 }}
      >
        <RootLayoutWithLanguageSupport />
      </GestureHandlerRootView>
    </Provider>
  );
}
