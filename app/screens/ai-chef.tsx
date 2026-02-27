import { FavoritesSkeleton } from "@/app/(protected)/(tabs)/components/FavoritesSkeleton";
import { TabScreenWrapper } from "@/app/(protected)/(tabs)/components/TabScreenWrapper";
import { RecipeDetailModal } from "@/app/screens/components/RecipeDetailModal";
import AIChefTab from "@/components/ai-chef-tabs/AIChefTab";
import FavoritesTab from "@/components/ai-chef-tabs/FavoritesTab";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFavoriteRecipes } from "@/store/slices/favoritesListSlice";
import { fetchRecipes } from "@/store/slices/recipeListSlice";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

const AIChefScreen = () => {
  const dispatch = useAppDispatch();
  const { favorites, isLoading: favoritesLoading } = useAppSelector(
    (state) => state.favoritesList,
  );
  const { recipes, isLoadingRecipes } = useAppSelector(
    (state) => state.recipeList,
  );

  const [activeTab, setActiveTab] = React.useState("recents");
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (activeTab === "recents" && recipes.length === 0) {
      dispatch(fetchRecipes({ page: 1, perPage: 20 }));
    } else if (activeTab === "favorites" && favorites.length === 0) {
      dispatch(fetchFavoriteRecipes({ page: 1, perPage: 20 }));
    }
  }, [activeTab, dispatch, recipes.length, favorites.length]);

  const handleOpenRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedRecipe(null), 300);
  };

  if (
    (activeTab === "favorites" && favoritesLoading && favorites.length === 0) ||
    (activeTab === "recents" && isLoadingRecipes && recipes.length === 0)
  ) {
    return (
      <ScreenWrapper withTabNavigation={false}>
        <TabScreenWrapper>
          <FavoritesSkeleton />
        </TabScreenWrapper>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      withTabNavigation={false}
      showTopNavBar={false}
      showBackButton={true}
      title={
        <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
          AI Chef <Text className="text-[#f39849]">Tarifleri</Text>
        </Text>
      }
    >
      <TabScreenWrapper>
        <View className="flex-1 bg-white dark:bg-zinc-900 px-5 pt-4">
          <View className=" mb-4 mt-4">
            <View className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1 flex-row">
              <Pressable
                onPress={() => setActiveTab("recents")}
                className={`flex-1 py-3 rounded-xl ${
                  activeTab === "recents"
                    ? "bg-white dark:bg-zinc-800"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    activeTab === "recents"
                      ? "text-[#f39849]"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  AI Chef Tarifleri
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveTab("favorites")}
                className={`flex-1 py-3 rounded-xl ${
                  activeTab === "favorites"
                    ? "bg-white dark:bg-zinc-800"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    activeTab === "favorites"
                      ? "text-[#f39849]"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  Favorilerim
                </Text>
              </Pressable>
            </View>
          </View>
          {activeTab === "recents" ? (
            <AIChefTab onOpenRecipe={handleOpenRecipe} />
          ) : (
            <FavoritesTab onOpenRecipe={handleOpenRecipe} />
          )}
        </View>

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
export default AIChefScreen;
