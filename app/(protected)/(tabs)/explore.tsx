import { RecipeDetailModal } from "@/app/screens/components/RecipeDetailModal";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchExploreRecipes,
  loadMoreExploreRecipes,
} from "@/store/slices/exploreListSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

const CATEGORIES = [
  { id: "all", label: "Hepsi", icon: "restaurant" },
  { id: "breakfast", label: "Kahvaltı", icon: "dark-mode" },
  { id: "vegan", label: "Vegan", icon: "eco" },
  { id: "practical", label: "Pratik", icon: "timer" },
  { id: "dessert", label: "Tatlı", icon: "cake" },
];

const ExploreScreen = () => {
  const dispatch = useAppDispatch();
  const { recipes, isLoading, isLoadingMore, hasMore, offset, limit } =
    useAppSelector((state) => state.exploreList);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Initial fetch
  useFocusEffect(
    React.useCallback(() => {
      console.log("ExploreScreen focused");
      dispatch(fetchExploreRecipes({ limit: 20, offset: 0 }));
    }, [dispatch]),
  );

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      dispatch(
        loadMoreExploreRecipes({
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
      <View className="py-8">
        <ActivityIndicator size="large" color="#f39849" />
      </View>
    );
  };

  if (isLoading && recipes.length === 0) {
    return (
      <ScreenWrapper>
        <View className="flex-1 bg-white dark:bg-zinc-900 items-center justify-center">
          <ActivityIndicator size="large" color="#f39849" />
          <Text className="text-zinc-500 mt-4 font-semibold">
            Size özel tarifler hazırlanıyor...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  const featuredRecipe = recipes[0];
  const gridRecipes = recipes.slice(1);

  return (
    <ScreenWrapper>
      <FlatList
        data={gridRecipes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: 20, gap: 16 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={() => (
          <View className="pt-4">
            {/* Header Title */}
            <View className="px-5 mb-6">
              <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                Yeni Tatlar <Text className="text-[#f39849]">Keşfet</Text>
              </Text>
            </View>

            {/* Search Bar */}
            <View className="px-5 mb-8">
              <View className="flex-row items-center bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-3.5">
                <MaterialIcons name="search" size={22} color="#a1a1aa" />
                <TextInput
                  placeholder="Tarif, malzeme veya mutfak ara..."
                  className="ml-3 flex-1 text-zinc-900 dark:text-white text-[15px]"
                  placeholderTextColor="#a1a1aa"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              className="mb-8"
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  className={`mr-3 px-6 py-3 rounded-2xl flex-row items-center ${
                    selectedCategory === cat.id
                      ? "bg-[#f39849]"
                      : "bg-zinc-100 dark:bg-zinc-800"
                  }`}
                >
                  <Text
                    className={`font-bold text-sm ${
                      selectedCategory === cat.id
                        ? "text-white"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Trend Section */}
            {featuredRecipe && (
              <View className="px-5 mb-10">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-xl font-bold text-zinc-900 dark:text-white">
                    Trend Olanlar
                  </Text>
                  {false && (
                    <TouchableOpacity>
                      <Text className="text-[#f39849] font-bold text-sm">
                        Tümünü Gör
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => handleOpenRecipe(featuredRecipe)}
                  className="relative h-64 w-full rounded-[32px] overflow-hidden shadow-xl"
                  activeOpacity={0.9}
                >
                  <Image
                    source={{
                      uri: featuredRecipe.imageUrl || PLACEHOLDER_IMAGE,
                    }}
                    className="w-full h-full object-cover"
                  />
                  <View className="absolute inset-0 bg-black/40" />
                  <View className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center">
                    <MaterialIcons name="timer" size={14} color="#f39849" />
                    <Text className="text-[#f39849] font-black text-xs ml-1">
                      {featuredRecipe.totalTimeMinutes} dk
                    </Text>
                  </View>
                  <View className="absolute bottom-6 left-6 right-6">
                    <Text className="text-orange-400 text-[10px] font-black uppercase tracking-[2px] mb-1">
                      Popüler
                    </Text>
                    <Text className="text-white text-2xl font-black leading-tight">
                      {featuredRecipe.title}
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
                          {featuredRecipe.difficulty}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
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
                  <MaterialIcons name="restaurant" size={12} color="#f39849" />
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
    </ScreenWrapper>
  );
};

export default ExploreScreen;
