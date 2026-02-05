import { MultiStepForm } from "@/components/MultiStepForm";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch } from "@/store/hooks";
import {
  addCustomIngredient,
  AppStep,
  discoverRecipesAsync,
  resetRecipeState,
  scanImage,
  setAppStep,
  toggleIngredient,
} from "@/store/slices/recipeSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { ScreenWrapper } from "../../components/ScreenWrapper";

// Sub-components
import { nextStep, setStep } from "@/store/slices/multiStepFormSlice";
import { LoadingStep } from "./components/LoadingStep";
import { RecipeResults } from "./components/RecipeResults";
import { createFormSteps } from "./helpers/ai-scan-form.helpers";
import { ScanFormData, scanFormSchema } from "./types/ai-scan-form.types";

const LOADING_MESSAGES_SCAN = [
  "Görüntü Yükleniyor...",
  "Yapay Zeka İşleme Başlatıyor...",
  "Malzemeler Tanımlanıyor...",
  "Sonuçlar Hazırlanıyor...",
];

const LOADING_MESSAGES_GENERATE_RECIPE = [
  "Şef Yapay Zeka Düşünüyor...",
  "Tarifler Oluşturuluyor...",
  "Lezzetler Eşleştiriliyor...",
  "En İyi Tarifler Hazırlanıyor...",
];

export default function AiScanFormScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const { appStep, formData, recipes, scanError, analyseError, scannedImage } =
    useSelector((state: any) => state.recipe);
  const dispatch = useAppDispatch();

  const [loadingText, setLoadingText] = useState("Görüntü Analiz Ediliyor...");

  // Determine loading messages based on current step

  const loadingMessages = useMemo(() => {
    if (appStep === AppStep.LoadingScan) {
      return LOADING_MESSAGES_SCAN;
    }
    return LOADING_MESSAGES_GENERATE_RECIPE;
  }, [appStep]);

  // Handle scan image action
  const handleScanImage = useCallback(() => {
    if (scannedImage === formData.image) {
      dispatch(nextStep());
      return;
    }
    dispatch(scanImage(formData.image));
  }, [dispatch, formData.image, scannedImage]);

  // Handle fetch recipes action
  const handleDiscoverRecipesAsync = useCallback(
    async (data: ScanFormData) => {
      console.log("data", data);
      dispatch(
        discoverRecipesAsync({
          ingredientIds: (data.selectedIngredients ?? []).filter(
            (i): i is string => typeof i === "string" && i.length > 0,
          ) as string[],
          maxPrepTime: data.timePreference ?? 30,
          dietaryPreferences: (data.dietPreferences ?? []).filter(
            (i): i is string => typeof i === "string" && i.length > 0,
          ) as string[],
        }),
      );
    },
    [dispatch],
  );

  // Handle ingredient toggle
  const handleToggleIngredient = useCallback(
    (ingredient: string) => {
      dispatch(toggleIngredient(ingredient));
    },
    [dispatch],
  );

  // Handle add custom ingredient
  const handleAddIngredient = useCallback(
    (ingredient: string) => {
      dispatch(addCustomIngredient(ingredient));
    },
    [dispatch],
  );

  // Handle restart
  const handleRestart = useCallback(() => {
    dispatch(resetRecipeState());
  }, [dispatch]);

  // Create form steps with all necessary callbacks
  const steps = useMemo(
    () =>
      createFormSteps({
        formData,
        router,
        onScanImage: handleScanImage,
        onToggleIngredient: handleToggleIngredient,
        onAddIngredient: handleAddIngredient,
      }),
    [
      formData,
      router,
      handleScanImage,
      handleToggleIngredient,
      handleAddIngredient,
    ],
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
      Alert.alert("Tarama Hatası", scanError, [
        {
          text: "Tamam",
          onPress: () => {
            dispatch(setStep(0));
            dispatch(setAppStep(AppStep.StepScan));
          },
        },
      ]);
    }
  }, [scanError, dispatch]);

  // Handle recipe generation error
  useEffect(() => {
    if (analyseError) {
      Alert.alert("Tarif Oluşturma Hatası", analyseError, [
        {
          text: "Tamam",
          onPress: () => {
            dispatch(setStep(2));
            dispatch(setAppStep(AppStep.DietPreference));
          },
        },
      ]);
    }
  }, [analyseError, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetRecipeState());
    };
  }, []);

  // Loading state for scanning
  if (appStep === AppStep.LoadingScan) {
    return (
      <ScreenWrapper withTabNavigation={false}>
        <LoadingStep loadingText={loadingText} direction="forward" />
      </ScreenWrapper>
    );
  }

  // Loading state for recipe generation
  if (appStep === AppStep.LoadingGenerate) {
    return (
      <ScreenWrapper withTabNavigation={false}>
        <LoadingStep loadingText={loadingText} direction="forward" />
      </ScreenWrapper>
    );
  }

  // Results view
  if (appStep === AppStep.Results) {
    return (
      <ScreenWrapper withTabNavigation={false}>
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
              Tekrar Tara
            </Text>
          </TouchableOpacity>
          <View className="bg-orange-100 dark:bg-orange-500/10 px-3 py-1.5 rounded-full">
            <Text className="text-[#f39849] text-xs font-bold">
              AI Chef Beta
            </Text>
          </View>
        </View>
        <View className="flex-1 mt-2">
          <RecipeResults
            recipes={recipes}
            baseImageUri={formData.image}
            colorScheme={colorScheme}
            direction="forward"
          />
        </View>
      </ScreenWrapper>
    );
  }

  // Form view (all steps except loading and results)
  return (
    <View style={{ flex: 1 }}>
      <MultiStepForm
        steps={steps}
        onFinish={(data) => handleDiscoverRecipesAsync(data as ScanFormData)}
        headerTitle="Tarif Oluştur"
        backButtonBehavior="pop"
        validationSchema={scanFormSchema}
        initialData={{
          selectedIngredients: formData.selectedIngredients || [],
          timePreference: formData.timePreference || 30,
          dietPreferences: formData.dietPreferences || [],
        }}
      />
    </View>
  );
}
