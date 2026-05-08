import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Skeleton } from "@/components/Skeleton";
import { Colors } from "@/constants/theme";
import type { BadgeListItem } from "@/api/badges";
import { BRAND, BRAND_GRADIENT, BRAND_LIGHT } from "./constants";
import { BadgeCard } from "./BadgeCard";
import { BadgeDetailPanel } from "./BadgeDetailPanel";

export function TrophyRoom({
  badges,
  status,
  isDark,
  theme,
}: {
  badges: BadgeListItem[];
  status: string;
  isDark: boolean;
  theme: typeof Colors.light;
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<BadgeListItem | null>(null);

  const unlocked = badges.filter((b) => b.unlocked).length;
  const total = badges.length;
  const pct = total > 0 ? unlocked / total : 0;

  const barWidth = useSharedValue(0);
  React.useEffect(() => {
    barWidth.value = withDelay(
      300,
      withTiming(pct, { duration: 700, easing: Easing.out(Easing.cubic) }),
    );
  }, [pct]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value * 100}%` as any,
  }));

  const handlePress = (badge: BadgeListItem) => {
    setSelected(badge);
  };

  if (status === "loading" && badges.length === 0) {
    return (
      <View className="rounded-[20px] p-4">
        <View className="flex-row items-center justify-between mb-2.5">
          <Skeleton width={120} height={15} borderRadius={6} />
          <Skeleton width={48} height={15} borderRadius={6} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}
        >
          {[...Array(5)].map((_, i) => (
            <View key={i} className="items-center gap-2">
              <Skeleton width={72} height={72} borderRadius={20} />
              <Skeleton width={56} height={9} borderRadius={4} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (badges.length === 0) {
    return (
      <View
        className="rounded-[20px] p-7 items-center border"
        style={{
          borderColor: theme.border,
          backgroundColor: isDark ? "#18181b" : "#fff",
        }}
      >
        <Text className="text-[40px] mb-2">🏆</Text>
        <Text
          className="text-[17px] font-extrabold mb-1.5 tracking-tight"
          style={{ color: theme.text }}
        >
          {t("coach.trophyRoom.title")}
        </Text>
        <Text
          className="text-[13px] text-center leading-[19px] font-medium"
          style={{ color: theme.muted }}
        >
          {t("coach.trophyRoom.emptyHint")}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View className="flex-row items-center justify-between mb-2.5">
        <Text
          className="text-[17px] font-extrabold tracking-tight"
          style={{ color: theme.text }}
        >
          {t("coach.trophyRoom.title")}
        </Text>
        <View
          className="px-2.5 py-1 rounded-full"
          style={{ backgroundColor: BRAND_LIGHT }}
        >
          <Text className="text-[12px] font-extrabold" style={{ color: BRAND }}>
            {unlocked} / {total}
          </Text>
        </View>
      </View>

      <View
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: isDark ? "#27272a" : "#f4f4f5" }}
      >
        <Reanimated.View
          className="h-full rounded-full overflow-hidden"
          style={barStyle}
        >
          <LinearGradient
            colors={BRAND_GRADIENT}
            className="absolute inset-0"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Reanimated.View>
      </View>
      <Text
        className="text-[11px] font-semibold mt-1.5"
        style={{ color: theme.muted }}
      >
        {unlocked === total && total > 0
          ? t("coach.trophyRoom.collectionComplete")
          : t("coach.trophyRoom.badgesLeft", { count: total - unlocked })}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={88}
        contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 2 }}
        style={{ marginTop: 14 }}
      >
        {badges.map((item, index) => (
          <BadgeCard
            key={item._id ? `${item._id}-${index}` : String(index)}
            item={item}
            index={index}
            onPress={handlePress}
            isDark={isDark}
          />
        ))}
      </ScrollView>

      <BadgeDetailPanel
        badge={selected}
        onClose={() => setSelected(null)}
        isDark={isDark}
        theme={theme}
      />
    </View>
  );
}
