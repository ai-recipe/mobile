import { setIsOnboarded } from "@/store/slices/authSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export const OnboardingStepFinish = () => {
  const { t } = useTranslation();
  const { isInitDeviceLoading } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const token = useSelector((state: any) => state.auth.token);

  const onSubmit = () => {
    if (isInitDeviceLoading) {
      setIsSubmitClicked(true);
      return;
    }
    router.replace("/(public)/screens/login");
    dispatch(setIsOnboarded(true));
    AsyncStorage.setItem("isOnboarded", "true");
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Goal achievement illustration */}
        <View className="mt-4 mb-6 bg-primary/8 rounded-3xl p-5 border border-primary/15 gap-3">
          {/* Trophy header */}
          <View className="items-center py-4">
            <View className="w-20 h-20 bg-primary/15 rounded-full items-center justify-center mb-3">
              <MaterialCommunityIcons
                name="trophy-outline"
                size={40}
                color="#f39849"
              />
            </View>
            <Text className="text-xs font-black tracking-widest text-primary uppercase">
              {t("onboarding.finishBadge")}
            </Text>
          </View>

          {/* Achievement stat cards */}
          <View className="flex-row gap-2">
            {[
              {
                icon: "fire" as const,
                value: "14",
                sub: t("onboarding.statStreak"),
                color: "#f39849",
              },
              {
                icon: "scale-bathroom" as const,
                value: "−5kg",
                sub: t("onboarding.statWeight"),
                color: "#22c55e",
              },
              {
                icon: "lightning-bolt" as const,
                value: "3",
                sub: t("onboarding.statScans"),
                color: "#a78bfa",
              },
            ].map((s) => (
              <View
                key={s.sub}
                className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-3 items-center gap-1"
              >
                <MaterialCommunityIcons
                  name={s.icon}
                  size={20}
                  color={s.color}
                />
                <Text className="text-sm font-black text-text dark:text-white">
                  {s.value}
                </Text>
                <Text className="text-[9px] text-secondary text-center font-medium leading-tight">
                  {s.sub}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Copy */}
        <View className="items-center px-2">
          <Text className="text-4xl font-black text-center text-text dark:text-white leading-tight mb-3">
            {t("onboarding.finishHeadlinePrefix")}{" "}
            <Text className="text-primary">
              {t("onboarding.finishHeadlineHighlight")}
            </Text>
          </Text>
          <Text className="text-base text-center text-secondary dark:text-gray-300 leading-relaxed font-medium">
            {t("onboarding.finishDescription")}
          </Text>
        </View>
      </ScrollView>

      <View className="px-6 pb-12 pt-4">
        <Pressable
          onPress={onSubmit}
          disabled={isSubmitClicked && isInitDeviceLoading && !token}
          className={`w-full bg-primary py-5 rounded-full shadow-xl shadow-primary/30 flex-row items-center justify-center gap-2 active:opacity-95
            ${isSubmitClicked && isInitDeviceLoading ? "opacity-50" : ""}`}
        >
          <Text className="text-white text-lg font-bold">
            {isSubmitClicked && isInitDeviceLoading && !token
              ? t("common.loading")
              : t("onboarding.getStarted")}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );
};
