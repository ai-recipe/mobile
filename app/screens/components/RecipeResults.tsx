import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { useTranslation } from "@/node_modules/react-i18next";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addFoodLogAsync } from "@/store/slices/dailyLogsSlice";
import { resetRecipeState } from "@/store/slices/recipeSlice";
import { RecipeDetailModal } from "./RecipeDetailModal";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

interface RecipeResultsProps {
  direction?: "forward" | "backward";
}

export function RecipeResults({ direction = "forward" }: RecipeResultsProps) {
  const { t } = useTranslation();
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
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleEatIt = async (item: any) => {
    setLoadingId(item._id);
    try {
      await dispatch(
        addFoodLogAsync({
          mealName: item.title,
          calories: item.nutrition?.calories ?? 0,
          proteinGrams: item.nutrition?.protein ?? 0,
          carbsGrams: item.nutrition?.carbs ?? 0,
          fatGrams: item.nutrition?.fat ?? 0,
          quantity: 1,
          loggedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        }),
      ).unwrap();
      Alert.alert(t("recipeResults.addedTitle"), t("recipeResults.addedToLog"));
    } catch {
      Alert.alert(t("common.error"), t("common.somethingWentWrong"));
    } finally {
      setLoadingId(null);
    }
  };

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
    router.replace("/(protected)/(tabs)/");
  };

  return (
    <Animated.View entering={entering} exiting={exiting} className="flex-1">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-1">
          {t("recipeResults.title")}
        </Text>
        <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white">
          {t("recipeResults.forYou")}{" "}
          <Text className="text-[#f39849]">
            {recipes?.length} {t("recipeResults.recipe")}
          </Text>{" "}
          {t("recipeResults.found")}
        </Text>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
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
                  source={{ uri: item.imageUrl || baseImageUri || PLACEHOLDER_IMAGE }}
                  className="w-full h-full object-cover"
                />
                {(item.prepTimeMinutes != null || item.cookTimeMinutes != null) && (
                  <View className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center">
                    <MaterialIcons name="schedule" size={14} color="#f39849" />
                    <Text className="text-[#f39849] font-black text-xs ml-1">
                      {(item.prepTimeMinutes ?? 0) + (item.cookTimeMinutes ?? 0)} {t("explore.mins")}
                    </Text>
                  </View>
                )}
              </View>

              {/* Content Section */}
              <View className="p-5">
                <Text className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {item.title}
                </Text>

                {/* Time & Difficulty */}
                <View className="flex-row items-center gap-4 mb-3">
                  {(item.prepTimeMinutes != null || item.cookTimeMinutes != null) && (
                    <View className="flex-row items-center">
                      <MaterialIcons name="schedule" size={16} color="#a1a1aa" />
                      <Text className="text-zinc-500 text-xs font-bold ml-1.5">
                        {(item.prepTimeMinutes ?? 0) + (item.cookTimeMinutes ?? 0)} {t("explore.mins")}
                      </Text>
                    </View>
                  )}
                  {item.difficulty && (
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name="food-apple" size={16} color="#a1a1aa" />
                      <Text className="text-zinc-500 text-xs font-bold ml-1.5">
                        {t(`difficulty.${item.difficulty}`, { defaultValue: item.difficulty })}
                      </Text>
                    </View>
                  )}
                  {item.servings != null && (
                    <View className="flex-row items-center">
                      <MaterialIcons name="people" size={16} color="#a1a1aa" />
                      <Text className="text-zinc-500 text-xs font-bold ml-1.5">
                        {item.servings} {t("common.servings")}
                      </Text>
                    </View>
                  )}
                </View>

                {!!item.dietaryTags?.length && (
                  <View className="flex-row flex-wrap gap-2 mb-3">
                    {item.dietaryTags.map((tag: string, idx: number) => (
                      <View
                        key={idx}
                        className="bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <Text className="text-green-700 dark:text-green-400 text-xs font-semibold">
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text className="text-zinc-500 text-sm mb-3">
                  {item.description}
                </Text>

                {/* Nutrition */}
                {item.nutrition && (
                  <View className="mb-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3">
                    <Text className="text-zinc-500 text-xs font-bold mb-2">
                      {t("recipeResults.nutritionValues")}
                    </Text>
                    <View className="flex-row justify-between">
                      <View className="items-center flex-1">
                        <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                          {item.nutrition.calories ?? '—'}
                        </Text>
                        <Text className="text-zinc-500 text-[10px] font-semibold">
                          {t("mealEntry.calories")}
                        </Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                          {item.nutrition.protein != null ? `${item.nutrition.protein}g` : '—'}
                        </Text>
                        <Text className="text-zinc-500 text-[10px] font-semibold">
                          {t("mealEntry.protein")}
                        </Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                          {item.nutrition.carbs != null ? `${item.nutrition.carbs}g` : '—'}
                        </Text>
                        <Text className="text-zinc-500 text-[10px] font-semibold">
                          {t("mealEntry.carbs")}
                        </Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-zinc-900 dark:text-white text-lg font-bold">
                          {item.nutrition.fat != null ? `${item.nutrition.fat}g` : '—'}
                        </Text>
                        <Text className="text-zinc-500 text-[10px] font-semibold">
                          {t("mealEntry.fat")}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    activeOpacity={0.9}
                    className="flex-1 h-12 bg-zinc-900 dark:bg-white rounded-xl items-center justify-center flex-row gap-1.5"
                    onPress={() => handleOpenRecipe(item)}
                  >
                    <Text className="text-white dark:text-black font-bold text-sm">
                      {t("recipeResults.viewRecipe")}
                    </Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={16}
                      color={colorScheme === "dark" ? "black" : "white"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    className="flex-1 h-12 rounded-xl items-center justify-center flex-row gap-1.5"
                    style={{ backgroundColor: "#f39849" }}
                    onPress={() => handleEatIt(item)}
                    disabled={loadingId === item._id}
                  >
                    {loadingId === item._id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <MaterialCommunityIcons name="silverware-fork-knife" size={16} color="white" />
                        <Text className="text-white font-bold text-sm">
                          {t("recipeResults.eatIt")}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
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
            {t("recipeResults.exit")}
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
