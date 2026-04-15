//import messaging from "@react-native-firebase/messaging";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import "../global.css";

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

  return <RootLayoutNavigator />;
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
