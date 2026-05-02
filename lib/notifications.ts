import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { router } from "expo-router";

import { Analytics } from "@/analytics";
import { registerFcmToken } from "@/api/notifications";

const IS_WEB = Platform.OS === "web";

// ── Permissions ────────────────────────────────────────────────────────────────

export async function requestNotificationPermissions(): Promise<boolean> {
  if (IS_WEB) return false;
  try {
    if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    }
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (e) {
    console.warn("requestNotificationPermissions failed:", e);
    return false;
  }
}

export async function hasNotificationPermissions(): Promise<boolean> {
  if (IS_WEB) return false;
  try {
    if (Platform.OS === "ios") {
      const authStatus = await messaging().hasPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    }
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  } catch (e) {
    console.warn("hasNotificationPermissions failed:", e);
    return false;
  }
}

// ── Token ──────────────────────────────────────────────────────────────────────

export async function getFirebaseToken(): Promise<string | null> {
  if (IS_WEB) return null;
  try {
    return await messaging().getToken();
  } catch (e) {
    console.warn("getFirebaseToken failed:", e);
    return null;
  }
}

export async function getExistingPushToken(): Promise<string | null> {
  const hasPermissions = await hasNotificationPermissions();
  if (!hasPermissions) return null;
  return getFirebaseToken();
}

export async function initializeNotifications(): Promise<string | null> {
  if (IS_WEB) return null;
  const hasPermissions = await hasNotificationPermissions();
  if (!hasPermissions) {
    const granted = await requestNotificationPermissions();
    if (!granted) return null;
  }
  return getFirebaseToken();
}

export async function registerToken(platform: string): Promise<void> {
  const token = await initializeNotifications();
  console.log("fcmtoken", token);
  if (token) {
    await registerFcmToken(token, platform);
  }
}

export function setupTokenRefreshListener(
  onTokenRefresh: (token: string) => void | Promise<void>,
): () => void {
  if (IS_WEB) return () => {};
  return messaging().onTokenRefresh(async (fcmToken) => {
    try {
      await onTokenRefresh(fcmToken);
    } catch (e) {
      console.warn("Token refresh callback failed:", e);
    }
  });
}

// ── Navigation ─────────────────────────────────────────────────────────────────

function handleNotificationNavigation(data: Record<string, any>) {
  try {
    if (data?.screen) {
      router.push(data.screen as any);
    }
    Analytics.appError("push_notification_opened", data?.screen ?? "unknown");
  } catch (e) {
    console.warn("handleNotificationNavigation failed:", e);
  }
}

// ── Messaging init ─────────────────────────────────────────────────────────────

export function initializeFirebaseMessaging(): () => void {
  if (IS_WEB) return () => {};

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Foreground: display via expo-notifications so the system UI shows
  const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title ?? "New Notification",
          body: remoteMessage.notification?.body ?? "",
          data: (remoteMessage.data as Record<string, any>) ?? {},
          sound: true,
        },
        trigger: null,
      });
    } catch (e) {
      console.warn("Foreground notification display failed:", e);
    }
  });

  // Background: notification tap while app is backgrounded
  messaging().onNotificationOpenedApp((remoteMessage) => {
    if (remoteMessage.data) {
      handleNotificationNavigation(remoteMessage.data as Record<string, any>);
    }
  });

  // Killed state: app opened from tapped notification
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage?.data) {
        setTimeout(() => {
          handleNotificationNavigation(
            remoteMessage.data as Record<string, any>,
          );
        }, 1000);
      }
    })
    .catch((e) => console.warn("getInitialNotification failed:", e));

  return unsubscribeForeground;
}
