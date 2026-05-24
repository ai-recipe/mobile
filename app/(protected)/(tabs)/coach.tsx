import { TabScreenWrapper } from "@/app/(protected)/components/TabScreenWrapper";
import { RecipeDetailModal } from "@/app/screens/components/RecipeDetailModal";
import { CommunityPill } from "@/components/coach/CommunityPill";
import { InsightCard } from "@/components/coach/InsightCard";
import { RecipeCard } from "@/components/coach/RecipeCard";
import { RecipeSkeleton } from "@/components/coach/RecipeSkeleton";
import { TrophyRoom } from "@/components/coach/TrophyRoom";
import { BRAND } from "@/components/coach/constants";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMyBadgesAsync } from "@/store/slices/badgesSlice";
import {
  fetchCoachRecipesAsync,
  fetchInsightAsync,
} from "@/store/slices/coachSlice";
import type { RecipeListItem } from "@/api/recipe";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  type ListRenderItemInfo,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CARD_SNAP = 228;

export default function CoachScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = Colors[colorScheme ?? "light"];

  const { t } = useTranslation();

  const {
    insight,
    isInsightLoading,
    isInsightLoaded,
    activeUserCount,
    personalizedRecipes,
    isRecipesLoading,
    isRecipesLoaded,
  } = useAppSelector((s) => s.coach);

  const { items: badges, status: badgesStatus } = useAppSelector(
    (s) => s.badges,
  );

  const [selectedRecipe, setSelectedRecipe] = useState<RecipeListItem | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchMyBadgesAsync());
      dispatch(fetchInsightAsync());
      dispatch(fetchCoachRecipesAsync());
    }, [dispatch]),
  );

  return (
    <TabScreenWrapper>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 110,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Trophy Room ──────────────────────────────────────────── */}
        <View className="mb-7 px-4">
          <TrophyRoom
            badges={badges}
            status={badgesStatus}
            isDark={isDark}
            theme={theme}
          />
        </View>

        {/* ── AI Insight ───────────────────────────────────────────── */}
        <View className="mb-7 px-4">
          <Text
            className="text-[17px] font-extrabold mb-[14px] tracking-tight"
            style={{ color: theme.text }}
          >
            {t("coach.todaysTip")}
          </Text>
          <InsightCard
            title={insight?.title}
            message={insight?.message}
            loading={isInsightLoading}
            theme={theme}
            isDark={isDark}
          />
        </View>

        {/* ── Community pill ───────────────────────────────────────── */}
        <View className="mb-7 px-4">
          <CommunityPill
            count={activeUserCount}
            theme={theme}
            isDark={isDark}
          />
        </View>

        {/* ── Personalised Recipes ─────────────────────────────────── */}
        <View className="mb-7 px-4">
          <View className="flex-row items-center justify-between mb-[14px]">
            <Text
              className="text-[17px] font-extrabold tracking-tight"
              style={{ color: theme.text }}
            >
              {t("coach.forYou")}
            </Text>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push("/screens/explore")}
              className="flex-row items-center gap-1"
            >
              <Text
                className="text-[13px] font-semibold"
                style={{ color: BRAND }}
              >
                {t("coach.exploreAllRecipes")}
              </Text>
              <MaterialIcons name="arrow-forward" size={14} color={BRAND} />
            </TouchableOpacity>
          </View>
          {isRecipesLoading && personalizedRecipes.length === 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {[...Array(3)].map((_, i) => (
                <RecipeSkeleton key={i} />
              ))}
            </ScrollView>
          ) : (
            <FlatList
              data={personalizedRecipes}
              horizontal
              keyExtractor={(r) => r._id}
              renderItem={({ item }: ListRenderItemInfo<RecipeListItem>) => (
                <RecipeCard
                  key={item._id}
                  item={item}
                  onPress={setSelectedRecipe}
                  theme={theme}
                  isDark={isDark}
                />
              )}
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_SNAP}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 16 }}
              ListEmptyComponent={
                <View
                  className="flex-row items-center gap-2.5 border rounded-2xl p-4 w-[260px]"
                  style={{
                    borderColor: "transparent",
                    backgroundColor: isDark ? "#18181b" : "#fff",
                  }}
                >
                  <MaterialIcons
                    name="restaurant-menu"
                    size={28}
                    color={theme.muted}
                  />
                  <Text
                    className="text-[13px] font-medium flex-1 leading-[18px]"
                    style={{ color: theme.muted }}
                  >
                    {t("coach.finishSurveyHint")}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </ScrollView>

      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe as any}
          visible={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </TabScreenWrapper>
  );
}
