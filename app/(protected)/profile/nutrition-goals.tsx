import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const NutritionGoalCard = ({
  icon,
  label,
  value,
  unit,
  color,
  onChange,
}: {
  icon: string;
  label: string;
  value: string;
  unit: string;
  color: string;
  onChange: (val: string) => void;
}) => {
  const inputRef = useRef<TextInput>(null);
  return (
    <Pressable
      className="flex-row items-center mb-4"
      onPress={() => inputRef.current?.focus()}
    >
      {/* progress ring mock */}
      <View className="w-16 h-16 items-center justify-center mr-4">
        <View className="absolute inset-0 rounded-full border-[3px] border-zinc-100 dark:border-zinc-800 opacity-50" />
        <View
          className="absolute inset-0 rounded-full border-[3px]"
          style={{
            borderColor: color,
            borderBottomColor: "transparent",
            borderRightColor: "transparent",
            transform: [{ rotate: "45deg" }],
          }}
        />
        <View className="bg-white dark:bg-zinc-900 rounded-full p-2">
          <MaterialIcons name={icon as any} size={22} color={color} />
        </View>
      </View>

      <View className="flex-1 bg-white dark:bg-zinc-900 rounded-[24px] p-5 border border-zinc-50 dark:border-zinc-800/50 flex-row items-center justify-between">
        <View>
          <Text className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[2px] mb-1">
            {label}
          </Text>
          <View className="flex-row items-baseline">
            <TextInput
              ref={inputRef}
              className="text-2xl font-bold text-zinc-900 dark:text-white p-0 mr-1 min-w-[60px]"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholderTextColor="#a1a1aa"
            />
            <Text className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
              {unit}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="edit" size={16} color="#d4d4d8" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const NutritionGoals = () => {
  const router = useRouter();
  const [goals, setGoals] = useState({
    calories: "2500",
    protein: "120",
    carbs: "200",
    fat: "47",
    weight: "70",
  });
  const colorScheme = useColorScheme();

  return (
    <ScreenWrapper
      showBackButton
      showTopNavBar={false}
      withTabNavigation={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-[#F9FAFB] dark:bg-zinc-950"
      >
        <View className="flex-1 px-6">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 180 }}
          >
            <Text className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">
              Edit Nutrition Goals
            </Text>
            <NutritionGoalCard
              icon="local-fire-department"
              label="Calorie Goal"
              value={goals.calories}
              unit="kcal"
              color="#18181b"
              onChange={(val) => setGoals({ ...goals, calories: val })}
            />
            <NutritionGoalCard
              icon="fitness-center"
              label="Protein Goal"
              value={goals.protein}
              unit="g"
              color="#18181b"
              onChange={(val) => setGoals({ ...goals, protein: val })}
            />
            <NutritionGoalCard
              icon="grass"
              label="Carb Goal"
              value={goals.carbs}
              unit="g"
              color="#18181b"
              onChange={(val) => setGoals({ ...goals, carbs: val })}
            />
            <NutritionGoalCard
              icon="local-fire-department"
              label="Fat Goal"
              value={goals.fat}
              unit="g"
              color="#18181b"
              onChange={(val) => setGoals({ ...goals, fat: val })}
            />
          </ScrollView>

          <View className="absolute bottom-10 left-6 right-6">
            <TouchableOpacity
              className="w-full bg-primary py-5 rounded-[22px] shadow-xl items-center justify-center mb-4"
              onPress={() => {
                // Save logic here
                router.back();
              }}
              activeOpacity={0.8}
            >
              <Text className="text-white dark:text-zinc-900 font-bold text-lg">
                Save Changes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 py-4 rounded-[22px] items-center justify-center flex-row gap-3"
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="auto-awesome"
                size={18}
                color={Colors[colorScheme].primary}
              />
              <Pressable
                onPress={() => {
                  router.push("/screens/survey");
                }}
              >
                <Text className="text-primary dark:text-white font-bold text-base">
                  Auto Generate Goals
                </Text>
              </Pressable>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default NutritionGoals;
