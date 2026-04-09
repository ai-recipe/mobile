import { useAppSelector } from "@/store/hooks";
import { setIsOnboarded } from "@/store/slices/authSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
interface OnboardingStepFinishProps {
  image: string;
  title: string;
  description: string;
}

export const OnboardingStepFinish = ({
  image,
  title,
  description,
}: OnboardingStepFinishProps) => {
  const { t } = useTranslation();
  const { isInitDeviceLoading } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const token = useSelector((state: any) => state.auth.token);
  const preferences = useAppSelector((state) => state.auth.preferences);

  const onSubmit = () => {
    if (isInitDeviceLoading) {
      setIsSubmitClicked(true);
      return;
    }

    router.replace("/screens/survey");
    dispatch(setIsOnboarded(true));
  };
  return (
    <View className="flex-1">
      <ScrollView className="flex-1 px-6">
        <View className="py-12 items-center">
          <View
            style={{ transform: [{ rotate: "3deg" }] }}
            className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <Image
              source={{ uri: image }}
              className="w-full aspect-[4/3]"
              contentFit="cover"
            />
            <View className="absolute top-4 right-4 bg-white/95 px-4 py-1.5 rounded-full shadow-md">
              <Text className="text-text font-black text-[10px]">
                {t("onboarding.demoLevel")}
              </Text>
            </View>
            <View className="p-8">
              <Text className="text-primary text-xs font-black tracking-widest uppercase mb-2">
                {t("onboarding.demoTag")}
              </Text>
              <Text className="text-2xl font-black text-text dark:text-white mb-3">
                {t("onboarding.demoRecipe")}
              </Text>
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#f39849"
                />
                <Text className="text-secondary text-sm font-bold ml-1.5">
                  {t("onboarding.demoPrepTime")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="items-center py-6">
          <Text className="text-4xl font-black text-text dark:text-white text-center mb-4">
            {title}
          </Text>
          <Text className="text-lg text-secondary dark:text-gray-300 text-center leading-relaxed font-medium">
            {description}
          </Text>
        </View>
      </ScrollView>

      <View className="p-10 pb-12">
        <Pressable
          onPress={onSubmit}
          disabled={isSubmitClicked && isInitDeviceLoading && !token}
          className={`w-full bg-primary py-5 rounded-full shadow-xl shadow-primary/30 flex-row items-center justify-center gap-2 active:opacity-95
            ${isSubmitClicked && isInitDeviceLoading ? "opacity-50" : ""}
            `}
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
