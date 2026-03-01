import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";

interface StepPaywallProps {
  onFinish: () => void;
  direction?: "forward" | "backward";
}

const OFFER_CONFIGS = [
  {
    id: "monthly",
    price: "$4.99",
    titleKey: "paywall.monthly",
    periodKey: "paywall.perMonth",
    descriptionKey: "paywall.monthlyDesc",
    featured: false,
  },
  {
    id: "yearly",
    price: "$20",
    titleKey: "paywall.yearly",
    periodKey: "paywall.perYear",
    descriptionKey: "paywall.yearlyDesc",
    featured: true,
    badgeKey: "paywall.mostPopular",
  },
  {
    id: "lifetime",
    price: "$49.99",
    titleKey: "paywall.lifetime",
    periodKey: "paywall.oneTime",
    descriptionKey: "paywall.lifetimeDesc",
    featured: false,
  },
];

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
  const [selectedOffer, setSelectedOffer] = useState("yearly");
  const [skipVisible, setSkipVisible] = useState(false);
  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;

  const scrollRef = useRef<ScrollView>(null);

  // Delay the skip button to let the user read the paywall
  useEffect(() => {
    const t = setTimeout(() => setSkipVisible(true), 3500);
    return () => clearTimeout(t);
  }, []);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, []),
  );
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
        {/* Header Section */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white text-center mb-2">
            {t("paywall.title")} <Text className="text-[#f39849]">{t("paywall.titleHighlight")}</Text>
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-400 text-base text-center">
            {t("paywall.subtitle")}
          </Text>
        </View>

        {/* Feature List */}
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

        {/* Offers */}
        <View className="gap-4 mb-8">
          {OFFER_CONFIGS.map((offer) => {
            const isSelected = selectedOffer === offer.id;
            return (
              <TouchableOpacity
                key={offer.id}
                onPress={() => setSelectedOffer(offer.id)}
                activeOpacity={0.8}
                className={`p-5 rounded-[24px] border-2 relative ${
                  isSelected
                    ? "bg-[#f39849]/5 border-[#f39849]"
                    : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700"
                }`}
              >
                {offer.badgeKey && (
                  <View className="absolute -top-3 right-6 bg-[#f39849] px-3 py-1 rounded-full">
                    <Text className="text-white text-[10px] font-black">
                      {t(offer.badgeKey)}
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                      {t(offer.titleKey)}
                    </Text>
                    <Text className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
                      {t(offer.descriptionKey)}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xl font-black text-zinc-900 dark:text-white">
                      {offer.price}
                    </Text>
                    <Text className="text-zinc-400 text-[10px] uppercase font-bold">
                      {t(offer.periodKey)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text className="text-center text-[10px] text-zinc-400 px-6 leading-4 mb-10">
          {t("paywall.cancelAnytime")}
        </Text>
        <View className="px-5 pb-8 pt-2">
          <TouchableOpacity
            onPress={onFinish}
            activeOpacity={0.9}
            className="bg-[#f39849] w-full h-[64px] rounded-2xl items-center justify-center shadow-lg shadow-orange-500/30"
          >
            <Text className="text-white font-extrabold text-lg">
              {selectedOffer === "yearly"
                ? t("paywall.startTrial")
                : t("paywall.subscribe")}
            </Text>
          </TouchableOpacity>
          {skipVisible ? (
            <Animated.View entering={FadeIn.duration(400)}>
              <TouchableOpacity
                onPress={onFinish}
                activeOpacity={0.7}
                className="mt-4 items-center py-2"
              >
                <Text className="text-zinc-400 text-sm">{t("paywall.maybeLater")}</Text>
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
