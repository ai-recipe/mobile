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
    matchedIngredients: string[];
    missingIngredients: string[];
    steps: string[];
    dietaryTags: string[];
    nutritionSummary: {
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
            <View className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center">
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
                <View className="bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-xl">
                  <Text className="text-green-700 dark:text-green-400 text-sm font-bold">
                    %{recipe.matchPercentage.toFixed(0)} Uyum
                  </Text>
                </View>
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
            {recipe.dietaryTags.length > 0 && (
              <View className="mb-6">
                <Text className="text-zinc-500 text-xs font-bold mb-2">
                  Diyet Etiketleri
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {recipe.dietaryTags.map((tag, idx) => (
                    <View
                      key={idx}
                      className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-purple-700 dark:text-purple-400 text-xs font-semibold">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Nutrition Summary */}
            <View className="mb-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4">
              <Text className="text-zinc-900 dark:text-white text-base font-bold mb-3">
                Besin Değerleri (Porsiyon Başı)
              </Text>
              <View className="flex-row justify-between">
                <View className="items-center flex-1">
                  <View className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/10 items-center justify-center mb-2">
                    <Text className="text-[#f39849] text-xl font-bold">
                      {recipe.nutritionSummary.calories}
                    </Text>
                  </View>
                  <Text className="text-zinc-500 text-xs font-semibold">
                    Kalori
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <View className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/10 items-center justify-center mb-2">
                    <Text className="text-blue-600 dark:text-blue-400 text-xl font-bold">
                      {recipe.nutritionSummary.protein}g
                    </Text>
                  </View>
                  <Text className="text-zinc-500 text-xs font-semibold">
                    Protein
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <View className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/10 items-center justify-center mb-2">
                    <Text className="text-green-600 dark:text-green-400 text-xl font-bold">
                      {recipe.nutritionSummary.carbs}g
                    </Text>
                  </View>
                  <Text className="text-zinc-500 text-xs font-semibold">
                    Karbonhidrat
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <View className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/10 items-center justify-center mb-2">
                    <Text className="text-amber-600 dark:text-amber-400 text-xl font-bold">
                      {recipe.nutritionSummary.fat}g
                    </Text>
                  </View>
                  <Text className="text-zinc-500 text-xs font-semibold">
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
                  {recipe.matchedIngredients.length > 0 && (
                    <View className="mb-4">
                      <Text className="text-zinc-500 text-xs font-bold mb-2">
                        Elinizde Var
                      </Text>
                      {recipe.matchedIngredients.map((item, index) => (
                        <TouchableOpacity
                          key={`matched-${index}`}
                          activeOpacity={0.7}
                          onPress={() => toggleIngredient(index)}
                          className="flex-row items-center gap-3 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-2"
                        >
                          <View
                            className={`w-5 h-5 rounded border ${
                              checkedIngredients[index]
                                ? "bg-green-600 border-green-600"
                                : "border-green-400 dark:border-green-600"
                            } items-center justify-center`}
                          >
                            {checkedIngredients[index] && (
                              <MaterialIcons
                                name="check"
                                size={12}
                                color="white"
                              />
                            )}
                          </View>
                          <MaterialIcons
                            name="check-circle"
                            size={16}
                            color="#22c55e"
                          />
                          <Text
                            className={`flex-1 text-zinc-700 dark:text-zinc-300 ${
                              checkedIngredients[index]
                                ? "line-through opacity-50"
                                : ""
                            }`}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Missing Ingredients */}
                  {recipe.missingIngredients.length > 0 && (
                    <View>
                      <Text className="text-zinc-500 text-xs font-bold mb-2">
                        Almanız Gerekenler
                      </Text>
                      {recipe.missingIngredients.map((item, index) => {
                        const adjustedIndex =
                          index + recipe.matchedIngredients.length;
                        return (
                          <TouchableOpacity
                            key={`missing-${index}`}
                            activeOpacity={0.7}
                            onPress={() => toggleIngredient(adjustedIndex)}
                            className="flex-row items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-2"
                          >
                            <View
                              className={`w-5 h-5 rounded border ${
                                checkedIngredients[adjustedIndex]
                                  ? "bg-amber-600 border-amber-600"
                                  : "border-amber-400 dark:border-amber-600"
                              } items-center justify-center`}
                            >
                              {checkedIngredients[adjustedIndex] && (
                                <MaterialIcons
                                  name="check"
                                  size={12}
                                  color="white"
                                />
                              )}
                            </View>
                            <MaterialIcons
                              name="warning"
                              size={16}
                              color="#f59e0b"
                            />
                            <Text
                              className={`flex-1 text-zinc-700 dark:text-zinc-300 ${
                                checkedIngredients[adjustedIndex]
                                  ? "line-through opacity-50"
                                  : ""
                              }`}
                            >
                              {item}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              ) : (
                <View className="space-y-6">
                  {recipe.steps.map((step, index) => (
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
