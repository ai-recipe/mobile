import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { useSubscription, type PlanId } from "@/hooks/useSubscription";

interface StepPaywallProps {
  onFinish: () => void;
  direction?: "forward" | "backward";
}

const FEATURE_KEYS = [
  "paywall.featureRecipes",
  "paywall.featureCalories",
  "paywall.featureNutrition",
  "paywall.featureFavorites",
  "paywall.featureTools",
  "paywall.featureAnalytics",
];

export function StepPaywall({
  onFinish,
  direction = "forward",
}: StepPaywallProps) {
  const { t } = useTranslation();
  const {
    PLANS,
    getPlanPrice,
    getPlanInfo,
    purchase,
    isPurchasing,
    error,
    restore,
  } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState<PlanId>(PLANS.YEARLY);
  const [skipVisible, setSkipVisible] = useState(false);

  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSkipVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, []),
  );

  const monthlyInfo = getPlanInfo(PLANS.MONTHLY);
  const yearlyInfo = getPlanInfo(PLANS.YEARLY);

  // Savings % compared to paying monthly for 12 months
  const savingsPercent =
    monthlyInfo.price > 0 && yearlyInfo.price > 0
      ? Math.round(
          ((monthlyInfo.price * 12 - yearlyInfo.price) /
            (monthlyInfo.price * 12)) *
            100,
        )
      : null;

  const PLAN_CONFIGS = [
    {
      id: PLANS.MONTHLY as PlanId,
      info: monthlyInfo,
      titleKey: "paywall.monthly",
      periodKey: "paywall.perMonth",
      descriptionKey: "paywall.monthlyDesc",
      featured: false,
    },
    {
      id: PLANS.YEARLY as PlanId,
      info: yearlyInfo,
      titleKey: "paywall.yearly",
      periodKey: "paywall.perYear",
      descriptionKey: "paywall.yearlyDesc",
      featured: true,
      badgeKey: "paywall.mostPopular",
    },
  ];

  const handleSubscribe = useCallback(async () => {
    await purchase(selectedPlan);
  }, [purchase, selectedPlan]);

  const selectedInfo = getPlanInfo(selectedPlan);
  const showTrialCta =
    selectedPlan === PLANS.YEARLY && selectedInfo.hasFreeTrial;

  return (
    <Animated.View entering={entering} exiting={exiting} className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          paddingTop: 10,
        }}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white text-center mb-2">
            {t("paywall.title")}{" "}
            <Text className="text-[#f39849]">
              {t("paywall.titleHighlight")}
            </Text>
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-400 text-base text-center">
            {t("paywall.subtitle")}
          </Text>
        </View>

        {/* Feature list */}
        <View className="gap-3 mb-10 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-[32px]">
          {FEATURE_KEYS.map((key, index) => (
            <View key={index} className="flex-row items-center gap-3">
              <View className="bg-[#f39849]/10 rounded-full p-1">
                <MaterialIcons name="check" size={16} color="#f39849" />
              </View>
              <Text className="text-zinc-700 dark:text-zinc-300 font-medium">
                {t(key)}
              </Text>
            </View>
          ))}
        </View>

        {/* Plan cards */}
        <View className="gap-4 mb-8">
          {PLAN_CONFIGS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isYearly = plan.id === PLANS.YEARLY;
            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.8}
                disabled={isPurchasing}
                className={`p-5 rounded-[24px] border-2 relative ${
                  isSelected
                    ? "bg-[#f39849]/5 border-[#f39849]"
                    : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700"
                }`}
              >
                {/* Most popular badge */}
                {plan.badgeKey && (
                  <View className="absolute -top-3 right-6 bg-[#f39849] px-3 py-1 rounded-full">
                    <Text className="text-white text-[10px] font-black">
                      {t(plan.badgeKey)}
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-between items-center">
                  <View className="flex-1 mr-3">
                    <Text className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                      {t(plan.titleKey)}
                    </Text>

                    {/* Trial badge */}
                    {isYearly && plan.info.hasFreeTrial && (
                      <View className="flex-row items-center mt-1 gap-1">
                        <View className="bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <Text className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                            {plan.info.trialDescription?.toUpperCase() ??
                              "FREE TRIAL"}
                          </Text>
                        </View>
                        {savingsPercent !== null && (
                          <View className="bg-[#f39849]/10 px-2 py-0.5 rounded-full">
                            <Text className="text-[#f39849] text-[10px] font-bold">
                              SAVE {savingsPercent}%
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    <Text className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
                      {t(plan.descriptionKey)}
                    </Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-xl font-black text-zinc-900 dark:text-white">
                      {plan.info.displayPrice}
                    </Text>
                    <Text className="text-zinc-400 text-[10px] uppercase font-bold">
                      {t(plan.periodKey)}
                    </Text>
                    {isYearly && monthlyInfo.price > 0 && (
                      <Text className="text-zinc-400 text-[10px] mt-0.5">
                        ≈{" "}
                        {plan.info.currency}{" "}
                        {(plan.info.price / 12).toFixed(2)}/mo
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Error */}
        {error ? (
          <Text className="text-center text-red-500 text-sm mb-4 px-4">
            {error}
          </Text>
        ) : null}

        <Text className="text-center text-[10px] text-zinc-400 px-6 leading-4 mb-10">
          {t("paywall.cancelAnytime")}
        </Text>

        {/* CTA */}
        <View className="px-5 pb-8 pt-2">
          <TouchableOpacity
            onPress={handleSubscribe}
            activeOpacity={0.9}
            disabled={isPurchasing}
            className="bg-[#f39849] w-full h-[64px] rounded-2xl items-center justify-center shadow-lg shadow-orange-500/30"
          >
            {isPurchasing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View className="items-center">
                <Text className="text-white font-extrabold text-lg">
                  {showTrialCta
                    ? t("paywall.startTrial")
                    : t("paywall.subscribe")}
                </Text>
                {showTrialCta && selectedInfo.trialDescription && (
                  <Text className="text-white/70 text-[11px] mt-0.5">
                    {selectedInfo.trialDescription} — then{" "}
                    {selectedInfo.displayPrice}/yr
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={restore}
            activeOpacity={0.7}
            disabled={isPurchasing}
            className="mt-3 items-center py-2"
          >
            <Text className="text-zinc-400 text-xs">
              {t("paywall.restorePurchases")}
            </Text>
          </TouchableOpacity>

          {skipVisible ? (
            <Animated.View entering={FadeIn.duration(400)}>
              <TouchableOpacity
                onPress={onFinish}
                activeOpacity={0.7}
                disabled={isPurchasing}
                className="mt-1 items-center py-2"
              >
                <Text className="text-zinc-400 text-sm">
                  {t("paywall.maybeLater")}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View className="mt-4 h-10" />
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
}
