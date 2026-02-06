import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
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
import { useSelector } from "react-redux";
import { ScanFormData } from "../types/ai-scan-form.types";

interface StepIngredientsSelectionProps {
  onToggleIngredient: (ingredient: string) => void;
  onAddIngredient: (ingredient: string) => void;
  onNext: () => void;
  direction?: "forward" | "backward";
  data: ScanFormData;
}

export function StepIngredientsSelection({
  onToggleIngredient,
  onAddIngredient,
  onNext,
  direction = "forward",
  data,
}: StepIngredientsSelectionProps) {
  const scrollRef = useRef<ScrollView>(null);
  const { scannedIngredients } = useSelector((state: any) => state.recipe);

  const [newIngredient, setNewIngredient] = useState("");
  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      onAddIngredient(newIngredient);
      setNewIngredient("");
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  };

  const isSelected = (ingredient: string) => {
    return data.selectedIngredients?.includes(ingredient);
  };

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      className="flex-1 px-5"
    >
      <View className="mb-4">
        <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
          Taranan <Text className="text-[#f39849]">Malzemeler</Text>
        </Text>
        <Text className="text-zinc-500 dark:text-zinc-400 text-base mb-2">
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
        style={{ height: 400 }}
        scrollViewRef={scrollRef}
      >
        {scannedIngredients.map((ingredient, index) => {
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
          disabled={data.selectedIngredients?.length === 0}
          activeOpacity={0.9}
          className={`w-full py-4 rounded-2xl items-center justify-center shadow-lg flex-row gap-2 ${
            data.selectedIngredients?.length === 0
              ? "bg-zinc-300 dark:bg-zinc-700"
              : "bg-[#f39849] shadow-orange-500/30"
          }`}
        >
          <Text className="text-white font-extrabold text-lg">
            Devam Et ({data.selectedIngredients?.length})
          </Text>
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
