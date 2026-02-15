import PlaceholderComponent from "@/components/ai-chef-tabs/PlaceholderComponent";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMoreRecipes } from "@/store/slices/recipeListSlice";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
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

interface AIChefTabProps {
  onOpenRecipe: (recipe: any) => void;
}

const AIChefTab = ({ onOpenRecipe }: AIChefTabProps) => {
  const dispatch = useAppDispatch();
  const { recipes, isLoadingRecipes, isLoadingMore, meta, hasMore } =
    useAppSelector((state) => state.recipeList);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      dispatch(
        loadMoreRecipes({
          page: meta.page + 1,
          perPage: meta.perPage,
        }),
      );
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#f39849" />
      </View>
    );
  };

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        isLoadingRecipes ? null : (
          <PlaceholderComponent searchQuery="" setSearchQuery={() => {}} />
        )
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          className="mb-6 bg-white dark:bg-zinc-800 rounded-[28px] overflow-hidden border border-zinc-100 dark:border-zinc-700"
          onPress={() => onOpenRecipe(item)}
        >
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
          </View>

          <View className="p-5">
            <Text className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              {item.title}
            </Text>
            <Text className="text-zinc-500 text-sm mb-3" numberOfLines={2}>
              {item.description}
            </Text>
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center">
                <MaterialIcons name="schedule" size={16} color="#a1a1aa" />
                <Text className="text-zinc-500 text-xs font-bold ml-1.5">
                  {item.totalTimeMinutes} dk
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="restaurant" size={16} color="#a1a1aa" />
                <Text className="text-zinc-500 text-xs font-bold ml-1.5 capitalize">
                  {item.difficulty}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default AIChefTab;
