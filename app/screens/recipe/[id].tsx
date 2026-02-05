import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const STATIC_RECIPE = {
  id: "1",
  title: "Akdeniz Usulü Levrek",
  category: "Deniz Ürünleri",
  time: "35 dk",
  difficulty: "Orta",
  rating: 4.8,
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD_y2dc2vS2KdW2PAW8d_3j9IsEGIuKOIsxshOXletERNdk88dYu2Af71WFjgLj25byPfDvEu_pQ-XVhN4-yQI-z4q9Dy0xfbuS7NycDefQLvD5DDOreAeRbZTn_qahv4oL9g4YHU9lv4GOov7f34k0-r743IeuGySHbJm1ZRYOwMaMCwtueHHtV1KRuAGRCuvEdawqPEPiTUhSWX81xuGbECouXZuQ-N3IyGMz3Q1vXABJm9aK798SF15St6RLMseuGAttMCk6DIxO",
  ingredients: [
    "2 adet orta boy levrek",
    "3 yemek kaşığı zeytinyağı",
    "1 adet limon (dilimlenmiş)",
    "2 diş sarımsak",
    "Taze biberiye ve kekik",
    "Tuz ve taze çekilmiş karabiber",
  ],
  preparation: [
    "Levrekleri iyice yıkayıp kurulayın.",
    "Zeytinyağı, ezilmiş sarımsak, tuz ve karabiberden oluşan sosu balıkların içine ve dışına sürün.",
    "Balıkların içine limon dilimleri ve taze otları yerleştirin.",
    "Önceden ısıtılmış 200 derece fırında 25-30 dakika pişirin.",
  ],
};

const RecipeDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<"ingredients" | "preparation">(
    "ingredients",
  );
  const [checkedIngredients, setCheckedIngredients] = useState<
    Record<number, boolean>
  >({});

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Image */}
        <View className="relative w-full h-80">
          <Image
            source={{ uri: STATIC_RECIPE.image }}
            className="w-full h-full object-cover"
          />
          <View className="absolute top-0 left-0 right-0 p-4 flex-row justify-between items-center pt-12">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-3 rounded-full bg-black/30 backdrop-blur-md"
            >
              <MaterialIcons
                name="arrow-back-ios-new"
                size={20}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity className="p-3 rounded-full bg-black/30 backdrop-blur-md">
              <MaterialIcons name="favorite-border" size={20} color="#f39849" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Area */}
        <View className="flex-1 bg-white dark:bg-zinc-900 -mt-8 rounded-t-[32px] p-6">
          <View className="mb-6">
            <Text className="text-[#f39849] font-bold text-sm tracking-wider uppercase mb-1">
              {STATIC_RECIPE.category}
            </Text>
            <View className="flex-row justify-between items-start">
              <Text className="text-2xl font-bold leading-tight text-zinc-900 dark:text-white max-w-[80%]">
                {STATIC_RECIPE.title}
              </Text>
              <View className="flex-row items-center bg-orange-100 dark:bg-orange-500/10 px-2 py-1 rounded-lg">
                <MaterialIcons name="star" size={14} color="#f39849" />
                <Text className="text-sm font-semibold text-[#f39849] ml-1">
                  {STATIC_RECIPE.rating}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-6 mt-4">
              <View className="flex-row items-center">
                <MaterialIcons name="schedule" size={18} color="#a1a1aa" />
                <Text className="text-sm text-zinc-500 dark:text-zinc-400 ml-1.5 font-medium">
                  {STATIC_RECIPE.time}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="bar-chart" size={18} color="#a1a1aa" />
                <Text className="text-sm text-zinc-500 dark:text-zinc-400 ml-1.5 font-medium">
                  {STATIC_RECIPE.difficulty}
                </Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row border-b border-zinc-100 dark:border-zinc-800 mb-6">
            <TouchableOpacity
              onPress={() => setActiveTab("ingredients")}
              className={`flex-1 pb-3 items-center border-b-2 ${
                activeTab === "ingredients"
                  ? "border-[#f39849]"
                  : "border-transparent"
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  activeTab === "ingredients"
                    ? "text-[#f39849]"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                Malzemeler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("preparation")}
              className={`flex-1 pb-3 items-center border-b-2 ${
                activeTab === "preparation"
                  ? "border-[#f39849]"
                  : "border-transparent"
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  activeTab === "preparation"
                    ? "text-[#f39849]"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                Hazırlanış
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View>
            {activeTab === "ingredients" ? (
              <View className="space-y-4">
                {STATIC_RECIPE.ingredients.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    onPress={() => toggleIngredient(index)}
                    className="flex-row items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                  >
                    <View
                      className={`w-5 h-5 rounded border ${
                        checkedIngredients[index]
                          ? "bg-[#f39849] border-[#f39849]"
                          : "border-zinc-300 dark:border-zinc-600"
                      } items-center justify-center`}
                    >
                      {checkedIngredients[index] && (
                        <MaterialIcons name="check" size={12} color="white" />
                      )}
                    </View>
                    <Text
                      className={`text-zinc-700 dark:text-zinc-300 ${
                        checkedIngredients[index]
                          ? "line-through opacity-50"
                          : ""
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="space-y-6">
                {STATIC_RECIPE.preparation.map((step, index) => (
                  <View key={index} className="flex-row gap-4">
                    <View className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/10 items-center justify-center">
                      <Text className="text-[#f39849] font-bold">
                        {index + 1}
                      </Text>
                    </View>
                    <Text className="flex-1 text-zinc-700 dark:text-zinc-300 leading-6 text-base">
                      {step}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;
