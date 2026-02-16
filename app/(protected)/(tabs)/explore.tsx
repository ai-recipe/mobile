import { TabScreenWrapper } from "@/app/(protected)/(tabs)/components/TabScreenWrapper";
import { RecipeDetailModal } from "@/app/screens/components/RecipeDetailModal";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { TabSwitcher } from "@/components/TabSwitcher";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchRecommendedRecipes,
  fetchTrendingRecipes,
  loadMoreRecommendedRecipes,
  loadMoreTrendingRecipes,
} from "@/store/slices/exploreListSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { ExploreSkeleton } from "./components/ExploreSkeleton";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

const ExploreScreen = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"personalised" | "trending">(
    "personalised",
  );
  const {
    recommendedRecipes,
    isRecommendedRecipesLoading,
    isRecommendedRecipesLoadingMore,
    hasMoreRecommendedRecipes,
    recommendedRecipesMeta,

    trendingRecipes,
    isTrendingRecipesLoading,
    isTrendingRecipesLoadingMore,
    hasMoreTrendingRecipes,
    trendingRecipesMeta,
  } = useAppSelector((state) => state.exploreList);

  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Initial fetch
  useFocusEffect(
    React.useCallback(() => {
      if (activeTab === "personalised") {
        dispatch(fetchRecommendedRecipes({ page: 1, perPage: 20 }));
      } else {
        dispatch(fetchTrendingRecipes({ page: 1, perPage: 20 }));
      }
    }, [dispatch, activeTab]),
  );

  const currentRecipes =
    activeTab === "personalised" ? recommendedRecipes : trendingRecipes;
  const isLoading =
    activeTab === "personalised"
      ? isRecommendedRecipesLoading
      : isTrendingRecipesLoading;
  const isLoadingMore =
    activeTab === "personalised"
      ? isRecommendedRecipesLoadingMore
      : isTrendingRecipesLoadingMore;
  const hasMore =
    activeTab === "personalised"
      ? hasMoreRecommendedRecipes
      : hasMoreTrendingRecipes;
  const meta =
    activeTab === "personalised" ? recommendedRecipesMeta : trendingRecipesMeta;

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      if (activeTab === "personalised") {
        dispatch(
          loadMoreRecommendedRecipes({
            page: meta.page + 1,
            perPage: meta.perPage,
          }),
        );
      } else {
        dispatch(
          loadMoreTrendingRecipes({
            page: meta.page + 1,
            perPage: meta.perPage,
          }),
        );
      }
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

  return (
    <ScreenWrapper>
      <TabScreenWrapper>
        <FlatList
          data={currentRecipes}
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
                  {activeTab === "personalised" ? "Sana Özel" : "Trend olan"}{" "}
                  <Text className="text-[#f39849]">Tarifler</Text>
                </Text>
                <Text className="text-zinc-500 dark:text-zinc-400 mb-4">
                  {activeTab === "personalised"
                    ? "Kişiselleştirilmiş Yapay Zeka tarafından sana özel seçilmiş tarifler."
                    : "Topluluk tarafından en çok beğenilen ve popüler olan tarifler."}
                </Text>
              </View>

              <TabSwitcher
                options={[
                  { id: "personalised", label: "Personalised" },
                  { id: "trending", label: "Trending" },
                ]}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as any)}
              />
              {isLoading && currentRecipes?.length === 0 && <ExploreSkeleton />}
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
