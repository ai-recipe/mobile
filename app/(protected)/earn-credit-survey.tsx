import {
  MultiStepForm,
  type MultiStepFormStep,
} from "@/components/MultiStepForm";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  resetSurveyStatus,
  submitSurveyAsync,
} from "@/store/slices/surveySlice";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

const COOKING_HABITS = [
  { id: "quick_meals", label: "Quick Meals", icon: "timer" as const },
  { id: "meal_prep", label: "Meal Prep", icon: "event" as const },
  { id: "baking", label: "Baking", icon: "restaurant" as const },
  {
    id: "exploring",
    label: "Exploring New Cuisines",
    icon: "explore" as const,
  },
] as const;

const surveySchema = yup.object({
  fullName: yup
    .string()
    .required("Lütfen adınızı ve soyadınızı girin")
    .min(3, "Ad soyad en az 3 karakter olmalıdır"),
  age: yup
    .string()
    .required("Lütfen yaşınızı girin")
    .test(
      "is-number",
      "Lütfen geçerli bir sayı girin",
      (val) => !isNaN(Number(val)),
    )
    .test("age-limit", "Yaşınız 13 ile 100 arasında olmalıdır", (val) => {
      const age = Number(val);
      return age >= 13 && age <= 100;
    }),
  cookingGoal: yup.string().required("Lütfen bir hedef seçin"),
  experience: yup.string().required("Lütfen deneyim seviyenizi seçin"),
  habits: yup
    .array()
    .of(yup.string())
    .min(1, "En az bir alışkanlık seçmelisiniz")
    .required("Lütfen en az bir alışkanlık seçin"),
});

type SurveyFormData = yup.InferType<typeof surveySchema>;

function useSurveySteps(): MultiStepFormStep[] {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";

  const inputBg = isDark ? "rgba(255,255,255,0.05)" : theme.card;
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : theme.border;
  const placeholderColor = isDark ? "rgba(255,255,255,0.3)" : theme.muted;

  const { isSubmitLoading } = useAppSelector((state) => state.survey);

  return useMemo(
    () => [
      {
        id: "basic_info",
        title: "Bize biraz kendinden bahset",
        subtitle:
          "Sana en iyi tarif önerilerini sunabilmemiz için temel bilgilerini öğrenmek isteriz.",
        fields: ["fullName", "age"],
        render: ({ data, setValue, nextStep, errors }) => (
          <View className="gap-2 mt-2">
            <View className="py-3">
              <Text
                className="text-base font-medium pb-2"
                style={{ color: theme.text }}
              >
                Ad Soyad
              </Text>
              <TextInput
                className={`w-full rounded-xl h-14 px-4 text-base border ${
                  errors.fullName ? "border-red-500" : ""
                }`}
                style={{
                  backgroundColor: inputBg,
                  borderColor: errors.fullName ? "#ef4444" : inputBorder,
                  color: theme.text,
                }}
                placeholder="Adınızı ve soyadınızı girin"
                placeholderTextColor={placeholderColor}
                value={(data.fullName as string) ?? ""}
                onChangeText={(v) => setValue("fullName", v)}
              />
              {errors.fullName && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1">
                  {errors.fullName.message as string}
                </Text>
              )}
            </View>
            <View className="py-3">
              <Text
                className="text-base font-medium pb-2"
                style={{ color: theme.text }}
              >
                Yaş
              </Text>
              <TextInput
                className={`w-full rounded-xl h-14 px-4 text-base border ${
                  errors.age ? "border-red-500" : ""
                }`}
                style={{
                  backgroundColor: inputBg,
                  borderColor: errors.age ? "#ef4444" : inputBorder,
                  color: theme.text,
                }}
                placeholder="Kaç yaşındasınız?"
                placeholderTextColor={placeholderColor}
                keyboardType="number-pad"
                value={(data.age as string) ?? ""}
                onChangeText={(v) => setValue("age", v)}
              />
              {errors.age && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1">
                  {errors.age.message as string}
                </Text>
              )}
            </View>
            <View className="flex-grow min-h-[120]" />
            <TouchableOpacity
              activeOpacity={0.9}
              className="w-full rounded-xl py-4 flex-row items-center justify-center gap-2"
              style={{ backgroundColor: theme.tint }}
              onPress={nextStep}
            >
              <Text className="text-white text-lg font-bold">İleri</Text>
              <MaterialIcons name="arrow-forward" size={22} color="white" />
            </TouchableOpacity>
          </View>
        ),
      },
      {
        id: "cooking_goals",
        title: "Ana yemek pişirme amacın ne?",
        subtitle: "Tarif önerilerimizi buna göre özelleştireceğiz.",
        fields: ["cookingGoal"],
        render: ({ data, setValue, nextStep, errors }) => {
          const goals = [
            { id: "health", label: "Daha sağlıklı beslenmek" },
            { id: "variety", label: "Yeni tarifler denemek" },
            { id: "speed", label: "Daha hızlı yemek yapmak" },
            { id: "family", label: "Aileyi iyi beslemek" },
          ];
          const selected = (data.cookingGoal as string) ?? "";
          return (
            <View className="gap-2 mt-2">
              {goals.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  activeOpacity={0.8}
                  className="p-4 rounded-xl border flex-row items-center justify-between"
                  style={{
                    backgroundColor:
                      selected === g.id ? "rgba(243,152,73,0.15)" : inputBg,
                    borderColor:
                      selected === g.id
                        ? theme.tint
                        : errors.cookingGoal
                          ? "#ef4444"
                          : inputBorder,
                  }}
                  onPress={() => setValue("cookingGoal", g.id)}
                >
                  <Text
                    className="text-lg font-medium"
                    style={{ color: theme.text }}
                  >
                    {g.label}
                  </Text>
                  {selected === g.id && (
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color={theme.tint}
                    />
                  )}
                </TouchableOpacity>
              ))}
              {errors.cookingGoal && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.cookingGoal.message as string}
                </Text>
              )}
              <View className="flex-grow min-h-[120]" />
              <TouchableOpacity
                activeOpacity={0.9}
                className="w-full rounded-xl py-4 flex-row items-center justify-center gap-2"
                style={{ backgroundColor: theme.tint }}
                onPress={nextStep}
              >
                <Text className="text-white text-lg font-bold">İleri</Text>
                <MaterialIcons name="arrow-forward" size={22} color="white" />
              </TouchableOpacity>
            </View>
          );
        },
      },
      {
        id: "experience",
        title: "Yemek yapma deneyimini nasıl tanımlarsın?",
        subtitle: "Bu, doğru zorluk seviyesini belirlememize yardımcı olur.",
        fields: ["experience"],
        render: ({ data, setValue, nextStep, errors }) => {
          const options = [
            { id: "beginner", label: "Başlangıç" },
            { id: "intermediate", label: "Orta Seviye" },
            { id: "advanced", label: "İleri Seviye" },
          ];
          const selected = (data.experience as string) ?? "";
          return (
            <View className="gap-2 mt-2">
              {options.map((o) => (
                <TouchableOpacity
                  key={o.id}
                  activeOpacity={0.8}
                  className="p-4 rounded-xl border flex-row items-center justify-between"
                  style={{
                    backgroundColor:
                      selected === o.id ? "rgba(243,152,73,0.15)" : inputBg,
                    borderColor:
                      selected === o.id
                        ? theme.tint
                        : errors.experience
                          ? "#ef4444"
                          : inputBorder,
                  }}
                  onPress={() => setValue("experience", o.id)}
                >
                  <Text
                    className="text-lg font-medium"
                    style={{ color: theme.text }}
                  >
                    {o.label}
                  </Text>
                  {selected === o.id && (
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color={theme.tint}
                    />
                  )}
                </TouchableOpacity>
              ))}
              {errors.experience && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.experience.message as string}
                </Text>
              )}
              <View className="flex-grow min-h-[120]" />
              <TouchableOpacity
                activeOpacity={0.9}
                className="w-full rounded-xl py-4 flex-row items-center justify-center gap-2"
                style={{ backgroundColor: theme.tint }}
                onPress={nextStep}
              >
                <Text className="text-white text-lg font-bold">İleri</Text>
                <MaterialIcons name="arrow-forward" size={22} color="white" />
              </TouchableOpacity>
            </View>
          );
        },
      },
      {
        id: "cooking_habits",
        title: "Yemek yapma alışkanlıkların neler?",
        subtitle: "En uygun tarifleri önermek için sana uyanları seç.",
        fields: ["habits"],
        render: ({ data, setValue, nextStep, errors }) => {
          const selectedSet = new Set((data.habits as string[]) ?? []);
          const toggle = (id: string) => {
            const next = new Set(selectedSet);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            setValue("habits", Array.from(next));
          };
          return (
            <View className="gap-2 mt-2">
              {COOKING_HABITS.map((h) => {
                const checked = selectedSet.has(h.id);
                return (
                  <TouchableOpacity
                    key={h.id}
                    activeOpacity={0.8}
                    className="p-4 rounded-xl border flex-row-reverse items-center gap-3 justify-between"
                    style={{
                      backgroundColor: inputBg,
                      borderColor: checked
                        ? theme.tint
                        : errors.habits
                          ? "#ef4444"
                          : inputBorder,
                    }}
                    onPress={() => toggle(h.id)}
                  >
                    <View
                      className="h-6 w-6 rounded border items-center justify-center"
                      style={{
                        borderColor: checked
                          ? theme.tint
                          : errors.habits
                            ? "#ef4444"
                            : inputBorder,
                        backgroundColor: checked ? theme.tint : "transparent",
                      }}
                    >
                      {checked && (
                        <MaterialIcons name="check" size={16} color="white" />
                      )}
                    </View>
                    <View className="flex-row items-center gap-3 flex-1">
                      <MaterialIcons
                        name={h.icon}
                        size={24}
                        color={theme.tint}
                      />
                      <Text
                        className="text-lg font-medium"
                        style={{ color: theme.text }}
                      >
                        {h.label === "Quick Meals"
                          ? "Hızlı Öğünler"
                          : h.label === "Meal Prep"
                            ? "Öğün Hazırlığı"
                            : h.label === "Baking"
                              ? "Hamur İşleri"
                              : "Yeni Mutfaklar Keşfetmek"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
              {errors.habits && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.habits.message as string}
                </Text>
              )}
              <View className="flex-grow min-h-[120]" />
              <TouchableOpacity
                activeOpacity={0.9}
                disabled={isSubmitLoading}
                className="w-full rounded-xl py-5 flex-row items-center justify-center gap-2 mb-2"
                style={{
                  backgroundColor: theme.tint,
                  opacity: isSubmitLoading ? 0.7 : 1,
                }}
                onPress={nextStep}
              >
                {isSubmitLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <MaterialIcons
                      name="check-circle"
                      size={22}
                      color="white"
                    />
                    <Text className="text-white text-lg font-bold">
                      Anketi Bitir
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              <Text
                className="text-center text-xs mt-2"
                style={{ color: theme.muted }}
              >
                Bu tercihleri daha sonra ayarlardan değiştirebilirsin
              </Text>
            </View>
          );
        },
      },
    ],
    [theme, isDark, inputBg, inputBorder, placeholderColor, isSubmitLoading],
  );
}

export default function EarnCreditSurveyScreen() {
  const steps = useSurveySteps();
  const dispatch = useAppDispatch();
  const { isSuccess, error } = useAppSelector((state) => state.survey);

  useEffect(() => {
    if (isSuccess) {
      Alert.alert(
        "Tebrikler!",
        "Anketi tamamladınız ve kredileriniz hesabınıza tanımlandı.",
        [
          {
            text: "Tamam",
            onPress: () => {
              dispatch(resetSurveyStatus());
              router.back();
            },
          },
        ],
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      Alert.alert("Hata", error, [
        {
          text: "Tamam",
          onPress: () => dispatch(resetSurveyStatus()),
        },
      ]);
    }
  }, [error]);

  const handleFinish = (data: Record<string, unknown>) => {
    dispatch(submitSurveyAsync(data));
  };

  return (
    <MultiStepForm
      steps={steps}
      onFinish={handleFinish}
      headerTitle="Kredi Kazan"
      backButtonBehavior="pop"
      validationSchema={surveySchema}
    />
  );
}
