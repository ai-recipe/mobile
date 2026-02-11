import { FoodLogEntry } from "@/api/nutrition";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRecentMealsAsync } from "@/store/slices/dailyLogsSlice";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface MealEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (mealData: MealData) => void;
  initialData?: MealData;
}

export interface MealData {
  id?: string;
  name: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: string;
}

export function MealEntryModal({
  visible,
  onClose,
  onSave,
  initialData,
}: MealEntryModalProps) {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const [mealName, setMealName] = useState("");
  const [servings, setServings] = useState(1);
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const { isLoading, recentMeals } = useAppSelector((state) => state.dailyLogs);

  React.useEffect(() => {
    if (visible && recentMeals.length === 0) {
      dispatch(fetchRecentMealsAsync());
    }
  }, [visible, recentMeals.length, dispatch]);

  const handleSelectRecent = (meal: FoodLogEntry) => {
    setMealName(meal.mealName);
    setCalories(meal.calories.toString());
    setProtein(meal.proteinGrams.toString());
    setCarbs(meal.carbsGrams.toString());
    setFat(meal.fatGrams.toString());
    setServings(meal.quantity || 1);
    setFat(meal.fatGrams.toString());
    setServings(meal.quantity || 1);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        id: initialData?.id,
        name: mealName || "Unnamed Meal",
        servings,
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        loggedAt: new Date().toISOString(),
      });
    }
  };

  // Reset/Pre-fill form when modal becomes visible
  React.useEffect(() => {
    if (visible) {
      if (initialData) {
        setMealName(initialData.name);
        setCalories(initialData.calories.toString());
        setProtein(initialData.protein.toString());
        setCarbs(initialData.carbs.toString());
        setFat(initialData.fat.toString());
        setServings(initialData.servings);
      } else {
        setMealName("");
        setCalories("");
        setProtein("");
        setCarbs("");
        setFat("");
        setServings(1);
      }
    }
  }, [visible, initialData]);

  const nProtein = Number(protein) || 0;
  const nCarbs = Number(carbs) || 0;
  const nFat = Number(fat) || 0;

  const totalMacros = useMemo(() => {
    return nProtein * 4 + nCarbs * 4 + nFat * 4;
  }, [nProtein, nCarbs, nFat]);

  const proteinPercent = useMemo(() => {
    if (!totalMacros) return 0;
    return ((nProtein * 4) / totalMacros) * 100;
  }, [nProtein, totalMacros]);

  const carbsPercent = useMemo(() => {
    if (!totalMacros) return 0;
    return ((nCarbs * 4) / totalMacros) * 100;
  }, [nCarbs, totalMacros]);

  const fatPercent = useMemo(() => {
    if (!totalMacros) return 0;
    return ((nFat * 4) / totalMacros) * 100;
  }, [nFat, totalMacros]);

  const proteinWidthShared = useSharedValue(0);
  const carbsWidthShared = useSharedValue(0);
  const fatWidthShared = useSharedValue(0);

  React.useEffect(() => {
    proteinWidthShared.value = withTiming(proteinPercent, { duration: 500 });
    carbsWidthShared.value = withTiming(carbsPercent, { duration: 500 });
    fatWidthShared.value = withTiming(fatPercent, { duration: 500 });
  }, [
    proteinPercent,
    carbsPercent,
    fatPercent,
    proteinWidthShared,
    carbsWidthShared,
    fatWidthShared,
  ]);

  const proteinAnimatedStyle = useAnimatedStyle(() => ({
    width: `${proteinWidthShared.value}%`,
  }));

  const carbsAnimatedStyle = useAnimatedStyle(() => ({
    width: `${carbsWidthShared.value}%`,
  }));

  const fatAnimatedStyle = useAnimatedStyle(() => ({
    width: `${fatWidthShared.value}%`,
  }));

  const caloriesRef = useRef<TextInput>(null);
  const proteinRef = useRef<TextInput>(null);
  const carbsRef = useRef<TextInput>(null);
  const fatRef = useRef<TextInput>(null);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 20}
      >
        <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
          {/* Header Image Area */}
          <View className="relative w-full h-[25vh] bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
            {/* Top Bar */}
            <View className="absolute top-0 left-0 w-full p-4 pt-12 flex-row justify-between items-start z-10">
              <Pressable
                onPress={onClose}
                className="w-10 h-10 rounded-full bg-black/20 dark:bg-white/10 flex items-center justify-center"
              >
                <MaterialIcons name="close" size={24} color="white" />
              </Pressable>
            </View>

            {/* Food Icon Placeholder */}
            <View className="opacity-80">
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
            keyboardShouldPersistTaps="handled"
          >
            {/* Drag Handle */}
            <View className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-600 rounded-full mx-auto mb-6 mt-2" />

            {/* Quick Select Section */}
            {recentMeals.length > 0 && (
              <View className="mb-6">
                <Text className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 ml-1">
                  Quick Select
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row"
                >
                  <View className="flex-row gap-2 px-1">
                    {recentMeals.map((meal, index) => (
                      <Pressable
                        key={`${meal.id}-${index}`}
                        onPress={() => handleSelectRecent(meal)}
                        className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 px-4 py-2.5 rounded-2xl flex-row items-center gap-2"
                      >
                        <View className="w-2 h-2 rounded-full bg-[#f39849]" />
                        <View>
                          <Text className="text-sm font-bold text-zinc-900 dark:text-white">
                            {meal.mealName}
                          </Text>
                          <Text className="text-[10px] text-zinc-500 font-medium">
                            {meal.calories} kcal
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Title and Servings */}
            <View className="flex-row justify-between items-start mb-8">
              <View className="flex-1 pr-4">
                <TextInput
                  value={mealName}
                  onChangeText={setMealName}
                  className="text-2xl font-bold leading-tight text-zinc-900 dark:text-white w-full"
                  placeholder="Meal name (e.g. Boiled Egg)"
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
            <Pressable
              className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-4 mb-4 flex-row items-center justify-between"
              onPress={() => caloriesRef.current?.focus()}
            >
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
                    ref={caloriesRef}
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="numeric"
                    className="text-2xl font-bold text-zinc-900 dark:text-white w-full"
                  />
                </View>
              </View>
            </Pressable>

            {/* Macros Grid */}
            <View className="flex-row gap-3 mb-8">
              {/* Protein */}
              <Pressable
                className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-3"
                onPress={() => proteinRef.current?.focus()}
              >
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
                <View className="flex-row items-baseline px-2 w-full">
                  <TextInput
                    ref={proteinRef}
                    value={protein}
                    onChangeText={setProtein}
                    keyboardType="numeric"
                    className="text-lg font-bold text-zinc-900 dark:text-white w-full"
                  />
                  <Text className="text-xs text-zinc-400 ml-1">g</Text>
                </View>
              </Pressable>

              {/* Carbs */}
              <Pressable
                className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-3"
                onPress={() => carbsRef.current?.focus()}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="w-6 h-6 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                    <MaterialIcons name="grass" size={14} color="#22c55e" />
                  </View>
                  <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    Carbs
                  </Text>
                </View>
                <View className="flex-row items-baseline px-2 w-full">
                  <TextInput
                    ref={carbsRef}
                    value={carbs}
                    onChangeText={setCarbs}
                    keyboardType="numeric"
                    className="text-lg font-bold text-zinc-900 dark:text-white w-full"
                  />
                  <Text className="text-xs text-zinc-400 ml-1">g</Text>
                </View>
              </Pressable>

              {/* Fat */}
              <Pressable
                className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-3"
                onTouchStart={() => fatRef.current?.focus()}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="w-6 h-6 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                    <MaterialIcons
                      name="water-drop"
                      size={14}
                      color="#f59e0b"
                    />
                  </View>
                  <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    Fat
                  </Text>
                </View>
                <View className="flex-row items-baseline px-2 w-full">
                  <TextInput
                    ref={fatRef}
                    value={fat}
                    onChangeText={setFat}
                    keyboardType="numeric"
                    className="text-lg font-bold text-zinc-900 dark:text-white w-full"
                  />
                  <Text className="text-xs text-zinc-400 ml-1">g</Text>
                </View>
              </Pressable>
            </View>

            {/* Macro Balance */}
            <View className="mb-8">
              <Text className="text-sm font-semibold mb-3 text-zinc-900 dark:text-white">
                Macro Balance
              </Text>
              <View className="h-3 w-full rounded-full flex-row overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-800">
                <Animated.View
                  className="bg-blue-400 dark:bg-blue-500 h-full"
                  style={proteinAnimatedStyle}
                />
                <Animated.View
                  className="bg-green-400 dark:bg-green-500 h-full"
                  style={carbsAnimatedStyle}
                />
                <Animated.View
                  className="bg-orange-300 dark:bg-orange-400 h-full"
                  style={fatAnimatedStyle}
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
              disabled={isLoading}
              className={`w-full py-4 rounded-full shadow-sm flex-row items-center justify-center ${
                isLoading ? "bg-[#f39849]/70" : "bg-[#f39849]"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-bold text-lg text-center">
                  {initialData ? "Update Entry" : "Add to Diary"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
