import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface PrepTime {
  id: string;
  label: string;
  sub: string;
  icon: string;
}

interface OnboardingStepPreferencesProps {
  onNext: () => void;
  selectedPrepTime: string;
  selectedDietary: string[];
  prepTimes: PrepTime[];
  dietaryOptions: string[];
}

export const OnboardingStepPreferences = ({
  onNext,
  selectedPrepTime,
  selectedDietary,
  prepTimes,
  dietaryOptions,
}: OnboardingStepPreferencesProps) => {
  return (
    <View className="flex-1">
      <ScrollView className="flex-1 px-6">
        <Text className="text-2xl font-black text-text dark:text-white mt-4 mb-2">
          Hazırlık Süresi
        </Text>
        <Text className="text-sm text-secondary mb-6 font-medium">
          Yemek hazırlamak için ne kadar vaktin var?
        </Text>

        <View className="gap-4 mb-10">
          {prepTimes.map((time) => (
            <View
              key={time.id}
              className={`flex-row items-center p-4 rounded-3xl border-2 ${
                selectedPrepTime === time.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-100 dark:border-gray-800 bg-white dark:bg-white/5"
              }`}
            >
              <View
                className={`h-12 w-12 rounded-full items-center justify-center ${
                  selectedPrepTime === time.id ? "bg-primary" : "bg-primary/10"
                }`}
              >
                <MaterialCommunityIcons
                  name={time.icon as any}
                  size={24}
                  color={selectedPrepTime === time.id ? "white" : "#f39849"}
                />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-base font-bold text-text dark:text-white">
                  {time.label}
                </Text>
                <Text className="text-xs text-secondary font-medium">
                  {time.sub}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={
                  selectedPrepTime === time.id
                    ? "check-circle"
                    : "radiobox-blank"
                }
                size={24}
                color="#f39849"
              />
            </View>
          ))}
        </View>

        <Text className="text-2xl font-black text-text dark:text-white mt-4 mb-2">
          Beslenme Tercihleri
        </Text>
        <Text className="text-sm text-secondary mb-6 font-medium">
          Senin için en uygun olanları seç.
        </Text>

        <View className="flex-row flex-wrap gap-2 mb-10">
          {dietaryOptions.map((item) => {
            const isSelected = selectedDietary.includes(item);
            return (
              <View
                key={item}
                className={`flex-row items-center px-5 py-3 rounded-full border ${
                  isSelected
                    ? "bg-primary border-primary shadow-md shadow-primary/20"
                    : "bg-white dark:bg-white/5 border-gray-100 dark:border-gray-800"
                }`}
              >
                {isSelected && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={16}
                    color="white"
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text
                  className={`text-sm font-bold ${
                    isSelected
                      ? "text-white"
                      : "text-text dark:text-white opacity-60"
                  }`}
                >
                  {item}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View className="p-6 pb-10 border-t border-gray-100 dark:border-gray-800 bg-background dark:bg-darker">
        <Pressable
          onPress={onNext}
          className="w-full bg-primary py-5 rounded-full shadow-xl shadow-primary/30 flex-row items-center justify-center gap-2 active:opacity-90"
        >
          <Text className="text-white text-lg font-bold">Sonraki</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );
};
