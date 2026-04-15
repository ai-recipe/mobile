import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
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

interface SurveyOption {
  icon: string;
  label: string;
  value: string;
}

interface StepSurveyItemProps {
  question: {
    key: string;
    title: string;
    type: "single" | "multiple" | "number";
    options: SurveyOption[];
    isRequired: boolean;
  };
  value: string[];
  onChange: (answers: string[]) => void;
  onNext: () => void;
  direction?: "forward" | "backward";
  isLastStep: boolean;
  scrollRef?: React.RefObject<ScrollView>;
}

export function StepSurveyItem({
  question,
  value = [],
  onChange,
  onNext,
  direction = "forward",
  isLastStep,
  scrollRef,
}: StepSurveyItemProps) {
  const { t } = useTranslation();
  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;

  const toggleOption = (optionValue: string) => {
    if (question.type === "single") {
      onChange([optionValue]);
      // For single select, we could auto-advance if it's not the last step
      // But let's stick to explicit next for consistency
    } else {
      if (value.includes(optionValue)) {
        onChange(value.filter((val) => val !== optionValue));
      } else {
        onChange([...value, optionValue]);
      }
    }
  };

  const isNextDisabled =
    question.isRequired &&
    (question.type === "number"
      ? !value[0] || value[0].trim() === ""
      : value.length === 0);

  const getQuestionSubtitle = () => {
    switch (question.type) {
      case "multiple":
        return t("surveyItem.multipleChoice");
      case "number":
        return t("surveyItem.enterNumber");
      default:
        return t("surveyItem.selectOne");
    }
  };

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      className="flex-1 px-5"
    >
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-[32px] font-bold leading-tight pt-2 pb-1 text-zinc-900 dark:text-white">
          {t(question.title)}
        </Text>
        <Text className="text-zinc-500 dark:text-zinc-400 text-base mb-8">
          {getQuestionSubtitle()}
        </Text>

        {question.type === "number" ? (
          <View className="bg-white dark:bg-zinc-800 p-6 rounded-[24px] border-2 border-zinc-100 dark:border-zinc-700">
            <TextInput
              className="text-4xl font-black text-center text-zinc-900 dark:text-white"
              placeholder="0"
              placeholderTextColor="#a1a1aa"
              keyboardType="numeric"
              value={value[0] || ""}
              onChangeText={(text) => onChange([text])}
              autoFocus
            />
          </View>
        ) : (
          <View className="gap-4">
            {question.options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => toggleOption(option.value)}
                  activeOpacity={0.7}
                  className={`flex-row items-center p-5 rounded-[24px] border-2 ${
                    isSelected
                      ? "bg-[#f39849]/5 border-[#f39849]"
                      : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700"
                  }`}
                >
                  <View className="flex-1 ml-4">
                    <Text
                      className={`text-lg font-bold ${
                        isSelected
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {t(option.label)}
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
        )}
      </ScrollView>

      <View className="pb-8 pt-2">
        <TouchableOpacity
          onPress={onNext}
          disabled={isNextDisabled}
          activeOpacity={0.9}
          className={`${
            isNextDisabled ? "bg-zinc-300 dark:bg-zinc-700" : "bg-[#f39849]"
          } w-full h-[64px] rounded-2xl items-center justify-center shadow-lg flex-row gap-2`}
        >
          {isLastStep ? (
            <MaterialIcons name="check" size={24} color="white" />
          ) : (
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          )}
          <Text className="text-white font-extrabold text-lg">
            {isLastStep ? t("surveyItem.finish") : t("surveyItem.continue")}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
