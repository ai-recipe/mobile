import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { postGoalPlanLogAsync } from "@/store/slices/goalPlansSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
/**
 * 
 * @returns }
 LOG  {"createdAt": "2026-02-21T14:04:53.402+00:00", "effectiveFrom": "2026-02-21T14:04:53.401+00:00", "effectiveTo": null, "id": "d667dec5-6590-41ff-885e-abf5c7e862ac", "metadata": null, "targetCalories": null, "targetCarbsG": null, "targetFatG": null, "targetProteinG": null, "targetWaterMl": null, "targetWeightKg": 45, "userId": "e7fd42d2-bee4-4455-ac35-64a6cf753e37"}
 */
const NutritionGoals = () => {
  const router = useRouter();
  const { goalPlan } = useAppSelector((state) => state.goalPlans);
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();

  const [goals, setGoals] = useState({
    targetWeightKg: goalPlan?.targetWeightKg || 0,
    targetWaterMl: goalPlan?.targetWaterMl || 0,
    targetCalories: goalPlan?.targetCalories || 0,
    targetProteinG: goalPlan?.targetProteinG || 0,
    targetCarbsG: goalPlan?.targetCarbsG || 0,
    targetFatG: goalPlan?.targetFatG || 0,
  });

  const from = useLocalSearchParams().from;
  const handleSave = () => {
    dispatch(postGoalPlanLogAsync({ from: from as any, ...goals }));

    router.back();
  };

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
              value={goals.targetCalories?.toString()}
              unit="kcal"
              color={Colors[colorScheme].primary}
              onChange={(val) =>
                setGoals({ ...goals, targetCalories: parseInt(val) })
              }
            />
            <NutritionGoalCard
              icon="fitness-center"
              label="Protein Goal"
              value={goals.targetProteinG?.toString()}
              unit="g"
              color={Colors[colorScheme].primary}
              onChange={(val) =>
                setGoals({ ...goals, targetProteinG: parseInt(val) })
              }
            />
            <NutritionGoalCard
              icon="grass"
              label="Carb Goal"
              value={goals.targetCarbsG?.toString()}
              unit="g"
              color={Colors[colorScheme].primary}
              onChange={(val) =>
                setGoals({ ...goals, targetCarbsG: parseInt(val) })
              }
            />
            <NutritionGoalCard
              icon="local-fire-department"
              label="Fat Goal"
              value={goals.targetFatG?.toString()}
              unit="g"
              color={Colors[colorScheme].primary}
              onChange={(val) =>
                setGoals({ ...goals, targetFatG: parseInt(val) })
              }
            />
          </ScrollView>

          <View className="absolute bottom-10 left-6 right-6">
            <TouchableOpacity
              className="w-full bg-primary py-5 rounded-[22px] shadow-xl items-center justify-center mb-4"
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text className="text-white dark:text-zinc-900 font-bold text-lg">
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default NutritionGoals;
