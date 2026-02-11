/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#f39849";
const tintColorDark = "#f39849";

export const Colors = {
  light: {
    text: "#181411",
    background: "#f8f7f6",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#94A3B8",
    tabIconSelected: tintColorLight,
    border: "#e6e0db",
    card: "#ffffff",
    muted: "#8a7460",
    primary: "#f39849",
    success: "#22c55e", //green
    warning: "#e8823a",
    error: "#ef4444",
  },
  dark: {
    text: "#fafafa",
    background: "#09090b",
    tint: tintColorDark,
    icon: "#a1a1aa",
    tabIconDefault: "#71717a",
    tabIconSelected: tintColorDark,
    border: "#27272a",
    card: "#18181b",
    muted: "#a1a1aa",
    primary: "#f39849",
    success: "#22c55e", //green
    warning: "#e8823a",
    error: "#ef4444",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
