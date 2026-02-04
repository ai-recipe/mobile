import { analyseImage } from "@/api/recipe";
import { MultiStepForm } from "@/components/MultiStepForm";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch } from "@/store/hooks";
import {
  setAnalyseError,
  setFormData,
  setRecipeLoading,
  setRecipes,
} from "@/store/slices/recipeSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { ScreenWrapper } from "../../components/ScreenWrapper";

// Sub-components
import { LoadingStep } from "./components/LoadingStep";
import { RecipeResults } from "./components/RecipeResults";
import { createFormSteps } from "./helpers/ai-scan-form.helpers";
import { ScanFormData, scanFormSchema } from "./types/ai-scan-form.types";

const LOADING_MESSAGES_SCAN = [
  "Yapay Zeka Uyanıyor...",
  "Malzemeler Tanımlanıyor...",
  "Sonuçlar optimize ediliyor...",
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

  const { formData, recipes } = useSelector((state: any) => state.recipe);
  const dispatch = useAppDispatch();

  // 1: Form (MultiStepForm), 2: Loading, 3: Results
  const [appStep, setAppStep] = useState<"form" | "loading" | "results">(
    "form",
  );
  const [loadingText, setLoadingText] = useState("Görüntü Analiz Ediliyor...");

  const loadingMessages = useMemo(() => {
    if (appStep === "loading") {
      return LOADING_MESSAGES_SCAN;
    }
    return LOADING_MESSAGES_GENERATE_RECIPE;
  }, [appStep]);

  const handleFetchRecipes = useCallback(
    async (data: ScanFormData) => {
      // Sync with redux for consistency if needed, but we'll use local 'data' for API
      dispatch(
        setFormData({
          ...formData,
          timePreference: data.timePreference,
          ingredients: data.dietPreferences,
        }),
      );

      setAppStep("loading");
      dispatch(setRecipeLoading(true));
      dispatch(setAnalyseError(null));

      try {
        const result = await analyseImage({
          imageUrl: "", // We use empty string as placeholder for now since we're in development/mock phase
          ingredients: (data.dietPreferences ?? []).filter(
            (i): i is string => !!i,
          ),
          timeMinutes: data.timePreference ?? 30,
        });

        dispatch(setRecipes(result.recipes ?? []));
        dispatch(setRecipeLoading(false));
        setAppStep("results");
      } catch (err) {
        dispatch(setRecipeLoading(false));
        dispatch(
          setAnalyseError(
            err instanceof Error ? err.message : "Analiz başarısız",
          ),
        );
        Alert.alert(
          "Analiz Hatası",
          err instanceof Error
            ? err.message
            : "Tarifler alınamadı. Lütfen tekrar deneyin.",
          [{ text: "Tamam", onPress: () => setAppStep("form") }],
        );
      }
    },
    [formData, dispatch],
  );

  const steps = useMemo(
    () => createFormSteps({ formData, router }),
    [formData, router],
  );
  // Rotate loading messages when on loading step
  useEffect(() => {
    if (appStep !== "loading") return;
    const id = setInterval(() => {
      setLoadingText((prev) => {
        const idx = LOADING_MESSAGES.indexOf(prev);
        return LOADING_MESSAGES[(idx + 1) % LOADING_MESSAGES.length];
      });
    }, 2000);
    return () => clearInterval(id);
  }, [appStep]);

  if (appStep === "loading") {
    return (
      <ScreenWrapper withTabNavigation={false}>
        <LoadingStep loadingText={loadingText} direction="forward" />
      </ScreenWrapper>
    );
  }

  if (appStep === "results") {
    return (
      <ScreenWrapper withTabNavigation={false}>
        {/* Header for Step: Results */}
        <View className="px-5 py-2 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => setAppStep("form")}
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

  return (
    <View style={{ flex: 1 }}>
      <MultiStepForm
        steps={steps}
        onFinish={(data) => handleFetchRecipes(data as ScanFormData)}
        headerTitle="Tarif Oluştur"
        backButtonBehavior="pop"
        validationSchema={scanFormSchema}
        initialData={{
          timePreference: formData.timePreference || 30,
          dietPreferences: formData.ingredients || [],
        }}
      />
    </View>
  );
}
