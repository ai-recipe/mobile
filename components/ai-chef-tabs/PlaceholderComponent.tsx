import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PlaceholderComponentProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const PlaceholderComponent = ({
  searchQuery,
  setSearchQuery,
}: PlaceholderComponentProps) => {
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

export default PlaceholderComponent;
