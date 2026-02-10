import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentLanguage } from "@/store/slices/appSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingLanguageSelector } from "./components/onboarding-language-selector";
import { OnboardingProgressBar } from "./components/onboarding-progress-bar";
import { OnboardingStepFinish } from "./components/onboarding-step-finish";
import { OnboardingStepWelcome } from "./components/onboarding-step-welcome";

const STEPS = [
  {
    id: 1,
    title: "Yapay Zeka ile Tara",
    description:
      "Dolabındakilerin fotoğrafını çek, gelişmiş yapay zekamız malzemeleri anında tanısın ve size en uygun seçenekleri sunsun.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfIOgyd-AArVUDn1vb4CK8i67wcKT_M3vbkOOK8sLATy9sWjjGWTkVsKUniY-YMzQ5EsUUlioSsVy-A0JpUhqZeDnS-kr6MsPQePrWnEMQaXgpGxQg58LSGOfiWXblMOYUwtYVyaG10MQjHhJLQ4xVfaVh8OP9UPXUo8X6OVBLDa7lbl80-3kOMowAFVzdXK3B-ePh2lHjjPa8YQzOY45LNBsDal19fkfDFvMWo7X_KBWWPJWA49zi7IKR-2vs0iRk7NW7TIcFHs4r",
  },

  {
    id: 2,
    title: "AI Şefiniz Hazır",
    description:
      "Algoritmalarımız milyonlarca tarif arasından dolabındaki malzemelere en uygun olanı senin için hazırladı.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXBmjOmiiS239943G5GLit-7rAuZrgKXGh9Bc8NmzdnEat5Tca7seP4lbVgd_YpABEBnj5MB8o-2df00VKO7Ly9lVm0OK3W2Uv6-29sO32LJyRVXt4hXcxBkdCcVnG9m21yAOcW38J27m3HAPW6w_9t2LcT00CzhDkXSqSgrcJh3ZRqxdV8MdyYSTmlgYpnWVtEMU5M-4h4S7_uOgymVtNpm0gsPEFvSsbkE_N7ueLIC5e9jLOp0X3O3jyL5MUPcVJFtbfW_RjJ4bX-p",
  },
];

export default function OnboardingScreen() {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.app.currentLanguage);

  const scanPos = useSharedValue(0);

  useEffect(() => {
    if (currentStep === 0) {
      scanPos.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
    }
  }, [currentStep, scanPos]);

  const animatedScanStyle = useAnimatedStyle(() => ({
    top: `${20 + scanPos.value * 60}%`,
  }));

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem("CURRENT_LANGUAGE", lng);
    dispatch(setCurrentLanguage(lng));
  };
  console.log("XXdX");
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-darker">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <View className="w-12" />
        <Text className="text-xl font-black text-text dark:text-white">
          {currentStep === 0
            ? ""
            : currentStep === 1
            ? "Tercihlerini Belirle"
            : ""}
        </Text>
        <View className="w-12" />
      </View>

      <OnboardingLanguageSelector
        currentLanguage={currentLanguage}
        onChangeLanguage={changeLanguage}
      />

      <OnboardingProgressBar
        currentStep={currentStep}
        totalSteps={STEPS.length}
      />

      {currentStep === 0 && (
        <OnboardingStepWelcome
          onNext={nextStep}
          animatedScanStyle={animatedScanStyle}
          image={STEPS[0].image!}
          description={STEPS[0].description}
          welcomeText={t("welcome")}
        />
      )}

      {currentStep === 1 && (
        <OnboardingStepFinish
          image={STEPS[1].image!}
          title={STEPS[1].title}
          description={STEPS[1].description}
        />
      )}
    </SafeAreaView>
  );
}
