import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001/api/v1/",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Generate a unique idempotency key
 */
export function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("token");
    console.log("token", token);
    const localeStorageCurrentLanguage = await AsyncStorage.getItem(
      "CURRENT_LANGUAGE",
    );
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (localeStorageCurrentLanguage) {
      config.headers["Accept-Language"] = localeStorageCurrentLanguage;
    }
    config.headers["Idempotency-Key"] = generateIdempotencyKey();
    config.headers["X-Timezone"] = "UTC";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
