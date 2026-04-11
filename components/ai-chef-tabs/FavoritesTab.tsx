import PlaceholderComponent from "@/components/ai-chef-tabs/PlaceholderComponent";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMoreFavorites } from "@/store/slices/favoritesListSlice";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PLACEHOLDER_IMAGE = "/assets/images/food_placeholder.jpg";

interface FavoritesTabProps {
  onOpenRecipe: (recipe: any) => void;
}

const FavoritesTab = ({ onOpenRecipe }: FavoritesTabProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { favorites, isLoading, isLoadingMore, meta, hasMore } = useAppSelector(
    (state) => state.favoritesList,
  );

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      dispatch(
        loadMoreFavorites({
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
      data={favorites}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        isLoading ? null : (
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
              source={
                item.imageUrl
                  ? { uri: item.imageUrl }
                  : require("@/assets/images/food_placeholder.jpg")
              }
              className="w-full h-full object-cover"
            />
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
                  {item.totalTimeMinutes} {t("minutes")}
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

export default FavoritesTab;
