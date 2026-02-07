import { RecipeDetailModal } from "@/app/screens/components/RecipeDetailModal";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRecipes, loadMoreRecipes } from "@/store/slices/recipeListSlice";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

const RecipesScreen = () => {
  const dispatch = useAppDispatch();
  const {
    recipes,
    isLoadingRecipes,
    isLoadingMore,
    hasMore,
    currentPage,
    limit,
  } = useAppSelector((state) => state.recipeList);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Initial fetch
  useFocusEffect(
    React.useCallback(() => {
      console.log("RecipesScreen focused");
      dispatch(fetchRecipes({ limit: 20, page: 1 }));
    }, [dispatch]),
  );

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      dispatch(
        loadMoreRecipes({
          limit,
          page: currentPage + 1,
          ...(searchQuery && { title: searchQuery }),
        }),
      );
    }
  };

  const handleSearch = () => {
    dispatch(fetchRecipes({ limit, page: 1, title: searchQuery }));
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

  if (isLoadingRecipes && recipes.length === 0) {
    return (
      <ScreenWrapper>
        <View className="flex-1 bg-white dark:bg-zinc-900 items-center justify-center">
          <ActivityIndicator size="large" color="#f39849" />
          <Text className="text-zinc-500 mt-4 font-semibold">
            Tarifler yükleniyor...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-white dark:bg-zinc-900 px-5 pt-4">
        <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-4">
          Üretilen <Text className="text-[#f39849]">Tarifler</Text>
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-3 mb-6 flex-1">
            <MaterialIcons name="search" size={20} color="#a1a1aa" />
            <TextInput
              placeholder="Tarif ara..."
              className="ml-2 flex-1 text-zinc-900 dark:text-white"
              placeholderTextColor="#a1a1aa"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialIcons name="clear" size={20} color="#a1a1aa" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            onPress={handleSearch}
            className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-3 mb-6"
          >
            <MaterialIcons name="search" size={20} color="#a1a1aa" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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
                    <MaterialIcons name="favorite" size={16} color="#f43f5e" />
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
    </ScreenWrapper>
  );
};
export default RecipesScreen;
