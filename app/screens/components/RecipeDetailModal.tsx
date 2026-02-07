import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

interface RecipeDetailModalProps {
  visible: boolean;
  onClose: () => void;
  recipe: {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    totalTimeMinutes: number;
    difficulty: string;
    servings: number;
    matchPercentage: number;
    matchedIngredients?: string[];
    missingIngredients?: string[];
    ingredients?: string[];
    steps?: string[];
    dietaryTags?: string[];
    isFavorite?: boolean;
    nutritionSummary?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  baseImageUri?: string;
}

export function RecipeDetailModal({
  visible,
  onClose,
  recipe,
  baseImageUri,
}: RecipeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"ingredients" | "preparation">(
    "ingredients",
  );
  const [checkedIngredients, setCheckedIngredients] = useState<
    Record<number, boolean>
  >({});

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white dark:bg-zinc-900">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Header Image */}
          <View className="relative w-full h-80">
            <Image
              source={{
                uri: recipe.imageUrl || baseImageUri || PLACEHOLDER_IMAGE,
              }}
              className="w-full h-full object-cover"
            />
            <View className="absolute top-0 left-0 right-0 p-4 flex-row justify-between items-center pt-12">
              <TouchableOpacity
                onPress={onClose}
                className="p-3 rounded-full bg-black/30 backdrop-blur-md"
              >
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="p-3 rounded-full bg-black/30 backdrop-blur-md">
                <MaterialIcons
                  name="favorite-border"
                  size={24}
                  color="#f39849"
                />
              </TouchableOpacity>
            </View>
            <View className="absolute bottom-12 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center">
              <MaterialIcons name="schedule" size={16} color="#f39849" />
              <Text className="text-[#f39849] font-black text-sm ml-1">
                {recipe.totalTimeMinutes} dk
              </Text>
            </View>
          </View>

          {/* Content Area */}
          <View className="flex-1 bg-white dark:bg-zinc-900 -mt-8 rounded-t-[32px] p-6">
            {/* Title Section */}
            <View className="mb-6">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-3xl font-bold leading-tight text-zinc-900 dark:text-white max-w-[75%]">
                  {recipe.title}
                </Text>
                {!!recipe.matchPercentage && (
                  <View className="bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-xl">
                    <Text className="text-green-700 dark:text-green-400 text-sm font-bold">
                      %{recipe.matchPercentage.toFixed(0)} Uyum
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-zinc-500 dark:text-zinc-400 text-base mb-4">
                {recipe.description}
              </Text>

              {/* Quick Info */}
              <View className="flex-row gap-4 mb-4">
                <View className="flex-row items-center">
                  <MaterialIcons name="schedule" size={20} color="#a1a1aa" />
                  <Text className="text-sm text-zinc-500 dark:text-zinc-400 ml-1.5 font-medium">
                    Hazırlık: {recipe.prepTimeMinutes} dk
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialIcons name="restaurant" size={20} color="#a1a1aa" />
                  <Text className="text-sm text-zinc-500 dark:text-zinc-400 ml-1.5 font-medium">
                    Pişirme: {recipe.cookTimeMinutes} dk
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-4">
                <View className="flex-row items-center">
                  <MaterialIcons name="bar-chart" size={20} color="#a1a1aa" />
                  <Text className="text-sm text-zinc-500 dark:text-zinc-400 ml-1.5 font-medium">
                    {recipe.difficulty}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="account-group"
                    size={20}
                    color="#a1a1aa"
                  />
                  <Text className="text-sm text-zinc-500 dark:text-zinc-400 ml-1.5 font-medium">
                    {recipe.servings} Kişilik
                  </Text>
                </View>
              </View>
            </View>

            {/* Dietary Tags */}
            {!!recipe.dietaryTags?.length && (
              <View className="mb-6">
                <View className="flex-row flex-wrap gap-2">
                  {recipe.dietaryTags?.map((tag, idx) => (
                    <View
                      key={idx}
                      className="bg-gray-100 dark:bg-gray-900/30 px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-gray-700 dark:text-gray-400 text-xs font-semibold">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View className="mb-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3">
              <Text className="text-zinc-500 text-xs font-bold mb-2">
                Besin Değerleri
              </Text>
              <View className="flex-row justify-between">
                <View className="items-center flex-1">
                  <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                    {recipe?.nutritionSummary?.calories}
                  </Text>
                  <Text className="text-zinc-500 text-[10px] font-semibold">
                    Kalori
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                    {recipe?.nutritionSummary?.protein}g
                  </Text>
                  <Text className="text-zinc-500 text-[10px] font-semibold">
                    Protein
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                    {recipe?.nutritionSummary?.carbs}g
                  </Text>
                  <Text className="text-zinc-500 text-[10px] font-semibold">
                    Karbonhidrat
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                    {recipe?.nutritionSummary?.fat}g
                  </Text>
                  <Text className="text-zinc-500 text-[10px] font-semibold">
                    Yağ
                  </Text>
                </View>
              </View>
            </View>

            {/* Tabs */}
            <View className="flex-row border-b border-zinc-100 dark:border-zinc-800 mb-6">
              <TouchableOpacity
                onPress={() => setActiveTab("ingredients")}
                className={`flex-1 pb-3 items-center border-b-2 ${
                  activeTab === "ingredients"
                    ? "border-[#f39849]"
                    : "border-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    activeTab === "ingredients"
                      ? "text-[#f39849]"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  Malzemeler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("preparation")}
                className={`flex-1 pb-3 items-center border-b-2 ${
                  activeTab === "preparation"
                    ? "border-[#f39849]"
                    : "border-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    activeTab === "preparation"
                      ? "text-[#f39849]"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  Hazırlanış
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <View>
              {activeTab === "ingredients" ? (
                <View className="space-y-3">
                  {/* Matched Ingredients */}
                  {!!recipe.matchedIngredients?.length && (
                    <View className="mb-4">
                      <Text className="text-zinc-500 text-xs font-bold mb-2">
                        Elinizde Var
                      </Text>
                      <View className="flex flex-row flex-wrap gap-2">
                        {recipe.matchedIngredients.map((item, index) => (
                          <View
                            key={`matched-${index}`}
                            className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-2"
                          >
                            <Text
                              className={`flex-1 text-zinc-700 dark:text-zinc-300 w-fit`}
                            >
                              {item}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Missing Ingredients */}
                  {!!recipe.missingIngredients?.length && (
                    <View>
                      <Text className="text-zinc-500 text-xs font-bold mb-2">
                        Almanız Gerekenler
                      </Text>
                      <View className="flex flex-row flex-wrap gap-2">
                        {recipe.missingIngredients?.map((item, index) => {
                          return (
                            <TouchableOpacity
                              key={`missing-${index}`}
                              activeOpacity={0.7}
                              className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-2"
                            >
                              <Text
                                className={`flex-1 text-zinc-700 dark:text-zinc-300`}
                              >
                                {item}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View className="flex flex-col gap-4">
                  {recipe?.steps?.map((step, index) => (
                    <View key={index} className="flex-row gap-4">
                      <View className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 items-center justify-center">
                        <Text className="text-[#f39849] font-bold text-lg">
                          {index + 1}
                        </Text>
                      </View>
                      <Text className="flex-1 text-zinc-700 dark:text-zinc-300 leading-6 text-base pt-2">
                        {step}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
