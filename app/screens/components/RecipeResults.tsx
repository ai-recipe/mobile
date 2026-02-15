import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetRecipeState } from "@/store/slices/recipeSlice";
import { RecipeDetailModal } from "./RecipeDetailModal";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

interface RecipeResultsProps {
  direction?: "forward" | "backward";
}

export function RecipeResults({ direction = "forward" }: RecipeResultsProps) {
  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;

  const { recipes, baseImageUri, suggestions } = useAppSelector(
    (state: any) => state.recipe,
  );

  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedRecipe(null), 300);
  };

  const handleExit = () => {
    dispatch(resetRecipeState());
    router.replace("/(protected)/(tabs)/ai-chef");
  };

  return (
    <Animated.View entering={entering} exiting={exiting} className="flex-1">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-1">
          Sonuçlar Hazır
        </Text>
        <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white">
          Sizin İçin{" "}
          <Text className="text-[#f39849]">{recipes?.length} Tarif</Text> Bulduk
        </Text>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 120,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 200).springify()}
            className="bg-white dark:bg-zinc-800 rounded-[28px] mb-6 border border-zinc-100 dark:border-zinc-700 overflow-hidden"
          >
            <Pressable onPress={() => handleOpenRecipe(item)}>
              {/* Image Section */}
              <View className="h-48 relative">
                <Image
                  source={{
                    uri: item.imageUrl || baseImageUri || PLACEHOLDER_IMAGE,
                  }}
                  className="w-full h-full object-cover"
                />
                <View className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center">
                  <MaterialIcons name="schedule" size={14} color="#f39849" />
                  <Text className="text-[#f39849] font-black text-xs ml-1">
                    {item.totalTimeMinutes} dk
                  </Text>
                </View>
              </View>

              {/* Content Section */}
              <View className="p-5">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-xl font-bold text-zinc-900 dark:text-white flex-1 mr-2">
                    {item.title}
                  </Text>
                  <View className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-md">
                    <Text className="text-green-700 dark:text-green-400 text-[10px] font-bold">
                      %{item.matchPercentage.toFixed(0)} Uyum
                    </Text>
                  </View>
                </View>

                {/* Time & Ingredients Header */}
                <View className="flex-row items-center gap-4 mb-2">
                  <View className="flex-row items-center">
                    <MaterialIcons name="schedule" size={16} color="#a1a1aa" />
                    <Text className="text-zinc-500 text-xs font-bold ml-1.5">
                      {item.totalTimeMinutes} dk
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="food-apple"
                      size={16}
                      color="#a1a1aa"
                    />
                    <Text className="text-zinc-500 text-xs font-bold ml-1.5">
                      {item.difficulty}
                    </Text>
                  </View>
                </View>

                {/* Matched Ingredients */}
                {item.matchedIngredients?.length > 0 && (
                  <View className="mb-3">
                    <Text className="text-zinc-500 text-xs font-bold mb-1.5">
                      Eşleşen Malzemeler
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {item.matchedIngredients.map(
                        (ingredient: string, idx: number) => (
                          <View
                            key={idx}
                            className="bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-lg flex-row items-center"
                          >
                            <Text className="text-green-700 dark:text-green-400 text-xs font-semibold ml-1">
                              {ingredient}
                            </Text>
                          </View>
                        ),
                      )}
                    </View>
                  </View>
                )}

                {/* Missing Ingredients */}
                {item.missingIngredients?.length > 0 && (
                  <View className="mb-3">
                    <Text className="text-zinc-500 text-xs font-bold mb-1.5">
                      Eksik Malzemeler
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {item.missingIngredients.map(
                        (ingredient: string, idx: number) => (
                          <View
                            key={idx}
                            className="bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-lg flex-row items-center"
                          >
                            <Text className="text-amber-700 dark:text-amber-400 text-xs font-semibold ml-1">
                              {ingredient}
                            </Text>
                          </View>
                        ),
                      )}
                    </View>
                  </View>
                )}

                <Text className="text-zinc-500 text-sm mb-3">
                  {item.description}
                </Text>

                {/* Nutrition Summary */}
                {item.nutritionSummary && (
                  <View className="mb-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3">
                    <Text className="text-zinc-500 text-xs font-bold mb-2">
                      Besin Değerleri
                    </Text>
                    <View className="flex-row justify-between">
                      <View className="items-center flex-1">
                        <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                          {item.nutritionSummary.calories}
                        </Text>
                        <Text className="text-zinc-500 text-[10px] font-semibold">
                          Kalori
                        </Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                          {item.nutritionSummary.protein}g
                        </Text>
                        <Text className="text-zinc-500 text-[10px] font-semibold">
                          Protein
                        </Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                          {item.nutritionSummary.carbs}g
                        </Text>
                        <Text className="text-zinc-500 text-[10px] font-semibold">
                          Karbonhidrat
                        </Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                          {item.nutritionSummary.fat}g
                        </Text>
                        <Text className="text-zinc-500 text-[10px] font-semibold">
                          Yağ
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Action Button */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  className="w-full h-12 bg-zinc-900 dark:bg-white rounded-xl items-center justify-center flex-row gap-2"
                  onPress={() => handleOpenRecipe(item)}
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
            </Pressable>
          </Animated.View>
        )}
      />

      {/* Fixed Exit Button */}
      <View className="absolute bottom-0 left-0 right-0 p-5 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
        <TouchableOpacity
          onPress={handleExit}
          activeOpacity={0.9}
          className="w-full h-14 bg-transparent border-2 border-zinc-900 dark:border-white rounded-2xl items-center justify-center flex-row gap-2"
        >
          <MaterialIcons
            name="close"
            size={20}
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Text className="text-zinc-900 dark:text-white font-bold text-base">
            Çıkış
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          visible={modalVisible}
          onClose={handleCloseModal}
          recipe={selectedRecipe}
          baseImageUri={baseImageUri}
        />
      )}
    </Animated.View>
  );
}
