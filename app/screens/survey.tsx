import { MultiStepForm } from "@/components/MultiStepForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { submitSurveyAsync } from "@/store/slices/authSlice";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { createSurveySteps } from "./helpers/survey.helpers";

export default function SurveyScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { surveyQuestions, isSurveyQuestionsLoading, isSurveySubmitting } =
    useAppSelector((state) => state.auth);

  const [isInitialized, setIsInitialized] = useState(false);

  const defaultValues = useMemo(() => {
    const values: any = {};
    surveyQuestions?.forEach((q) => {
      values[q.key] = [];
    });
    return values;
  }, [surveyQuestions]);

  const form = useForm({
    defaultValues,
    mode: "onChange",
  });

  // Reset form when questions are loaded
  useEffect(() => {
    if (surveyQuestions?.length > 0 && !isInitialized) {
      form.reset(defaultValues);
      setIsInitialized(true);
    }
  }, [surveyQuestions, defaultValues, form, isInitialized]);

  const steps = useMemo(
    () => createSurveySteps({ questions: surveyQuestions }),
    [surveyQuestions],
  );

  const handleFinish = async (data: any) => {
    const responses = Object.entries(data).map(([key, value]) => ({
      questionKey: key,
      answers: value as string[],
    }));

    const result = await dispatch(submitSurveyAsync(responses));
    if (submitSurveyAsync.fulfilled.match(result)) {
      router.replace("/(protected)/(tabs)/");
    }
  };

  if (isSurveyQuestionsLoading && !isInitialized) {
    return (
      <ScreenWrapper withTabNavigation={false} showTopNavBar={false}>
        <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-900">
          <ActivityIndicator size="large" color="#f39849" />
          <Text className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium">
            Sorular yükleniyor...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (isSurveySubmitting) {
    return (
      <ScreenWrapper withTabNavigation={false} showTopNavBar={false}>
        <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-900">
          <ActivityIndicator size="large" color="#f39849" />
          <Text className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium">
            Tercihleriniz kaydediliyor...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FormProvider {...form}>
        {steps.length > 0 && (
          <MultiStepForm
            steps={steps}
            onFinish={handleFinish}
            headerTitle="Seni Tanıyalım"
            backButtonBehavior="pop"
            initialData={defaultValues}
          />
        )}
      </FormProvider>
    </View>
  );
}
