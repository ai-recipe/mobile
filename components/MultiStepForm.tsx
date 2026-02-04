import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearMultistepFormState,
  markStepAsSubmitted,
  nextStep as nextStepAction,
  prevStep as prevStepAction,
  setTotalSteps,
} from "@/store/slices/multiStepFormSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import { Control, FieldErrors, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";

export type MultiStepFormStep = {
  id: string;
  title?: string;
  subtitle?: string;
  fields: string[]; // Fields that belong to this step
  render: (ctx: {
    data: any;
    setValue: (key: string, value: any) => void;
    nextStep: () => void;
    control: Control<any>;
    errors: FieldErrors<any>;
  }) => React.ReactNode;
};

type MultiStepFormProps = {
  steps: MultiStepFormStep[];
  initialData?: Record<string, any>;
  onFinish: (data: Record<string, any>) => void;
  headerTitle?: string;
  backButtonBehavior?: "pop" | "prevStep";
  validationSchema: yup.AnyObjectSchema;
};

export function MultiStepForm({
  steps,
  initialData = {},
  onFinish,
  headerTitle = "Survey",
  backButtonBehavior = "pop",
  validationSchema,
}: MultiStepFormProps) {
  const dispatch = useAppDispatch();
  const stepIndex = useAppSelector((state) => state.multiStepForm.currentStep);
  const submittedSteps = useAppSelector(
    (state) => state.multiStepForm.submittedSteps,
  );

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  // Initialize total steps and cleanup on unmount
  useEffect(() => {
    dispatch(setTotalSteps(steps.length));

    return () => {
      dispatch(clearMultistepFormState());
    };
  }, [dispatch, steps.length]);

  const {
    control,
    handleSubmit,
    setValue: baseSetValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialData,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const setValueWrapper = useCallback(
    (key: string, value: unknown) => {
      baseSetValue(key as any, value as any, { shouldValidate: true });
    },
    [baseSetValue],
  );

  const data = watch();

  const currentStep = steps[stepIndex];
  console.log(currentStep, stepIndex);
  const isFirst = useMemo(() => stepIndex === 0, [stepIndex]);
  const isLast = useMemo(
    () => stepIndex === steps.length - 1,
    [stepIndex, steps.length],
  );
  const progress = useMemo(
    () => ((stepIndex + 1) / steps.length) * 100,
    [stepIndex, steps.length],
  );

  const nextStep = async () => {
    // Validate current step fields
    const fieldsToValidate = currentStep.fields;
    dispatch(markStepAsSubmitted(currentStep.id));
    const isValid = await trigger(fieldsToValidate as any);

    if (isValid) {
      if (isLast) {
        handleSubmit(onFinish)();
      } else {
        dispatch(nextStepAction());
      }
    }
  };

  const handleBack = useCallback(() => {
    if (isFirst) {
      if (backButtonBehavior === "pop") router.back();
      return;
    }
    dispatch(prevStepAction());
  }, [isFirst, backButtonBehavior, dispatch]);

  if (!currentStep) return null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header – padded for status bar / safe area */}
        <View
          className="flex-row items-center justify-between px-4 py-3 border-b"
          style={{
            paddingTop: insets.top,
            borderBottomColor: theme.border,
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
            className="size-12 items-center justify-center"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <MaterialIcons name="arrow-back-ios" size={20} color={theme.text} />
          </TouchableOpacity>
          <Text
            className="flex-1 text-center text-lg font-bold pr-12"
            style={{ color: theme.text }}
          >
            {headerTitle}
          </Text>
          <View className="w-12" />
        </View>

        {/* Progress */}
        <View className="flex-col gap-3 p-4">
          <View className="flex-row justify-between items-end">
            <Text
              className="text-base font-medium"
              style={{ color: isDark ? "rgba(255,255,255,0.8)" : theme.muted }}
            >
              Step {stepIndex + 1}
            </Text>
            <Text
              className="text-sm"
              style={{ color: isDark ? "rgba(255,255,255,0.6)" : theme.muted }}
            >
              {stepIndex + 1} of {steps.length}
            </Text>
          </View>
          <View
            className="h-2 rounded-full overflow-hidden"
            style={{
              backgroundColor: isDark ? "rgba(255,255,255,0.1)" : theme.border,
            }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: theme.tint,
              }}
            />
          </View>
        </View>

        {/* Step content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text
            className="text-[32px] font-bold leading-tight pt-2 pb-1"
            style={{ color: theme.text }}
          >
            {currentStep.title}
          </Text>
          {currentStep.subtitle && (
            <Text
              className="text-base pt-1 pb-4"
              style={{ color: isDark ? "rgba(255,255,255,0.7)" : theme.muted }}
            >
              {currentStep.subtitle}
            </Text>
          )}
          {currentStep.render({
            data,
            setValue: setValueWrapper,
            nextStep,
            control,
            errors: !!submittedSteps[currentStep.id] ? errors : {},
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
