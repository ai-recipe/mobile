import { ScreenWrapper } from "@/components/ScreenWrapper";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const STATIC_RECIPES = [
  {
    id: "1",
    title: "Akdeniz Usulü Levrek",
    category: "Deniz Ürünleri",
    time: "35 dk",
    difficulty: "Orta",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
  },
  {
    id: "2",
    title: "Ev Yapımı Fettuccine",
    category: "Makarnalar",
    time: "20 dk",
    difficulty: "Kolay",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df",
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
          renderItem={({ item }) => (
            <TouchableOpacity className="mb-6 bg-white dark:bg-zinc-800 rounded-[24px] overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-700">
              <Image source={{ uri: item.image }} className="w-full h-48" />
              <View className="p-4">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-xs font-bold text-[#f39849] uppercase">
                    {item.category}
                  </Text>
                  <View className="flex-row items-center">
                    <MaterialIcons name="star" size={14} color="#f39849" />
                    <Text className="text-xs font-bold ml-1">
                      {item.rating}
                    </Text>
                  </View>
                </View>
                <Text className="text-lg font-bold text-zinc-900 dark:text-white mb-3">
                  {item.title}
                </Text>
                <View className="flex-row gap-4">
                  <View className="flex-row items-center">
                    <MaterialIcons name="timer" size={16} color="#a1a1aa" />
                    <Text className="text-xs text-zinc-500 ml-1">
                      {item.time}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialIcons name="bar-chart" size={16} color="#a1a1aa" />
                    <Text className="text-xs text-zinc-500 ml-1">
                      {item.difficulty}
                    </Text>
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
