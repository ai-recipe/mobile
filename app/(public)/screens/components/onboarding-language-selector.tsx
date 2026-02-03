import React from "react";
import { Pressable, Text, View } from "react-native";

interface OnboardingLanguageSelectorProps {
  currentLanguage: string;
  onChangeLanguage: (lng: string) => void;
}

export const OnboardingLanguageSelector = ({
  currentLanguage,
  onChangeLanguage,
}: OnboardingLanguageSelectorProps) => (
  <View className="flex-row justify-end px-6 pt-2">
    <View className="flex-row bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
      <Pressable
        onPress={() => onChangeLanguage("tr")}
        className={`px-3 py-1.5 rounded-full ${
          currentLanguage === "tr" ? "bg-primary" : ""
        }`}
      >
        <Text
          className={`text-xs font-bold ${
            currentLanguage === "tr" ? "text-white" : "text-gray-500"
          }`}
        >
          TR
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChangeLanguage("en")}
        className={`px-3 py-1.5 rounded-full ${
          currentLanguage === "en" ? "bg-primary" : ""
        }`}
      >
        <Text
          className={`text-xs font-bold ${
            currentLanguage === "en" ? "text-white" : "text-gray-500"
          }`}
        >
          EN
        </Text>
      </Pressable>
    </View>
  </View>
);
