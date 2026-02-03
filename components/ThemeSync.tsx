import { THEME_STORAGE_KEY } from "@/hooks/useInitApp";
import { useAppSelector } from "@/store/hooks";
import type { ThemePreference } from "@/store/slices/uiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { useCallback, useEffect } from "react";
import { Appearance, StatusBar } from "react-native";

export type ResolvedColorScheme = "light" | "dark";

function resolveScheme(
  preference: ThemePreference,
  deviceScheme: "light" | "dark" | null | undefined
): ResolvedColorScheme {
  if (preference === "system") {
    return deviceScheme === "dark" ? "dark" : "light";
  }
  return preference;
}

export function ThemeSync({ children }: { children: React.ReactNode }) {
  const themePreference = useAppSelector((state) => state.ui.theme);
  const { setColorScheme } = useNativeWindColorScheme();
  const deviceScheme = Appearance.getColorScheme();
  const resolved = resolveScheme(themePreference, deviceScheme);

  const persistTheme = useCallback(async (theme: ThemePreference) => {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
  }, []);

  useEffect(() => {
    setColorScheme(resolved);
  }, [resolved, setColorScheme]);

  useEffect(() => {
    persistTheme(themePreference);
  }, [themePreference, persistTheme]);

  useEffect(() => {
    if (themePreference !== "system") return;
    const sub = Appearance.addChangeListener(() => {
      const next = resolveScheme(themePreference, Appearance.getColorScheme());
      setColorScheme(next);
    });
    return () => sub.remove();
  }, [themePreference, setColorScheme]);

  useEffect(() => {
    StatusBar.setBarStyle(
      resolved === "dark" ? "light-content" : "dark-content"
    );
  }, [resolved]);

  return <>{children}</>;
}
