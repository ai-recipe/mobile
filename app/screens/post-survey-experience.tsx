import { MultiStepForm, MultiStepFormStep } from "@/components/MultiStepForm";
import { setIsOnboarded } from "@/store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { CalculatingPlanStep } from "./components/CalculatingPlanStep";
import { StepPaywall } from "./components/StepPaywall";
import { StepRateUs } from "./components/StepRateUs";

export default function PostSurveyExperienceScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useForm({
    mode: "onChange",
  });

  const handleFinish = async () => {
    await AsyncStorage.setItem("isOnboarded", "true");
    dispatch(setIsOnboarded(true));
    router.replace("/(protected)/(tabs)/");
  };

  const steps: MultiStepFormStep[] = useMemo(
    () => [
      {
        id: "calculating",
        fields: [],
        shouldHandleNextStep: true,
        dontShowBackButton: true,
        render: ({ nextStep }) => <CalculatingPlanStep onNext={nextStep} />,
      },
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
        render: () => <StepPaywall onFinish={handleFinish} />,
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
