import { ExploreSkeleton } from "@/app/(protected)/(tabs)/components/ExploreSkeleton";
import { TabScreenWrapper } from "@/app/(protected)/(tabs)/components/TabScreenWrapper";
import { RecipeDetailModal } from "@/app/screens/components/RecipeDetailModal";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchRecommendedRecipes,
  fetchTrendingRecipes,
  loadMoreRecommendedRecipes,
} from "@/store/slices/exploreListSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

const ExploreScreen = () => {
  const dispatch = useAppDispatch();
  const {
    trendingRecipes,
    recommendedRecipes,
    isTrendingRecipesLoading,
    isRecommendedRecipesLoading,
    isRecommendedRecipesLoadingMore,
    hasMoreRecommendedRecipes,
    recommendedRecipesMeta,
  } = useAppSelector((state) => state.exploreList);

  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Initial fetch
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchTrendingRecipes({ page: 1, perPage: 5 }));
      dispatch(fetchRecommendedRecipes({ page: 1, perPage: 20 }));
    }, [dispatch]),
  );

  const handleLoadMore = () => {
    if (!isRecommendedRecipesLoadingMore && hasMoreRecommendedRecipes) {
      dispatch(
        loadMoreRecommendedRecipes({
          page: recommendedRecipesMeta.page + 1,
          perPage: recommendedRecipesMeta.perPage,
        }),
      );
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

  if (
    (isTrendingRecipesLoading || isRecommendedRecipesLoading) &&
    trendingRecipes.length === 0 &&
    recommendedRecipes.length === 0
  ) {
    return (
      <TabScreenWrapper>
        <ScreenWrapper>
          <ExploreSkeleton />
        </ScreenWrapper>
      </TabScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <TabScreenWrapper>
        <FlatList
          data={recommendedRecipes}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 20, gap: 16 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={() => (
            <View className="pt-4">
              {/* Header Title */}
              <View className="px-5 mb-6">
                <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                  Sana Özel <Text className="text-[#f39849]">Tarifler</Text>
                </Text>
                <Text className="text-zinc-500 dark:text-zinc-400 mb-4">
                  Kişiselleştirilmiş Yapay Zeka tarafından sana özel seçilmiş
                  tarifler.
                </Text>
              </View>

              {trendingRecipes.length > 0 && (
                <View className="mb-10">
                  <View className="flex-row items-center justify-between mb-4 px-5">
                    <Text className="text-xl font-bold text-zinc-900 dark:text-white">
                      Trend Olanlar
                    </Text>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
                  >
                    {trendingRecipes.map((recipe) => (
                      <TouchableOpacity
                        key={recipe.id}
                        onPress={() => handleOpenRecipe(recipe)}
                        className="relative h-64 w-[300px] rounded-[32px] overflow-hidden shadow-xl"
                        activeOpacity={0.9}
                      >
                        <Image
                          source={{
                            uri: recipe.imageUrl || PLACEHOLDER_IMAGE,
                          }}
                          className="w-full h-full object-cover"
                        />
                        <View className="absolute inset-0 bg-black/40" />
                        <View className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center">
                          <MaterialIcons
                            name="timer"
                            size={14}
                            color="#f39849"
                          />
                          <Text className="text-[#f39849] font-black text-xs ml-1">
                            {recipe.totalTimeMinutes} dk
                          </Text>
                        </View>
                        <View className="absolute bottom-6 left-6 right-6">
                          <Text className="text-orange-400 text-[10px] font-black uppercase tracking-[2px] mb-1">
                            Popüler
                          </Text>
                          <Text className="text-white text-2xl font-black leading-tight">
                            {recipe.title}
                          </Text>
                          <View className="flex-row items-center mt-3 gap-4">
                            <View className="flex-row items-center">
                              <MaterialIcons
                                name="local-fire-department"
                                size={14}
                                color="#d1d5db"
                              />
                              <Text className="text-gray-300 text-xs font-bold ml-1">
                                450 kcal
                              </Text>
                            </View>
                            <View className="flex-row items-center">
                              <MaterialIcons
                                name="signal-cellular-alt"
                                size={14}
                                color="#d1d5db"
                              />
                              <Text className="text-gray-300 text-xs font-bold ml-1">
                                {recipe.difficulty}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Recommendations Title */}
              <View className="px-5 mb-6">
                <Text className="text-xl font-bold text-zinc-900 dark:text-white">
                  Sana Özel Öneriler
                </Text>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-1 mb-6 bg-white dark:bg-zinc-800 rounded-[24px] overflow-hidden border border-zinc-100 dark:border-zinc-700 shadow-sm"
              onPress={() => handleOpenRecipe(item)}
              activeOpacity={0.7}
            >
              <View className="h-40 relative">
                <Image
                  source={{ uri: item.imageUrl || PLACEHOLDER_IMAGE }}
                  className="w-full h-full object-cover"
                />
                <View className="absolute top-2 right-2 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm px-2 py-1 rounded-full flex-row items-center">
                  <MaterialIcons name="timer" size={10} color="#f39849" />
                  <Text className="text-[#f39849] font-black text-[10px] ml-1">
                    {item.totalTimeMinutes} dk
                  </Text>
                </View>
              </View>
              <View className="p-3">
                <Text
                  className="font-bold text-sm text-zinc-900 dark:text-white mb-2"
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <MaterialIcons
                      name="restaurant"
                      size={12}
                      color="#f39849"
                    />
                    <Text className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold ml-1">
                      {item.difficulty}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">
                    320 kcal
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <RecipeDetailModal
            visible={modalVisible}
            onClose={handleCloseModal}
            recipe={selectedRecipe}
            baseImageUri={selectedRecipe.imageUrl || PLACEHOLDER_IMAGE}
          />
        )}
      </TabScreenWrapper>
    </ScreenWrapper>
  );
};

export default ExploreScreen;
