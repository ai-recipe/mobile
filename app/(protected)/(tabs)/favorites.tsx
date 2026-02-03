import { ScreenWrapper } from "@/components/ScreenWrapper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const AI_RECIPES = [
  {
    id: "1",
    title: "Dolaptaki Sebze Sote",
    date: "2 Saat Önce",
    ingredients: "Kabak, Havuç, Biber",
    matchScore: 95,
  },
  {
    id: "2",
    title: "Pratik Tavuk Curry",
    date: "Dün",
    ingredients: "Tavuk, Krema, Köri",
    matchScore: 88,
  },
];

const MyAiRecipesScreen = () => {
  return (
    <ScreenWrapper>
      <View className="flex-1 bg-white dark:bg-zinc-900 px-5 pt-4">
        <View className="flex-row items-center mb-6">
          <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            Favori <Text className="text-[#f39849]">Tariflerim</Text>
          </Text>
        </View>

        <FlatList
          data={AI_RECIPES}
          renderItem={({ item }) => (
            <TouchableOpacity className="mb-4 p-5 bg-orange-50/50 dark:bg-zinc-800/50 rounded-[24px] border border-orange-100 dark:border-zinc-700">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-zinc-500 text-[10px] font-bold uppercase mb-1">
                    {item.date}
                  </Text>
                  <Text className="text-lg font-bold text-zinc-900 dark:text-white">
                    {item.title}
                  </Text>
                </View>
                <View className="bg-[#f39849] px-2 py-1 rounded-lg">
                  <Text className="text-white text-[10px] font-black">
                    %{item.matchScore} UYUM
                  </Text>
                </View>
              </View>
              <Text className="text-zinc-500 dark:text-zinc-400 text-sm italic">
                "{item.ingredients}..."
              </Text>
              <View className="mt-4 flex-row items-center justify-end">
                <Text className="text-[#f39849] font-bold text-xs mr-1">
                  Tarife Git
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={16}
                  color="#f39849"
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenWrapper>
  );
};

export default MyAiRecipesScreen;
