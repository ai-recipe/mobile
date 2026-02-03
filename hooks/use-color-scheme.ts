import { useAppSelector } from "@/store/hooks";
import { useMemo } from "react";
import { Appearance } from "react-native";

/**
 * Returns the resolved color scheme for the app.
 * Priority: stored theme (AsyncStorage) > device theme.
 * When stored theme is "system", follows device; otherwise returns stored "light" or "dark".
 */
export function useColorScheme(): "light" | "dark" {
  const themePreference = useAppSelector((state) => state.ui.theme);
  const deviceScheme = Appearance.getColorScheme();

  return useMemo(() => {
    if (themePreference === "system") {
      return deviceScheme === "dark" ? "dark" : "light";
    }
    return themePreference;
  }, [themePreference, deviceScheme]);
}
