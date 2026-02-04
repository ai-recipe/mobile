import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

interface StepIngredientsSelectionProps {
  ingredients: string[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  onAddIngredient: (ingredient: string) => void;
  onNext: () => void;
  direction?: "forward" | "backward";
}

export function StepIngredientsSelection({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  onAddIngredient,
  onNext,
  direction = "forward",
}: StepIngredientsSelectionProps) {
  const [newIngredient, setNewIngredient] = useState("");
  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      onAddIngredient(newIngredient);
      setNewIngredient("");
    }
  };

  const isSelected = (ingredient: string) =>
    selectedIngredients.includes(ingredient);

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      className="flex-1 px-5 pt-4"
    >
      <View className="mb-4">
        <Text className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Malzemeler
        </Text>
        <Text className="text-zinc-600 dark:text-zinc-400">
          Taranan malzemeleri kontrol edin ve düzenleyin
        </Text>
      </View>

      {/* Add Custom Ingredient */}
      <View className="mb-4 flex-row gap-2">
        <TextInput
          value={newIngredient}
          onChangeText={setNewIngredient}
          placeholder="Yeni malzeme ekle..."
          placeholderTextColor="#71717a"
          className="flex-1 bg-white dark:bg-zinc-800 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
          onSubmitEditing={handleAddIngredient}
        />
        <TouchableOpacity
          onPress={handleAddIngredient}
          className="bg-[#f39849] px-4 py-3 rounded-2xl items-center justify-center"
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Ingredients List */}
      <ScrollView
        className="flex-1 mb-4"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-3"
      >
        {ingredients.map((ingredient, index) => {
          const selected = isSelected(ingredient);
          return (
            <TouchableOpacity
              key={`${ingredient}-${index}`}
              onPress={() => onToggleIngredient(ingredient)}
              activeOpacity={0.7}
              className={`flex-row items-center p-4 rounded-2xl border ${
                selected
                  ? "bg-orange-50 dark:bg-orange-500/10 border-[#f39849]"
                  : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <View
                className={`w-6 h-6 rounded-lg border-2 items-center justify-center mr-3 ${
                  selected
                    ? "bg-[#f39849] border-[#f39849]"
                    : "bg-transparent border-zinc-300 dark:border-zinc-600"
                }`}
              >
                {selected && (
                  <MaterialIcons name="check" size={16} color="white" />
                )}
              </View>
              <Text
                className={`text-base font-semibold flex-1 ${
                  selected ? "text-[#f39849]" : "text-zinc-900 dark:text-white"
                }`}
              >
                {ingredient}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Next Button */}
      <View className="pb-8">
        <TouchableOpacity
          onPress={onNext}
          disabled={selectedIngredients.length === 0}
          activeOpacity={0.9}
          className={`w-full py-4 rounded-2xl items-center justify-center shadow-lg flex-row gap-2 ${
            selectedIngredients.length === 0
              ? "bg-zinc-300 dark:bg-zinc-700"
              : "bg-[#f39849] shadow-orange-500/30"
          }`}
        >
          <Text className="text-white font-extrabold text-lg">
            Devam Et ({selectedIngredients.length})
          </Text>
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
