import { FavoritesSkeleton } from "@/app/(protected)/(tabs)/components/FavoritesSkeleton";
import { TabScreenWrapper } from "@/app/(protected)/(tabs)/components/TabScreenWrapper";
import { RecipeDetailModal } from "@/app/screens/components/RecipeDetailModal";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchFavoriteRecipes,
  loadMoreFavorites,
} from "@/store/slices/favoritesListSlice";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

const PlaceholderComponent = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center pt-16 px-10">
      <View className="size-24 bg-orange-100 dark:bg-orange-500/10 rounded-full items-center justify-center mb-6">
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={48}
          color="#f39849"
        />
      </View>
      <Text className="text-2xl font-black text-zinc-900 dark:text-white text-center mb-3">
        {searchQuery ? "Tarif bulunamadı" : "Henüz Tarif Üretilmemiş"}
      </Text>
      <Text className="text-zinc-500 dark:text-zinc-400 text-center leading-relaxed font-medium mb-8">
        {searchQuery
          ? "Aradığınız tarife uygun tarif bulunamadı."
          : "Henüz favori tarifiniz bulunamadı."}
      </Text>
      <TouchableOpacity
        onPress={() => {
          if (searchQuery) {
            setSearchQuery("");
          } else {
            router.push("/(protected)/(tabs)/explore");
          }
        }}
        className="bg-[#f39849] px-8 py-4 rounded-3xl shadow-lg shadow-orange-200 dark:shadow-none"
      >
        <Text className="text-white font-black text-base uppercase tracking-wider">
          {searchQuery ? "Tarif Ara" : "Tarifleri Keşfet"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const FavoritesScreen = () => {
  const dispatch = useAppDispatch();
  const {
    favorites: recipes,
    isLoading,
    isLoadingMore,
    hasMore,
    offset,
    limit,
  } = useAppSelector((state) => state.favoritesList);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Initial fetch
  useFocusEffect(
    React.useCallback(() => {
      console.log("FavoritesScreen focused");
      dispatch(fetchFavoriteRecipes({ limit: 20, offset: 0 }));
    }, [dispatch]),
  );

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      dispatch(
        loadMoreFavorites({
          limit,
          offset: offset + limit,
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

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="large" color="#f39849" />
      </View>
    );
  };

  if (isLoading && recipes.length === 0) {
    return (
      <ScreenWrapper>
        <TabScreenWrapper>
          <FavoritesSkeleton />
        </TabScreenWrapper>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <TabScreenWrapper>
        <View className="flex-1 bg-white dark:bg-zinc-900 px-5 pt-4">
          <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
            Favori <Text className="text-[#f39849]">Tariflerim</Text>
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-400 mb-4">
            Favoriye eklediğiniz tarifleri buradan görüntüleyebilirsiniz.
          </Text>

          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              isLoading ? null : (
                <PlaceholderComponent
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              )
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                className="mb-6 bg-white dark:bg-zinc-800 rounded-[28px] overflow-hidden border border-zinc-100 dark:border-zinc-700"
                onPress={() => handleOpenRecipe(item)}
              >
                {/* Image Section */}
                <View className="h-48 relative">
                  <Image
                    source={{ uri: item.imageUrl || PLACEHOLDER_IMAGE }}
                    className="w-full h-full object-cover"
                  />
                  <View className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center">
                    <MaterialIcons name="schedule" size={14} color="#f39849" />
                    <Text className="text-[#f39849] font-black text-xs ml-1">
                      {item.totalTimeMinutes} dk
                    </Text>
                  </View>
                  {item.isFavorite && (
                    <View className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-1.5 rounded-full">
                      <MaterialIcons
                        name="favorite"
                        size={16}
                        color="#f43f5e"
                      />
                    </View>
                  )}
                </View>

                {/* Content Section */}
                <View className="p-5">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-xl font-bold text-zinc-900 dark:text-white flex-1 mr-2">
                      {item.title}
                    </Text>
                  </View>

                  <Text className="text-zinc-500 text-sm mb-3">
                    {item.description}
                  </Text>

                  {/* Quick Info */}
                  <View className="flex-row items-center gap-4 mb-3">
                    <View className="flex-row items-center">
                      <MaterialIcons
                        name="schedule"
                        size={16}
                        color="#a1a1aa"
                      />
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
                </View>
              </TouchableOpacity>
            )}
          />
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
export default FavoritesScreen;
