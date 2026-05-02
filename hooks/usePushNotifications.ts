import { useEffect } from "react";
import { Platform } from "react-native";

import { useAppSelector } from "@/store/hooks";
import {
  initializeFirebaseMessaging,
  registerToken,
  setupTokenRefreshListener,
} from "@/lib/notifications";
import { registerFcmToken } from "@/api/notifications";

export function usePushNotifications() {
  const { accessToken } = useAppSelector((state) => state.auth);

  // Register token once authenticated
  useEffect(() => {
    if (!accessToken) return;
    registerToken(Platform.OS);
  }, [accessToken]);

  // Token refresh: re-register when FCM rotates the token
  useEffect(() => {
    if (!accessToken) return;
    const unsubscribe = setupTokenRefreshListener(async (newToken) => {
      await registerFcmToken(newToken, Platform.OS);
    });
    return unsubscribe;
  }, [accessToken]);

  // Foreground / background / killed-state handlers
  useEffect(() => {
    const unsubscribe = initializeFirebaseMessaging();
    return unsubscribe;
  }, []);
}
