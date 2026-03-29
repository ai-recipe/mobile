/*import { registerFcmToken } from "@/api/notifications";
import { useAppSelector } from "@/store/hooks";
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { Platform } from "react-native";

export function usePushNotifications() {
  const { token: authToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only register when the user is authenticated
    if (!authToken) return;

    let cancelled = false;

    async function setup() {
      try {
        // Request permission (iOS prompts, Android 13+ prompts)
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) return;

        const fcmToken = await messaging().getToken();
        if (!cancelled && fcmToken) {
          await registerFcmToken(fcmToken, Platform.OS);
        }
      } catch (e) {
        // Non-fatal — notifications are best-effort
        console.warn("Push notification setup failed:", e);
      }
    }

    setup();

    // Re-register whenever the token rotates
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      try {
        await registerFcmToken(newToken, Platform.OS);
      } catch (e) {
        console.warn("FCM token refresh registration failed:", e);
      }
    });

    return () => {
      cancelled = true;
      unsubscribeTokenRefresh();
    };
  }, [authToken]);

  // Handle foreground notifications (show an alert or dispatch to Redux as needed)
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground notification:", remoteMessage.notification);
    });
    return unsubscribe;
  }, []);
}*/
