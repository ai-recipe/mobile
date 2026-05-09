import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type AddMealOption = "manual" | "foods";

interface Option {
  key: AddMealOption;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  titleKey: string;
  subtitleKey: string;
}

const OPTIONS: Option[] = [
  {
    key: "manual",
    icon: "edit",
    iconBg: "bg-orange-50 dark:bg-orange-900/30",
    iconColor: "#f39849",
    titleKey: "addMealOptions.manual",
    subtitleKey: "addMealOptions.manualSub",
  },
  {
    key: "foods",
    icon: "search",
    iconBg: "bg-indigo-50 dark:bg-indigo-900/30",
    iconColor: "#6366f1",
    titleKey: "addMealOptions.foods",
    subtitleKey: "addMealOptions.foodsSub",
  },
];

interface AddMealOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: AddMealOption) => void;
}

export function AddMealOptionsModal({
  visible,
  onClose,
  onSelect,
}: AddMealOptionsModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        <Pressable
          className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-3xl px-6 pt-5"
          style={{ paddingBottom: insets.bottom + 24 }}
          onPress={() => {}}
        >
          {/* Handle */}
          <View className="w-10 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full mx-auto mb-5" />

          {/* Title */}
          <Text className="text-xl font-bold text-zinc-900 dark:text-white text-center mb-2">
            {t("addMealOptions.title")}
          </Text>
          <Text className="text-sm text-zinc-400 dark:text-zinc-500 text-center mb-6">
            {t("addMealOptions.subtitle")}
          </Text>

          {/* 2-column grid */}
          <View className="flex-row gap-3 mb-3">
            {OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                onPress={() => onSelect(opt.key)}
                className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-4 active:opacity-70"
              >
                {/* Icon */}
                <View
                  className={`w-12 h-12 rounded-xl ${opt.iconBg} flex items-center justify-center mb-3`}
                >
                  <MaterialIcons
                    name={opt.icon}
                    size={26}
                    color={opt.iconColor}
                  />
                </View>

                <Text className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                  {t(opt.titleKey)}
                </Text>
                <Text className="text-xs text-zinc-400 dark:text-zinc-500 leading-4">
                  {t(opt.subtitleKey)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Cancel */}
          <Pressable
            onPress={onClose}
            className="py-3.5 rounded-full border border-zinc-200 dark:border-zinc-700"
          >
            <Text className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 text-center">
              {t("common.cancel")}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
