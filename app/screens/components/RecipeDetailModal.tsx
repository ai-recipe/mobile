import { useAppDispatch } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/recipeListSlice";
import { toggleFavoriteFromScan } from "@/store/slices/recipeSlice";
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
import { useTranslation } from "@/node_modules/react-i18next";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

interface RecipeDetailModalProps {
  visible: boolean;
  onClose: () => void;
  dontShowFavoriteButton?: boolean;
  recipe: {
    _id: string;
    title: string;
    description?: string;
    imageUrl?: string | null;
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
    difficulty?: string;
    servings?: number;
    ingredients?: string[];
    instructions?: string[];
    dietaryTags?: string[];
    allergens?: string[];
    isFavorite?: boolean;
    nutrition?: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      fiber?: number;
    };
  };
  baseImageUri?: string;
}

export function RecipeDetailModal({
  visible,
  onClose,
  recipe,
  baseImageUri,
  dontShowFavoriteButton,
}: RecipeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"ingredients" | "preparation">(
    "ingredients",
  );

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite);

  const handleToggleFavorite = async () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    try {
      await Promise.all([
        dispatch(toggleFavorite({ recipeId: recipe._id, isFavorite: !!isFavorite })),
        dispatch(toggleFavoriteFromScan({ recipeId: recipe._id, isFavorite: !!isFavorite })),
      ]);
    } catch (error) {
      setIsFavorite(!newStatus);
      console.error("Favoriting failed:", error);
    }
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
              {!dontShowFavoriteButton && (
                <TouchableOpacity
                  onPress={handleToggleFavorite}
                  className="p-3 rounded-full bg-black/30 backdrop-blur-md"
                >
                  <MaterialIcons
                    name={isFavorite ? "favorite" : "favorite-border"}
                    size={24}
                    color={isFavorite ? "#f43f5e" : "#f39849"}
                  />
                </TouchableOpacity>
              )}
            </View>
            {(recipe.prepTimeMinutes != null || recipe.cookTimeMinutes != null) && (
              <View className="absolute bottom-12 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center">
                <MaterialIcons name="schedule" size={16} color="#f39849" />
                <Text className="text-[#f39849] font-black text-sm ml-1">
                  {(recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0)} {t("explore.mins")}
                </Text>
              </View>
            )}
          </View>

          {/* Content Area */}
          <View className="flex-1 bg-white dark:bg-zinc-900 -mt-8 rounded-t-[32px] p-6">
            {/* Title Section */}
            <View className="mb-6">
              <Text className="text-3xl font-bold leading-tight text-zinc-900 dark:text-white mb-2">
                {recipe.title}
              </Text>

              {recipe.description && (
                <Text className="text-zinc-500 dark:text-zinc-400 text-base mb-4">
                  {recipe.description}
                </Text>
              )}

              {/* Quick Info */}
              <View className="flex-row flex-wrap gap-4 mb-4">
                {recipe.prepTimeMinutes != null && (
                  <View className="flex-row items-center">
                    <MaterialIcons name="schedule" size={20} color="#a1a1aa" />
                    <Text className="text-sm text-zinc-500 dark:text-zinc-400 ml-1.5 font-medium">
                      {t("timePreference.title")}: {recipe.prepTimeMinutes} {t("explore.mins")}
                    </Text>
                  </View>
                )}
                {recipe.cookTimeMinutes != null && (
                  <View className="flex-row items-center">
                    <MaterialIcons name="restaurant" size={20} color="#a1a1aa" />
                    <Text className="text-sm text-zinc-500 dark:text-zinc-400 ml-1.5 font-medium">
                      {t("recipeDetail.cooking")}: {recipe.cookTimeMinutes} {t("explore.mins")}
                    </Text>
                  </View>
                )}
                {recipe.difficulty && (
                  <View className="flex-row items-center">
                    <MaterialIcons name="bar-chart" size={20} color="#a1a1aa" />
                    <Text className="text-sm text-zinc-500 dark:text-zinc-400 ml-1.5 font-medium">
                      {t(`difficulty.${recipe.difficulty}`, { defaultValue: recipe.difficulty })}
                    </Text>
                  </View>
                )}
                {recipe.servings != null && (
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="account-group" size={20} color="#a1a1aa" />
                    <Text className="text-sm text-zinc-500 dark:text-zinc-400 ml-1.5 font-medium">
                      {recipe.servings} {t("common.servings")}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Dietary Tags */}
            {!!recipe.dietaryTags?.length && (
              <View className="mb-6">
                <View className="flex-row flex-wrap gap-2">
                  {recipe.dietaryTags?.map((tag, idx) => (
                    <View
                      key={idx}
                      className="bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <Text className="text-green-700 dark:text-green-400 text-xs font-semibold">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {recipe.nutrition && (
              <View className="mb-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3">
                <Text className="text-zinc-500 text-xs font-bold mb-2">
                  Besin Değerleri
                </Text>
                <View className="flex-row justify-between">
                  <View className="items-center flex-1">
                    <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                      {recipe.nutrition.calories ?? '—'}
                    </Text>
                    <Text className="text-zinc-500 text-[10px] font-semibold">Kalori</Text>
                  </View>
                  <View className="items-center flex-1">
                    <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                      {recipe.nutrition.protein != null ? `${recipe.nutrition.protein}g` : '—'}
                    </Text>
                    <Text className="text-zinc-500 text-[10px] font-semibold">Protein</Text>
                  </View>
                  <View className="items-center flex-1">
                    <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                      {recipe.nutrition.carbs != null ? `${recipe.nutrition.carbs}g` : '—'}
                    </Text>
                    <Text className="text-zinc-500 text-[10px] font-semibold">Karbonhidrat</Text>
                  </View>
                  <View className="items-center flex-1">
                    <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                      {recipe.nutrition.fat != null ? `${recipe.nutrition.fat}g` : '—'}
                    </Text>
                    <Text className="text-zinc-500 text-[10px] font-semibold">Yağ</Text>
                  </View>
                </View>
              </View>
            )}

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
                <View className="flex flex-row flex-wrap gap-2">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <View
                      key={index}
                      className="p-2 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    >
                      <Text className="text-zinc-700 dark:text-zinc-300 text-sm">
                        {ingredient}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="flex flex-col gap-4">
                  {recipe.instructions?.map((step, index) => (
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
