import { MultiStepForm, MultiStepFormStep } from "@/components/MultiStepForm";
import { setIsOnboarded } from "@/store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { useAppDispatch } from "@/store/hooks";
import { StepPaywall } from "./components/StepPaywall";
import { StepRateUs } from "./components/StepRateUs";
import { Analytics } from "@/analytics";

export default function PostSurveyExperienceScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const form = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    Analytics.postSurveyStarted();
    Analytics.ratePromptShown("post_survey");
  }, []);

  const handleFinish = async () => {
    await AsyncStorage.setItem("isOnboarded", "true");
    dispatch(setIsOnboarded(true));
    router.replace("/(protected)/(tabs)/");
  };

  const steps: MultiStepFormStep[] = useMemo(
    () => [
      {
        id: "rate_us",
        fields: [],
        shouldHandleNextStep: true,
        dontShowBackButton: true,
        render: ({ nextStep }) => <StepRateUs onNext={nextStep} />,
      },
      {
        id: "paywall",
        fields: [],
        shouldHandleNextStep: true,
        dontShowBackButton: true,
        render: () => <StepPaywall onFinish={handleFinish} placement="post_survey" />,
      },
    ],
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      <FormProvider {...form}>
        <MultiStepForm
          steps={steps}
          onFinish={handleFinish}
          backButtonBehavior="pop"
        />
      </FormProvider>
    </View>
  );
}
