import { MultiStepForm, MultiStepFormStep } from "@/components/MultiStepForm";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { StepPaywall } from "./components/StepPaywall";
import { StepRateUs } from "./components/StepRateUs";

export default function PostSurveyExperienceScreen() {
  const router = useRouter();

  const form = useForm({
    mode: "onChange",
  });

  const handleFinish = () => {
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
