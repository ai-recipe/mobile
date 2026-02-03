import { useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { Appearance } from "react-native";

/**
 * Resolved color scheme for web (with hydration guard for static rendering).
 * Priority: stored theme (AsyncStorage) > device theme.
 */
export function useColorScheme(): "light" | "dark" {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const themePreference = useAppSelector((state) => state.ui.theme);
  const deviceScheme = Appearance.getColorScheme();

  const resolved = useMemo(() => {
    if (themePreference === "system") {
      return deviceScheme === "dark" ? "dark" : "light";
    }
    return themePreference;
  }, [themePreference, deviceScheme]);

  if (!hasHydrated) {
    return "light";
  }

  return resolved;
}
