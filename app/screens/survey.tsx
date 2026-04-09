import { MultiStepForm } from "@/components/MultiStepForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { submitSurveyAsync } from "@/store/slices/authSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { createSurveySteps } from "./helpers/survey.helpers";
import { useTranslation } from "react-i18next";

// Animated Loading Indicator Component
function AnimatedLoadingIndicator() {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
    );

    pulse.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [0.8, 1.1]);
    const opacity = interpolate(pulse.value, [0, 1], [0.3, 0]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View className="items-center justify-center">
      <Animated.View
        style={[pulseStyle]}
        className="absolute size-40 rounded-full border-2 border-orange-400"
      />
      <Animated.View
        style={[
          rotateStyle,
          {
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: "#f39849",
            borderTopColor: "#ffffff",
            borderRightColor: "#ffffff",
            borderBottomColor: "transparent",
          },
        ]}
      />
      <View className="absolute size-28 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-500/30 dark:to-orange-500/10 rounded-full items-center justify-center shadow-lg shadow-orange-500/30">
        <MaterialCommunityIcons name="check-circle" size={56} color="#f39849" />
      </View>
    </View>
  );
}

// Animated Dots Component
function AnimatedDots() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    dot2.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    dot3.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const createDotStyle = (animValue: any) =>
    useAnimatedStyle(() => ({
      transform: [
        { translateY: interpolate(animValue.value, [0, 1], [0, -16]) },
      ],
    }));

  return (
    <View className="flex-row gap-3 items-center justify-center h-12">
      <Animated.View
        style={createDotStyle(dot1)}
        className="w-3 h-3 bg-orange-400 rounded-full"
      />
      <Animated.View
        style={createDotStyle(dot2)}
        className="w-3 h-3 bg-orange-400 rounded-full"
      />
      <Animated.View
        style={createDotStyle(dot3)}
        className="w-3 h-3 bg-orange-400 rounded-full"
      />
    </View>
  );
}

export default function SurveyScreen() {
  const { t, i18n } = useTranslation();

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

  const handleFinish = async (data: any = {}) => {
    const responses = Object.entries(data).map(([key, value]) => ({
      questionKey: key,
      answers: value as string[],
    }));

    if (responses.length > 0) {
      const result = await dispatch(submitSurveyAsync(responses));
      if (submitSurveyAsync.fulfilled.match(result)) {
        router.replace("/screens/post-survey-experience");
      }
    }
  };

  const steps = useMemo(
    () => createSurveySteps({ questions: surveyQuestions, t }),
    [surveyQuestions, t],
  );

  if (isSurveyQuestionsLoading && !isInitialized) {
    return (
      <ScreenWrapper withTabNavigation={false} showTopNavBar={false}>
        <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-900">
          <View className="items-center justify-center mb-8">
            <View className="size-24 bg-orange-100 dark:bg-orange-500/20 rounded-full items-center justify-center mb-4">
              <ActivityIndicator size="large" color="#f39849" />
            </View>
            <Text className="text-xl font-bold text-zinc-900 dark:text-white text-center">
              {t("survey.loadingQuestions")}
            </Text>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 text-center px-6">
              {t("common.loading")}
            </Text>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  if (isSurveySubmitting) {
    return (
      <ScreenWrapper withTabNavigation={false} showTopNavBar={false}>
        <Animated.View
          entering={FadeIn.duration(400)}
          className="flex-1 items-center justify-center bg-white dark:bg-zinc-900 px-6"
        >
          <LinearGradient
            colors={["#fff7ed", "#ffedd5"]}
            end={{ x: 1, y: 1 }}
            className="dark:hidden absolute inset-0 opacity-30"
          />

          {/* Animated Loading Indicator */}
          <View className="mb-16">
            <AnimatedLoadingIndicator />
          </View>

          {/* Staggered Text Animation */}
          <Animated.Text
            entering={FadeIn.delay(200).duration(500)}
            className="text-2xl font-bold text-zinc-900 dark:text-white text-center mb-3"
          >
            {t("survey.savingPreferences")}
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.delay(300).duration(500)}
            className="text-base text-zinc-500 dark:text-zinc-400 text-center mb-12"
          >
            Customizing your preferences...
          </Animated.Text>

          {/* Animated Dots Loader */}
          <AnimatedDots />
        </Animated.View>
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
            headerTitle={t("survey.headerTitle")}
            backButtonBehavior="pop"
            initialData={defaultValues}
          />
        )}
      </FormProvider>
    </View>
  );
}
