import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/theme";
import { LiveDot } from "./LiveDot";

export function CommunityPill({
  count,
  theme,
  isDark,
}: {
  count: number;
  theme: typeof Colors.light;
  isDark: boolean;
}) {
  const { t } = useTranslation();
  return (
    <View
      className="flex-row items-center justify-center rounded-full border py-3 px-5"
      style={{
        backgroundColor: isDark ? "#18181b" : "#ffffff",
        borderColor: theme.border,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <LiveDot />
      <Text className="text-[13px] font-semibold" style={{ color: theme.text }}>
        🔥{"  "}
        <Text className="font-extrabold">
          {count > 0
            ? t("coach.communityPill.active", { count: count.toLocaleString() })
            : t("coach.communityPill.beFirst")}
        </Text>
      </Text>
    </View>
  );
}
