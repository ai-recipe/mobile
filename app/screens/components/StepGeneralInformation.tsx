import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeOut, SlideInRight } from "react-native-reanimated";

const TIME_OPTIONS = [15, 30, 60];
const DIET_OPTIONS = [
  { id: "vegan", label: "Vegan", icon: "leaf" },
  { id: "vegetarian", label: "Vejeteryan", icon: "carrot" },
  { id: "protein", label: "Yüksek Protein", icon: "arm-flex" },
  { id: "low-carb", label: "Düşük Karb", icon: "food-steak" },
];

interface StepGeneralInformationProps {
  formData: {
    timePreference: number;
    ingredients: string[];
    [key: string]: any;
  };
  imageUrlOverride: string;
  setImageUrlOverride: (url: string) => void;
  onFormDataChange: (key: string, value: any) => void;
  onSubmit: () => void;
}

export function StepGeneralInformation({
  formData,
  imageUrlOverride,
  setImageUrlOverride,
  onFormDataChange,
  onSubmit,
}: StepGeneralInformationProps) {
  return (
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
                onPress={() => onFormDataChange("timePreference", time)}
                className={`flex-1 py-4 px-2 rounded-2xl border items-center justify-center ${
                  formData.timePreference === time
                    ? "bg-[#f39849] border-[#f39849]"
                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                }`}
              >
                <Text
                  className={`font-bold text-lg ${
                    formData.timePreference === time
                      ? "text-white"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
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
              const isSelected = ingredients.includes(diet.id);
              return (
                <TouchableOpacity
                  key={diet.id}
                  onPress={() =>
                    onFormDataChange(
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
                    className={`font-bold ${
                      isSelected ? "text-[#f39849]" : "text-zinc-500"
                    }`}
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
          onPress={onSubmit}
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
}
