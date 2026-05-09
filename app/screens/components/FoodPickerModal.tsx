import { FoodItem } from "@/api/foods";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  DietFilter,
  fetchFoodsAsync,
  fetchMoreFoodsAsync,
  resetFoodPicker,
  setFilter,
  setSearch,
} from "@/store/slices/foodPickerSlice";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FoodPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (food: FoodItem) => void;
}

const FILTERS: { key: DietFilter; labelKey: string; fallback: string }[] = [
  { key: "all", labelKey: "foodPicker.filter.all", fallback: "All" },
  { key: "vegan", labelKey: "foodPicker.filter.vegan", fallback: "Vegan" },
  {
    key: "vegetarian",
    labelKey: "foodPicker.filter.vegetarian",
    fallback: "Vegetarian",
  },
  {
    key: "glutenFree",
    labelKey: "foodPicker.filter.glutenFree",
    fallback: "Gluten-Free",
  },
];

function FoodCard({ food, onPress }: { food: FoodItem; onPress: () => void }) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const calories = food.nutrition?.calories?.amount;
  const protein = food.nutrition?.protein?.amount;
  const carbs = food.nutrition?.carbohydrates?.amount;
  const fat = food.nutrition?.fat?.amount;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-3 mb-2.5 active:opacity-70"
    >
      <View className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-700 overflow-hidden items-center justify-center flex-shrink-0">
        {food.images?.[0] ? (
          <Image
            source={{ uri: food.images[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <MaterialIcons
            name="fastfood"
            size={24}
            color={isDark ? "#52525b" : "#a1a1aa"}
          />
        )}
      </View>

      <View className="flex-1 px-3">
        <Text
          className="text-sm font-bold text-zinc-900 dark:text-white mb-2"
          numberOfLines={1}
        >
          {food.name} / {food.servingSize} {food.servingUnit}
        </Text>

        <View className="flex-row gap-3">
          {protein != null && (
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <Text className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {Math.round(protein)}g {t("mealEntry.protein")}
              </Text>
            </View>
          )}
          {carbs != null && (
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <Text className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {Math.round(carbs)}g {t("mealEntry.carbs")}
              </Text>
            </View>
          )}
          {fat != null && (
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-[#f39849]" />
              <Text className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {Math.round(fat)}g {t("mealEntry.fat")}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="items-end flex-shrink-0 ml-1">
        {calories != null && (
          <>
            <Text className="text-base font-bold text-zinc-900 dark:text-white">
              {Math.round(calories)}
            </Text>
            <Text className="text-[10px] text-zinc-400 dark:text-zinc-500">
              kcal
            </Text>
          </>
        )}
        <MaterialIcons
          name="chevron-right"
          size={18}
          color="#a1a1aa"
          style={{ marginTop: 4 }}
        />
      </View>
    </Pressable>
  );
}

export function FoodPickerModal({
  visible,
  onClose,
  onSelect,
}: FoodPickerModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useAppDispatch();

  const { items, isLoading, isLoadingMore, hasError, search, activeFilter } =
    useAppSelector((s) => s.foodPicker);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      dispatch(resetFoodPicker());
      dispatch(fetchFoodsAsync());
    }
  }, [visible, dispatch]);

  const handleSearchChange = (text: string) => {
    dispatch(setSearch(text));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(fetchFoodsAsync());
    }, 400);
  };

  const handleFilterChange = (filter: DietFilter) => {
    dispatch(setFilter(filter));
    dispatch(fetchFoodsAsync());
  };

  const handleLoadMore = () => {
    !isLoadingMore && dispatch(fetchMoreFoodsAsync());
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 bg-white dark:bg-zinc-900"
        style={{ paddingTop: insets.top || 16 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 pb-3">
          <Pressable
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center"
            hitSlop={8}
          >
            <MaterialIcons
              name="close"
              size={20}
              color={isDark ? "#ffffff" : "#18181b"}
            />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-bold text-zinc-900 dark:text-white">
            {t("foodPicker.title")}
          </Text>
          <View className="w-10" />
        </View>

        {/* Search bar */}
        <View className="px-4 pb-3">
          <View className="flex-row items-center bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 h-12 gap-3">
            <MaterialIcons
              name="search"
              size={20}
              color={isDark ? "#71717a" : "#a1a1aa"}
            />
            <TextInput
              value={search}
              onChangeText={handleSearchChange}
              placeholder={t("foodPicker.searchPlaceholder")}
              placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
              className="flex-1 text-sm text-zinc-900 dark:text-white"
              returnKeyType="search"
              clearButtonMode="while-editing"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {isLoading && <ActivityIndicator size="small" color="#f39849" />}
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-grow-0 mb-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 8,
            paddingBottom: 8,
          }}
        >
          {FILTERS.map((f) => {
            const active = activeFilter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => handleFilterChange(f.key)}
                className={`px-4 py-2 rounded-full border h-8 ${
                  active
                    ? "bg-[#f39849] border-[#f39849]"
                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    active ? "text-white" : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {t(f.labelKey, f.fallback)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View className="h-px bg-zinc-100 dark:bg-zinc-800 mb-1" />

        {/* Error state */}
        {hasError ? (
          <View className="flex-1 items-center justify-center px-8 gap-3">
            <MaterialIcons
              name="wifi-off"
              size={48}
              color={isDark ? "#52525b" : "#d4d4d8"}
            />
            <Text className="text-base font-bold text-zinc-900 dark:text-white text-center">
              Couldn't load foods
            </Text>
            <Text className="text-sm text-zinc-400 dark:text-zinc-500 text-center">
              Check your connection and try again
            </Text>
            <Pressable
              onPress={() => dispatch(fetchFoodsAsync())}
              className="mt-2 bg-[#f39849] px-6 py-3 rounded-full"
            >
              <Text className="text-white font-bold text-sm">Retry</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <FoodCard food={item} onPress={() => onSelect(item)} />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: insets.bottom + 32,
            }}
            ListEmptyComponent={
              !isLoading ? (
                <View className="items-center justify-center py-20 px-8 gap-3">
                  <MaterialIcons
                    name="search-off"
                    size={52}
                    color={isDark ? "#52525b" : "#d4d4d8"}
                  />
                  <Text className="text-base font-bold text-zinc-900 dark:text-white text-center">
                    {t("foodPicker.noResults")}
                  </Text>
                  <Text className="text-sm text-zinc-400 dark:text-zinc-500 text-center">
                    {t("foodPicker.noResultsSub")}
                  </Text>
                </View>
              ) : null
            }
            ListFooterComponent={
              isLoadingMore ? (
                <View className="py-5 items-center">
                  <ActivityIndicator color="#f39849" />
                </View>
              ) : null
            }
          />
        )}

        {/* Full-page spinner on initial load */}
        {isLoading && items.length === 0 && !hasError && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator size="large" color="#f39849" />
            <Text className="text-sm text-zinc-400 dark:text-zinc-500 mt-3">
              {t("foodPicker.loading")}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}
