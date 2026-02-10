import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface MealEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (mealData: MealData) => void;
}

interface MealData {
  name: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function MealEntryModal({
  visible,
  onClose,
  onSave,
}: MealEntryModalProps) {
  const colorScheme = useColorScheme();
  const [mealName, setMealName] = useState("Haşlanmış Yumurta");
  const [servings, setServings] = useState(4);
  const [calories, setCalories] = useState(250);
  const [protein, setProtein] = useState(25);
  const [carbs, setCarbs] = useState(15);
  const [fat, setFat] = useState(10);

  const handleSave = () => {
    if (onSave) {
      onSave({
        name: mealName,
        servings,
        calories,
        protein,
        carbs,
        fat,
      });
    }
    onClose();
  };

  // Calculate macro percentages
  const totalMacros = protein * 4 + carbs * 4 + fat * 9;
  const proteinPercent = ((protein * 4) / totalMacros) * 100;
  const carbsPercent = ((carbs * 4) / totalMacros) * 100;
  const fatPercent = ((fat * 9) / totalMacros) * 100;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        {/* Header Image Area */}
        <View className="relative w-full h-[45vh] bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
          {/* Top Bar */}
          <View className="absolute top-0 left-0 w-full p-4 pt-12 flex-row justify-between items-start z-10">
            <Pressable
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-black/20 dark:bg-white/10 flex items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={20} color="white" />
            </Pressable>
          </View>

          {/* Food Icon Placeholder */}
          <View className="w-64 h-64 flex items-center justify-center opacity-80">
            <MaterialIcons
              name="restaurant"
              size={120}
              color={colorScheme === "dark" ? "#52525b" : "#d1d5db"}
            />
          </View>
        </View>

        {/* Content Area */}
        <ScrollView
          className="flex-1 bg-white dark:bg-zinc-900 -mt-8 rounded-t-3xl px-6 pt-3 pb-24"
          showsVerticalScrollIndicator={false}
        >
          {/* Drag Handle */}
          <View className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-600 rounded-full mx-auto mb-6 mt-2" />

          {/* Title and Servings */}
          <View className="flex-row justify-between items-start mb-8">
            <View className="flex-1 pr-4">
              <TextInput
                value={mealName}
                onChangeText={setMealName}
                className="text-2xl font-bold leading-tight text-zinc-900 dark:text-white"
                placeholder="Meal name"
                placeholderTextColor={
                  colorScheme === "dark" ? "#71717a" : "#a1a1aa"
                }
              />
            </View>

            {/* Servings Counter */}
            <View className="flex-row items-center border border-zinc-300 dark:border-zinc-600 rounded-full px-1 py-1">
              <Pressable
                onPress={() => setServings(Math.max(1, servings - 1))}
                className="w-8 h-8 flex items-center justify-center"
              >
                <MaterialIcons
                  name="remove"
                  size={18}
                  color={colorScheme === "dark" ? "#a1a1aa" : "#71717a"}
                />
              </Pressable>
              <Text className="w-8 text-center font-semibold text-lg text-zinc-900 dark:text-white">
                {servings}
              </Text>
              <Pressable
                onPress={() => setServings(servings + 1)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <MaterialIcons
                  name="add"
                  size={18}
                  color={colorScheme === "dark" ? "#a1a1aa" : "#71717a"}
                />
              </Pressable>
            </View>
          </View>

          {/* Calories Card */}
          <View className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-4 mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <MaterialIcons
                  name="local-fire-department"
                  size={24}
                  color="#ef4444"
                />
              </View>
              <View>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-0.5">
                  Calories
                </Text>
                <TextInput
                  value={calories.toString()}
                  onChangeText={(text) => setCalories(parseInt(text) || 0)}
                  keyboardType="numeric"
                  className="text-2xl font-bold text-zinc-900 dark:text-white"
                />
              </View>
            </View>
            <Pressable>
              <MaterialIcons
                name="edit"
                size={18}
                color={colorScheme === "dark" ? "#52525b" : "#d1d5db"}
              />
            </Pressable>
          </View>

          {/* Macros Grid */}
          <View className="flex-row gap-3 mb-8">
            {/* Protein */}
            <View className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-3">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <MaterialIcons
                    name="fitness-center"
                    size={14}
                    color="#3b82f6"
                  />
                </View>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Protein
                </Text>
              </View>
              <TextInput
                value={protein.toString()}
                onChangeText={(text) => setProtein(parseInt(text) || 0)}
                keyboardType="numeric"
                className="text-lg font-bold text-zinc-900 dark:text-white pl-1"
                placeholder="0"
              />
              <Text className="text-xs text-zinc-400 pl-1">g</Text>
            </View>

            {/* Carbs */}
            <View className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-3">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-6 h-6 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <MaterialIcons name="grass" size={14} color="#22c55e" />
                </View>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Carbs
                </Text>
              </View>
              <TextInput
                value={carbs.toString()}
                onChangeText={(text) => setCarbs(parseInt(text) || 0)}
                keyboardType="numeric"
                className="text-lg font-bold text-zinc-900 dark:text-white pl-1"
                placeholder="0"
              />
              <Text className="text-xs text-zinc-400 pl-1">g</Text>
            </View>

            {/* Fat */}
            <View className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-3">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-6 h-6 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <MaterialIcons name="water-drop" size={14} color="#f59e0b" />
                </View>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Fat
                </Text>
              </View>
              <TextInput
                value={fat.toString()}
                onChangeText={(text) => setFat(parseInt(text) || 0)}
                keyboardType="numeric"
                className="text-lg font-bold text-zinc-900 dark:text-white pl-1"
                placeholder="0"
              />
              <Text className="text-xs text-zinc-400 pl-1">g</Text>
            </View>
          </View>

          {/* Macro Balance */}
          <View className="mb-8">
            <Text className="text-sm font-semibold mb-3 text-zinc-900 dark:text-white">
              Macro Balance
            </Text>
            <View className="h-3 w-full rounded-full flex-row overflow-hidden mb-4">
              <View
                className="bg-blue-400 dark:bg-blue-500"
                style={{ width: `${proteinPercent}%` }}
              />
              <View
                className="bg-green-400 dark:bg-green-500"
                style={{ width: `${carbsPercent}%` }}
              />
              <View
                className="bg-orange-300 dark:bg-orange-400"
                style={{ width: `${fatPercent}%` }}
              />
            </View>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <View className="w-2.5 h-2.5 rounded-full bg-blue-400 dark:bg-blue-500" />
                  <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                    Protein
                  </Text>
                </View>
                <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                  {proteinPercent.toFixed(0)}%
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <View className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-500" />
                  <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                    Carbs
                  </Text>
                </View>
                <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                  {carbsPercent.toFixed(0)}%
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <View className="w-2.5 h-2.5 rounded-full bg-orange-300 dark:bg-orange-400" />
                  <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                    Fat
                  </Text>
                </View>
                <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                  {fatPercent.toFixed(0)}%
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Save Button */}
        <View className="bg-white dark:bg-zinc-900 px-6 py-6 border-t border-zinc-100 dark:border-zinc-800 pb-8">
          <Pressable
            onPress={handleSave}
            className="w-full bg-[#0F172A] dark:bg-zinc-100 py-3.5 rounded-full active:opacity-90"
          >
            <Text className="text-white dark:text-zinc-900 font-semibold text-lg text-center">
              Save
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
