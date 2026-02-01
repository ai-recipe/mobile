import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { useSelector } from "react-redux";
import {
  setFormData,
  setRecipes,
  setRecipeLoading,
  setAnalyseError,
} from "@/store/slices/recipeSlice";
import { useAppDispatch } from "@/store/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { analyseImage } from "@/api/recipe";

const TIME_OPTIONS = [15, 30, 60];
const DIET_OPTIONS = [
  { id: "vegan", label: "Vegan", icon: "leaf" },
  { id: "vegetarian", label: "Vejeteryan", icon: "carrot" },
  { id: "protein", label: "Yüksek Protein", icon: "arm-flex" },
  { id: "low-carb", label: "Düşük Karb", icon: "food-steak" },
];

const LOADING_MESSAGES = [
  "Malzemeler Tanımlanıyor...",
  "Lezzet Eşleşmeleri Yapılıyor...",
  "Şef Yapay Zeka Düşünüyor...",
  "En İyi Tarifler Hazırlanıyor...",
];

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

export default function AiScanFormScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const { formData, recipes } = useSelector((state: any) => state.recipe);
  const dispatch = useAppDispatch();
  // 1: Review, 2: Form, 3: Loading, 4: Results
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loadingText, setLoadingText] = useState("Görüntü Analiz Ediliyor...");
  const [imageUrlOverride, setImageUrlOverride] = useState("");

  const handleFormDataChange = (key: keyof typeof formData, value: any) => {
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

  // --- RENDER FUNCTIONS ---

  // STEP 1: Image Review
  const renderStep1_Review = () => (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      className="flex-1 px-5 pt-4"
    >
      <View className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-[32px] overflow-hidden border border-zinc-200 dark:border-zinc-700 relative mb-6">
        <Image
          source={{ uri: formData.image }}
          className="w-full h-full object-cover"
        />
        <View className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md p-5">
          <Text className="text-white font-bold text-center text-lg">
            Taranan Görüntü
          </Text>
        </View>
      </View>

      <View className="pb-8 gap-4">
        <View className="flex-row gap-4">
          <TouchableOpacity className="flex-1 bg-white dark:bg-zinc-800 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex-row items-center justify-center gap-2">
            <MaterialIcons name="photo-camera" size={20} color="#71717a" />
            <Text className="text-zinc-700 dark:text-zinc-300 font-bold">
              Yeni Çek
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white dark:bg-zinc-800 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex-row items-center justify-center gap-2">
            <MaterialIcons name="collections" size={20} color="#71717a" />
            <Text className="text-zinc-700 dark:text-zinc-300 font-bold">
              Galeri
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setStep(2)}
          activeOpacity={0.9}
          className="bg-[#f39849] w-full py-4 rounded-2xl items-center justify-center shadow-lg shadow-orange-500/30 flex-row gap-2"
        >
          <Text className="text-white font-extrabold text-lg">Devam Et</Text>
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // STEP 2: Preferences Form
  const renderStep2_Form = () => (
    <Animated.View
      entering={SlideInRight}
      exiting={FadeOut}
      className="flex-1 px-5 pt-2"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
          Tercihlerinizi <Text className="text-[#f39849]">Seçin</Text>
        </Text>
        <Text className="text-zinc-500 dark:text-zinc-400 text-base mb-8">
          Size en uygun tarifi bulmamız için detayları belirleyin.
        </Text>

        {/* Image URL Override (for testing with public URLs) */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
            Görsel URL (isteğe bağlı)
          </Text>
          <TextInput
            value={imageUrlOverride}
            onChangeText={setImageUrlOverride}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor="#a1a1aa"
            className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white"
          />
          <Text className="text-zinc-500 text-xs mt-1">
            Kamera/galeri yerine URL ile test etmek için
          </Text>
        </View>

        {/* Time Selection */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex-row items-center">
            <MaterialIcons name="timer" size={20} color="#f39849" /> Hazırlık
            Süresi
          </Text>
          <View className="flex-row gap-3">
            {TIME_OPTIONS.map((time) => (
              <TouchableOpacity
                key={time.toString()}
                onPress={() => handleFormDataChange("timePreference", time)}
                className={`flex-1 py-4 px-2 rounded-2xl border items-center justify-center ${formData.timePreference === time ? "bg-[#f39849] border-[#f39849]" : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"}`}
              >
                <Text
                  className={`font-bold text-lg ${formData.timePreference === time ? "text-white" : "text-zinc-600 dark:text-zinc-400"}`}
                >
                  {time} Dk
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Diet Selection */}
        <View className="mb-10">
          <Text className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex-row items-center">
            <MaterialCommunityIcons
              name="food-apple"
              size={20}
              color="#f39849"
            />{" "}
            Beslenme Tercihi
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {DIET_OPTIONS.map((diet) => {
              const ingredients = formData.ingredients;
              const isSelected = formData.ingredients.includes(diet.id);
              return (
                <TouchableOpacity
                  key={diet.id}
                  onPress={() =>
                    handleFormDataChange(
                      "ingredients",
                      ingredients.includes(diet.id)
                        ? ingredients.filter(
                            (ingredient: string) => ingredient !== diet.id,
                          )
                        : [...ingredients, diet.id],
                    )
                  }
                  className={`py-3 px-5 rounded-full border flex-row items-center gap-2 ${
                    isSelected
                      ? "bg-[#f39849]/10 border-[#f39849]"
                      : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  <MaterialCommunityIcons
                    name={diet.icon as any}
                    size={18}
                    color={isSelected ? "#f39849" : "#a1a1aa"}
                  />
                  <Text
                    className={`font-bold ${isSelected ? "text-[#f39849]" : "text-zinc-500"}`}
                  >
                    {diet.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="pb-8 pt-2">
        <TouchableOpacity
          onPress={handleFetchRecipes}
          activeOpacity={0.9}
          className="bg-[#f39849] w-full h-[64px] rounded-2xl items-center justify-center shadow-lg shadow-orange-500/30 flex-row gap-2"
        >
          <MaterialIcons name="auto-awesome" size={24} color="white" />
          <Text className="text-white font-extrabold text-lg">
            Tarifleri Getir
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // STEP 3: Loading Animation
  const renderStep3_Loading = () => (
    <Animated.View
      entering={FadeIn.duration(500)}
      className="flex-1 items-center justify-center px-8 bg-white dark:bg-zinc-900"
    >
      <StatusBar barStyle="dark-content" />
      <View className="absolute size-80 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />

      <View className="items-center mb-10 z-10">
        <View className="size-28 bg-white dark:bg-zinc-800 rounded-[32px] items-center justify-center shadow-2xl shadow-orange-500/20 mb-10 border border-orange-50 dark:border-zinc-700">
          <ActivityIndicator
            size="large"
            color="#f39849"
            style={{ transform: [{ scale: 1.5 }] }}
          />
        </View>

        <Animated.View
          key={loadingText}
          entering={FadeInDown.springify()}
          exiting={FadeOut}
        >
          <Text className="text-2xl font-black text-center text-zinc-900 dark:text-white mb-3">
            {loadingText}
          </Text>
        </Animated.View>

        <Text className="text-zinc-500 dark:text-zinc-400 text-center font-medium leading-6 max-w-[250px]">
          Buzdolabındaki malzemeler taranıyor ve analiz ediliyor...
        </Text>
      </View>
    </Animated.View>
  );

  // STEP 4: Recipe Results
  const renderStep4_Results = () => (
    <Animated.View entering={FadeIn.duration(600)} className="flex-1">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-1">
          Sonuçlar Hazır
        </Text>
        <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white">
          Sizin İçin{" "}
          <Text className="text-[#f39849]">{recipes.length} Tarif</Text> Bulduk
        </Text>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item, idx) => `${item.recipe_name}-${idx}`}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 200).springify()}
            className="bg-white dark:bg-zinc-800 rounded-[28px] mb-6 border border-zinc-100 dark:border-zinc-700 overflow-hidden"
          >
            {/* Image Section */}
            <View className="h-48 relative">
              <Image
                source={{ uri: formData.image || PLACEHOLDER_IMAGE }}
                className="w-full h-full object-cover"
              />
              <View className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center">
                <MaterialIcons name="schedule" size={14} color="#f39849" />
                <Text className="text-[#f39849] font-black text-xs ml-1">
                  {item.recipe_time}
                </Text>
              </View>
            </View>

            {/* Content Section */}
            <View className="p-5">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-xl font-bold text-zinc-900 dark:text-white flex-1 mr-2">
                  {item.recipe_name}
                </Text>
              </View>

              {/* Time & Ingredients Header */}
              <View className="flex-row items-center gap-4 mb-2">
                <View className="flex-row items-center">
                  <MaterialIcons name="schedule" size={16} color="#a1a1aa" />
                  <Text className="text-zinc-500 text-xs font-bold ml-1.5">
                    {item.recipe_time}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="food-apple"
                    size={16}
                    color="#a1a1aa"
                  />
                  <Text className="text-zinc-500 text-xs font-bold ml-1.5">
                    {item.recipe_difficulty}
                  </Text>
                </View>
              </View>

              {item.recipe_ingredients?.length > 0 && (
                <View className="mb-4">
                  <Text className="text-zinc-500 text-xs font-bold mb-1.5">
                    Malzemeler
                  </Text>
                  <Text className="text-zinc-700 dark:text-zinc-300 text-sm">
                    {item.recipe_ingredients.join(", ")}
                  </Text>
                </View>
              )}

              {item.why_this_recipe ? (
                <Text className="text-zinc-500 text-sm mb-4 italic">
                  {item.why_this_recipe}
                </Text>
              ) : null}

              {/* Action Button */}
              <TouchableOpacity
                activeOpacity={0.9}
                className="w-full h-12 bg-zinc-900 dark:bg-white rounded-xl items-center justify-center flex-row gap-2"
                onPress={() =>
                  console.log("Navigate to Detail", item.recipe_name)
                }
              >
                <Text className="text-white dark:text-black font-bold text-sm">
                  Tarifi Gör
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={16}
                  color={colorScheme === "dark" ? "black" : "white"}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />
    </Animated.View>
  );

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
        {step === 1 && renderStep1_Review()}
        {step === 2 && renderStep2_Form()}
        {step === 3 && renderStep3_Loading()}
        {step === 4 && renderStep4_Results()}
      </View>
    </ScreenWrapper>
  );
}
