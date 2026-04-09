import { MultiStepForm } from "@/components/MultiStepForm";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  AppStep,
  discoverRecipesAsync,
  resetRecipeState,
  scanImage,
  setAppStep,
} from "@/store/slices/recipeSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { ScreenWrapper } from "../../components/ScreenWrapper";

// Sub-components
import { usePrev } from "@/hooks/usePrev";
import { setStep } from "@/store/slices/multiStepFormSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { LoadingStep } from "./components/LoadingStep";
import { RecipeResults } from "./components/RecipeResults";
import { createFormSteps } from "./helpers/ai-scan-form.helpers";
import { ScanFormData, scanFormSchema } from "./types/ai-scan-form.types";

export default function AiScanFormScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const LOADING_MESSAGES_SCAN = useMemo(
    () => [
      t("aiScanForm.loadingImage"),
      t("aiScanForm.startingAI"),
      t("aiScanForm.identifyingIngredients"),
      t("aiScanForm.preparingResults"),
    ],
    [t],
  );

  const LOADING_MESSAGES_GENERATE_RECIPE = useMemo(
    () => [
      t("aiScanForm.chefThinking"),
      t("aiScanForm.generatingRecipes"),
      t("aiScanForm.matchingFlavors"),
      t("aiScanForm.preparingBestRecipes"),
    ],
    [t],
  );

  const form = useForm<ScanFormData>({
    resolver: yupResolver(scanFormSchema),
    defaultValues: {
      selectedIngredients: [],
      timePreference: 30,
      dietPreferences: [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { appStep, scannedIngredients, scanError, analyseError, scannedImage } =
    useSelector((state: any) => state.recipe);
  const dispatch = useAppDispatch();

  const [loadingText, setLoadingText] = useState(t("aiScanForm.analyzing"));

  // Determine loading messages based on current step

  const loadingMessages = useMemo(() => {
    if (appStep === AppStep.LoadingScan) {
      return LOADING_MESSAGES_SCAN;
    }
    return LOADING_MESSAGES_GENERATE_RECIPE;
  }, [appStep]);

  const prevScannedImage = usePrev(scannedImage);

  // Pre-select all ingredients when scan completes
  useEffect(() => {
    if (
      appStep === AppStep.IngredientsSelection &&
      scannedIngredients.length > 0
    ) {
      form.setValue("selectedIngredients", scannedIngredients);
    }
  }, [appStep, scannedIngredients]);

  // Handle scan image action
  const handleScanImage = useCallback(() => {
    form.setValue("selectedIngredients", []);
    dispatch(scanImage(scannedImage));
  }, [dispatch, scannedImage]);

  // Handle fetch recipes action
  const handleDiscoverRecipesAsync = useCallback(
    async (data: ScanFormData) => {
      dispatch(
        discoverRecipesAsync({
          ingredients: data.selectedIngredients as any,
          maxPrepTime: Number(data.timePreference || "30") ?? 30,
          dietaryPreferences: (data.dietPreferences ?? []).filter(
            (i): i is string => typeof i === "string" && i.length > 0,
          ) as string[],
        }),
      );
    },
    [dispatch],
  );

  // Handle restart
  const handleRestart = useCallback(() => {
    dispatch(resetRecipeState());
    router.replace("/screens/ai-scan");
  }, [dispatch]);

  // Create form steps with all necessary callbacks
  const steps = useMemo(
    () =>
      createFormSteps({
        dispatch,
        onScanImage: handleScanImage,
      }),
    [router, handleScanImage],
  );

  // Rotate loading messages
  useEffect(() => {
    if (appStep !== AppStep.LoadingScan && appStep !== AppStep.LoadingGenerate)
      return;

    const id = setInterval(() => {
      setLoadingText((prev) => {
        const idx = loadingMessages.indexOf(prev);
        return loadingMessages[(idx + 1) % loadingMessages.length];
      });
    }, 2000);

    return () => clearInterval(id);
  }, [appStep, loadingMessages]);

  // Handle scan error
  useEffect(() => {
    if (scanError) {
      Alert.alert(t("aiScanForm.scanError"), scanError, [
        {
          text: t("aiScanForm.ok"),
          onPress: () => {
            dispatch(setStep(0));
            dispatch(setAppStep(AppStep.StepScan));
          },
        },
      ]);
    }
  }, [scanError, dispatch, t]);

  // Handle recipe generation error
  useEffect(() => {
    if (analyseError) {
      Alert.alert(t("aiScanForm.recipeError"), analyseError, [
        {
          text: t("aiScanForm.ok"),
          onPress: () => {
            dispatch(setStep(2));
            dispatch(setAppStep(AppStep.DietPreference));
          },
        },
      ]);
    }
  }, [analyseError, dispatch, t]);

  useEffect(() => {
    return () => {
      dispatch(resetRecipeState());
    };
  }, []);

  // Loading state for scanning
  if (appStep === AppStep.LoadingScan) {
    return (
      <ScreenWrapper withTabNavigation={false} showTopNavBar={false}>
        <LoadingStep loadingText={loadingText} direction="forward" />
      </ScreenWrapper>
    );
  }

  // Loading state for recipe generation
  if (appStep === AppStep.LoadingGenerate) {
    return (
      <ScreenWrapper withTabNavigation={false} showTopNavBar={false}>
        <LoadingStep loadingText={loadingText} direction="forward" />
      </ScreenWrapper>
    );
  }

  // Results view
  if (appStep === AppStep.Results) {
    return (
      <ScreenWrapper withTabNavigation={false} showTopNavBar={false}>
        {/* Header for Step: Results */}
        <View className="px-5 py-2 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleRestart}
            className="flex-row items-center bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full"
          >
            <MaterialIcons
              name="refresh"
              size={18}
              color={colorScheme === "dark" ? "#fff" : "#181411"}
            />
            <Text className="text-xs font-bold ml-1 text-zinc-900 dark:text-white">
              {t("aiScanForm.scanAgain")}
            </Text>
          </TouchableOpacity>
          <View className="bg-orange-100 dark:bg-orange-500/10 px-3 py-1.5 rounded-full">
            <Text className="text-[#f39849] text-xs font-bold">
              {t("aiScanForm.aiBeta")}
            </Text>
          </View>
        </View>
        <View className="flex-1 mt-2">
          <RecipeResults direction="forward" />
        </View>
      </ScreenWrapper>
    );
  }

  // Form view (all steps except loading and results)
  return (
    <View style={{ flex: 1 }}>
      <FormProvider {...form}>
        <MultiStepForm
          steps={steps}
          onFinish={(data) => handleDiscoverRecipesAsync(data as ScanFormData)}
          headerTitle={t("aiScanForm.createRecipe")}
          backButtonBehavior="pop"
          validationSchema={scanFormSchema}
          initialData={{
            selectedIngredients: scannedIngredients || [],
            timePreference: 30,
            dietPreferences: [],
          }}
        />
      </FormProvider>
    </View>
  );
}
