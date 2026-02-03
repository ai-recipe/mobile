import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

const DIET_OPTIONS = [
  { id: "vegan", label: "Vegan", icon: "leaf" },
  { id: "vegetarian", label: "Vejeteryan", icon: "carrot" },
  { id: "protein", label: "Yüksek Protein", icon: "arm-flex" },
  { id: "low-carb", label: "Düşük Karb", icon: "food-steak" },
];

interface StepDietPreferenceProps {
  value: string[];
  onChange: (diets: string[]) => void;
  onSubmit: () => void;
  direction?: "forward" | "backward";
}

export function StepDietPreference({
  value,
  onChange,
  onSubmit,
  direction = "forward",
}: StepDietPreferenceProps) {
  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;

  const toggleDiet = (dietId: string) => {
    if (value.includes(dietId)) {
      onChange(value.filter((id) => id !== dietId));
    } else {
      onChange([...value, dietId]);
    }
  };

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      className="flex-1 px-5 pt-2"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
          Beslenme <Text className="text-[#f39849]">Tercihi</Text>
        </Text>
        <Text className="text-zinc-500 dark:text-zinc-400 text-base mb-8">
          Hangi beslenme tarzına uygun tarifler arıyorsunuz? (Birden fazla
          seçebilirsiniz)
        </Text>

        <View className="gap-4">
          {DIET_OPTIONS.map((diet) => {
            const isSelected = value.includes(diet.id);
            return (
              <TouchableOpacity
                key={diet.id}
                onPress={() => toggleDiet(diet.id)}
                activeOpacity={0.7}
                className={`flex-row items-center p-5 rounded-[24px] border-2 ${
                  isSelected
                    ? "bg-[#f39849]/5 border-[#f39849]"
                    : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700"
                }`}
              >
                <View
                  className={`size-12 rounded-2xl items-center justify-center ${
                    isSelected ? "bg-[#f39849]" : "bg-zinc-100 dark:bg-zinc-700"
                  }`}
                >
                  <MaterialCommunityIcons
                    name={diet.icon as any}
                    size={24}
                    color={isSelected ? "white" : "#a1a1aa"}
                  />
                </View>
                <View className="flex-1 ml-4">
                  <Text
                    className={`text-lg font-bold ${
                      isSelected
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {diet.label}
                  </Text>
                </View>
                {isSelected && (
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color="#f39849"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="pb-8 pt-2">
        <TouchableOpacity
          onPress={onSubmit}
          activeOpacity={0.9}
          className="bg-[#f39849] w-full h-[64px] rounded-2xl items-center justify-center shadow-lg shadow-orange-500/30 flex-row gap-2"
        >
          <MaterialIcons name="auto-awesome" size={24} color="white" />
          <Text className="text-white font-extrabold text-lg">
            Tarifleri Bul
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
