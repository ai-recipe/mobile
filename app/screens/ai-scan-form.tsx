import { analyseImage } from "@/api/recipe";
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
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { ScreenWrapper } from "../../components/ScreenWrapper";

// Sub-components
import { LoadingStep } from "./components/LoadingStep";
import { RecipeResults } from "./components/RecipeResults";
import { StepGeneralInformation } from "./components/StepGeneralInformation";
import { StepScan } from "./components/StepScan";

const LOADING_MESSAGES = [
  "Malzemeler Tanımlanıyor...",
  "Lezzet Eşleşmeleri Yapılıyor...",
  "Şef Yapay Zeka Düşünüyor...",
  "En İyi Tarifler Hazırlanıyor...",
];

export default function AiScanFormScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const { formData, recipes } = useSelector((state: any) => state.recipe);
  const dispatch = useAppDispatch();
  // 1: Review, 2: Form, 3: Loading, 4: Results
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loadingText, setLoadingText] = useState("Görüntü Analiz Ediliyor...");
  const [imageUrlOverride, setImageUrlOverride] = useState("");

  const handleFormDataChange = (key: string, value: any) => {
    dispatch(setFormData({ ...formData, [key]: value }));
  };

  const handleFetchRecipes = useCallback(async () => {
    const imageUri = imageUrlOverride.trim() || formData.image;
    const isLocalUri =
      !imageUrlOverride.trim() &&
      (imageUri?.startsWith("file://") || imageUri?.startsWith("content://"));

    if (isLocalUri) {
      Alert.alert(
        "URL Gerekli",
        "Analiz için görselin herkese açık bir URL'si olmalıdır. Aşağıdaki alana bir görsel URL'si girebilirsiniz.",
      );
      return;
    }

    if (!imageUri) {
      Alert.alert("Hata", "Lütfen önce bir görsel seçin veya URL girin.");
      return;
    }

    setStep(3);
    dispatch(setRecipeLoading(true));
    dispatch(setAnalyseError(null));

    try {
      const result = await analyseImage({
        imageUrl: imageUri,
        ingredients: formData.ingredients ?? [],
        timeMinutes: formData.timePreference ?? 30,
      });

      dispatch(setRecipes(result.recipes ?? []));
      dispatch(setRecipeLoading(false));
      setStep(4);
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
        [{ text: "Tamam", onPress: () => setStep(2) }],
      );
    }
  }, [formData, imageUrlOverride, dispatch]);

  // Rotate loading messages when on step 3
  useEffect(() => {
    if (step !== 3) return;
    const id = setInterval(() => {
      setLoadingText((prev) => {
        const idx = LOADING_MESSAGES.indexOf(prev);
        return LOADING_MESSAGES[(idx + 1) % LOADING_MESSAGES.length];
      });
    }, 2000);
    return () => clearInterval(id);
  }, [step]);

  return (
    <ScreenWrapper withTabNavigation={step !== 3 && step !== 4}>
      {/* Dynamic Header: Only show back/progress on steps 1 & 2 */}
      {(step === 1 || step === 2) && (
        <View className="px-5 py-2 flex-row items-center justify-between z-10">
          <TouchableOpacity
            onPress={() => (step === 1 ? router.back() : setStep(1))}
            className="size-10 rounded-full bg-zinc-100 items-center justify-center"
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <View className="flex-row gap-1.5">
            <View
              className={`h-2 w-8 rounded-full transition-all ${step >= 1 ? "bg-[#f39849]" : "bg-zinc-200"}`}
            />
            <View
              className={`h-2 w-8 rounded-full transition-all ${step >= 2 ? "bg-[#f39849]" : "bg-zinc-200"}`}
            />
            <View
              className={`h-2 w-8 rounded-full transition-all ${step >= 3 ? "bg-[#f39849]" : "bg-zinc-200"}`}
            />
            <View
              className={`h-2 w-8 rounded-full transition-all ${step >= 4 ? "bg-[#f39849]" : "bg-zinc-200"}`}
            />
          </View>

          {/* Spacer to balance header center */}
          <View className="size-10" />
        </View>
      )}

      {/* Header for Step 4 (Results) */}
      {step === 4 && (
        <View className="px-5 py-2 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => setStep(1)} // Start Over
            className="flex-row items-center bg-zinc-100 px-3 py-1.5 rounded-full"
          >
            <MaterialIcons name="refresh" size={18} color="black" />
            <Text className="text-xs font-bold ml-1">Tekrar Tara</Text>
          </TouchableOpacity>
          <View className="bg-orange-100 px-3 py-1.5 rounded-full">
            <Text className="text-[#f39849] text-xs font-bold">
              AI Chef Beta
            </Text>
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <View className="flex-1 mt-2">
        {step === 1 && (
          <StepScan
            imageUri={formData.image}
            onNext={() => setStep(2)}
            onNewCapture={() => {}}
            onPickFromGallery={() => {}}
          />
        )}
        {step === 2 && (
          <StepGeneralInformation
            formData={formData}
            imageUrlOverride={imageUrlOverride}
            setImageUrlOverride={setImageUrlOverride}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleFetchRecipes}
          />
        )}
        {step === 3 && <LoadingStep loadingText={loadingText} />}
        {step === 4 && (
          <RecipeResults
            recipes={recipes}
            baseImageUri={formData.image}
            colorScheme={colorScheme}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
