import { api } from "./axios";

export async function registerFcmToken(fcmToken: string, platform: string) {
  await api.post("/users/fcm-token", { fcmToken, platform });
}
