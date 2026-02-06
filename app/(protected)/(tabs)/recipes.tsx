import { ScreenWrapper } from "@/components/ScreenWrapper";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

const STATIC_RECIPES = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    title: "Mediterranean Salad",
    description:
      "Fresh and healthy salad with tomatoes, cucumber, and feta cheese",
    imageUrl: null,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    totalTimeMinutes: 10,
    difficulty: "EASY",
    servings: 4,
    matchPercentage: 20,
    ingredients: ["tomato"],
    steps: ["Chop vegetables", "Mix and serve"],
    dietaryTags: ["VEGETARIAN", "LOW_CARB", "GLUTEN_FREE"],
    nutritionSummary: {
      calories: 180,
      protein: 8,
      carbs: 12,
      fat: 14,
    },
  },
];

const RecipesScreen = () => {
  return (
    <ScreenWrapper>
      <View className="flex-1 bg-white dark:bg-zinc-900 px-5 pt-4">
        <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-4">
          Üretilen <Text className="text-[#f39849]">Tarifler</Text>
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-3 mb-6">
          <MaterialIcons name="search" size={20} color="#a1a1aa" />
          <TextInput
            placeholder="Tarif ara..."
            className="ml-2 flex-1 text-zinc-900 dark:text-white"
            placeholderTextColor="#a1a1aa"
          />
        </View>

        <FlatList
          data={STATIC_RECIPES}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-6 bg-white dark:bg-zinc-800 rounded-[28px] overflow-hidden border border-zinc-100 dark:border-zinc-700"
              onPress={() => router.push(`/screens/recipe/${item.id}`)}
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
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="account-group"
                      size={16}
                      color="#a1a1aa"
                    />
                    <Text className="text-zinc-500 text-xs font-bold ml-1.5">
                      {item.servings} Kişilik
                    </Text>
                  </View>
                </View>

                {/* Dietary Tags */}
                {item.dietaryTags.length > 0 && (
                  <View className="mb-3">
                    <View className="flex-row flex-wrap gap-2">
                      {item.dietaryTags.map((tag, idx) => (
                        <View
                          key={idx}
                          className="bg-purple-100 dark:bg-purple-900/30 px-2.5 py-1 rounded-lg"
                        >
                          <Text className="text-purple-700 dark:text-purple-400 text-xs font-semibold">
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Nutrition Summary */}
                <View className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3">
                  <Text className="text-zinc-500 text-xs font-bold mb-2">
                    Besin Değerleri
                  </Text>
                  <View className="flex-row justify-between">
                    <View className="items-center flex-1">
                      <Text className="text-zinc-900 dark:text-white text-base font-bold">
                        {item.nutritionSummary.calories}
                      </Text>
                      <Text className="text-zinc-500 text-[10px] font-semibold">
                        Kalori
                      </Text>
                    </View>
                    <View className="items-center flex-1">
                      <Text className="text-zinc-900 dark:text-white text-base font-bold">
                        {item.nutritionSummary.protein}g
                      </Text>
                      <Text className="text-zinc-500 text-[10px] font-semibold">
                        Protein
                      </Text>
                    </View>
                    <View className="items-center flex-1">
                      <Text className="text-zinc-900 dark:text-white text-base font-bold">
                        {item.nutritionSummary.carbs}g
                      </Text>
                      <Text className="text-zinc-500 text-[10px] font-semibold">
                        Karbonhidrat
                      </Text>
                    </View>
                    <View className="items-center flex-1">
                      <Text className="text-zinc-900 dark:text-white text-base font-bold">
                        {item.nutritionSummary.fat}g
                      </Text>
                      <Text className="text-zinc-500 text-[10px] font-semibold">
                        Yağ
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenWrapper>
  );
};
export default RecipesScreen;
