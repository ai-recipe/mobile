import { api } from "@/api/axios";
import axios from "axios";

// Subscription endpoints are outside /api/v1 so we use EXPO_PUBLIC_BASE_URL
const baseApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Forward the auth token from AsyncStorage for activate calls
import AsyncStorage from "@react-native-async-storage/async-storage";
baseApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export interface SubscriptionStatus {
  tier: "free" | "pro" | "trial";
  billingPeriod: "monthly" | "yearly" | null;
  isActive: boolean;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
}

class SubscriptionService {
  /** GET /api/v1/user/subscription — fetch current subscription from backend */
  getStatus() {
    return api.get<{ subscription: SubscriptionStatus }>("/user/subscription");
  }

  /** POST /api/google-play/activate — verify purchase token and activate */
  activateGooglePlay(data: {
    purchaseToken: string;
    basePlanId: "monthly" | "yearly";
    packageName?: string;
  }) {
    return baseApi.post<{ subscription: SubscriptionStatus }>(
      "/api/google-play/activate",
      data,
    );
  }
}

export default new SubscriptionService();
