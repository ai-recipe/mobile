//import messaging from "@react-native-firebase/messaging";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import "../global.css";
import i18n from "@/i18n";

// Must be registered outside the React tree (module scope)
/*messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background notification:", remoteMessage.notification);
});*/

import { ThemeSync } from "@/components/ThemeSync";
import useInitApp from "@/hooks/useInitApp";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initDeviceAsync } from "@/store/slices/authSlice";
import { injectDispatch, injectGetUserType } from "@/api/axios";
import { Stack } from "expo-router";
import { FunnyLoader } from "@/components/FunnyLoader";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://7a90cff677e854e1452ca6321fcdac53@o4511230880579584.ingest.de.sentry.io/4511230885822544",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

function RootLayoutNavigator() {
  const { isLoading } = useAppSelector((state) => state.app);
  useInitApp();
  const { isInitDeviceLoading } = useAppSelector((state) => state.auth);
  const { currentLanguage } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  useEffect(() => {
    injectDispatch(dispatch);
    injectGetUserType(() => store.getState().auth.user?.userType);
  }, [dispatch]);

  useEffect(() => {
    if (!currentLanguage) return;
    const init = async () => {
      dispatch(initDeviceAsync());
    };
    init();
  }, [dispatch, currentLanguage]);

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

  return <RootLayoutNavigator />;
}

export default Sentry.wrap(function RootLayout() {
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
});
