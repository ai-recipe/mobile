import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

import type { RecipeFromAPI } from "@/api/recipe";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

interface RecipeResultsProps {
  recipes: RecipeFromAPI[];
  baseImageUri: string;
  colorScheme: "light" | "dark" | null | undefined;
  direction?: "forward" | "backward";
}

export function RecipeResults({
  recipes,
  baseImageUri,
  colorScheme,
  direction = "forward",
}: RecipeResultsProps) {
  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;

  return (
    <Animated.View entering={entering} exiting={exiting} className="flex-1">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-1">
          Sonuçlar Hazır
        </Text>
        <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white">
          Sizin İçin{" "}
          <Text className="text-[#f39849]">{recipes.length} Tarif</Text> Bulduk
        </Text>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 200).springify()}
            className="bg-white dark:bg-zinc-800 rounded-[28px] mb-6 border border-zinc-100 dark:border-zinc-700 overflow-hidden"
          >
            {/* Image Section */}
            <View className="h-48 relative">
              <Image
                source={{
                  uri: item.imageUrl || baseImageUri || PLACEHOLDER_IMAGE,
                }}
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
                <View className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-md">
                  <Text className="text-green-700 dark:text-green-400 text-[10px] font-bold">
                    %{item.matchPercentage.toFixed(0)} Uyum
                  </Text>
                </View>
              </View>

              {/* Time & Ingredients Header */}
              <View className="flex-row items-center gap-4 mb-2">
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

              {item.matchedIngredients?.length > 0 && (
                <View className="mb-4">
                  <Text className="text-zinc-500 text-xs font-bold mb-1.5">
                    Malzemeler
                  </Text>
                  <Text className="text-zinc-700 dark:text-zinc-300 text-sm">
                    {item.matchedIngredients.join(", ")}
                  </Text>
                </View>
              )}

              <Text className="text-zinc-500 text-sm mb-4">
                {item.description}
              </Text>

              {/* Action Button */}
              <TouchableOpacity
                activeOpacity={0.9}
                className="w-full h-12 bg-zinc-900 dark:bg-white rounded-xl items-center justify-center flex-row gap-2"
                onPress={() => console.log("Navigate to Detail", item.title)}
              >
                <Text className="text-white dark:text-black font-bold text-sm">
                  Tarifi Gör
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={16}
                  color={colorScheme === "dark" ? "black" : "white"}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />
    </Animated.View>
  );
}
