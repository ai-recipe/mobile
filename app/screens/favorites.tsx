import { FavoritesSkeleton } from "@/app/(protected)/components/FavoritesSkeleton";
import { TabScreenWrapper } from "@/app/(protected)/components/TabScreenWrapper";
import { RecipeDetailModal } from "@/app/screens/components/RecipeDetailModal";
import FavoritesTab from "@/components/ai-chef-tabs/FavoritesTab";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFavoriteRecipes } from "@/store/slices/favoritesListSlice";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

const FavoritesScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { favorites, isLoading } = useAppSelector(
    (state) => state.favoritesList,
  );

  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (favorites.length === 0) {
        dispatch(fetchFavoriteRecipes({ page: 1, perPage: 10 }));
      }
    }, [dispatch, favorites.length]),
  );

  const handleOpenRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedRecipe(null), 300);
  };

  if (isLoading && favorites.length === 0) {
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
          {t("favorites.title")}{" "}
          <Text className="text-[#f39849]">{t("favorites.titleHighlight")}</Text>
        </Text>
      }
    >
      <TabScreenWrapper>
        <View className="flex-1 dark:bg-zinc-900 px-5 pt-4">
          <FavoritesTab onOpenRecipe={handleOpenRecipe} />
        </View>

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

export default FavoritesScreen;
