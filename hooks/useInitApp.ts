import { AppDispatch } from "@/store";
import { initI18n } from "@/store/slices/appSlice";
import { setIsOnboarded } from "@/store/slices/authSlice";
import type { ThemePreference } from "@/store/slices/uiSlice";
import { setTheme } from "@/store/slices/uiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

const THEME_STORAGE_KEY = "appTheme";

const useInitApp = () => {
  const dispatch = useDispatch<AppDispatch>();

  const initOnboardedStatus = useCallback(async () => {
    const onboarded = await AsyncStorage.getItem("isOnboarded");
    console.log("onboarded", onboarded);
    if (onboarded === "true") {
      dispatch(setIsOnboarded(false));
    }
  }, [dispatch]);

  const initTheme = useCallback(async () => {
    const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    const valid: ThemePreference[] = ["light", "dark", "system"];
    if (stored && valid.includes(stored as ThemePreference)) {
      dispatch(setTheme(stored as ThemePreference));
    }
    // else: keep Redux default "system" → device theme
  }, [dispatch]);

  useEffect(() => {
    dispatch(initI18n());
    initOnboardedStatus();
    initTheme();
  }, [dispatch, initOnboardedStatus, initTheme]);
};

export default useInitApp;
export { THEME_STORAGE_KEY };
