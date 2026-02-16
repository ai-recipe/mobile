import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

interface GenderPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (gender: string) => void;
  currentValue?: string;
}

const GENDER_OPTIONS = [
  { label: "Male", value: "Male", icon: "male" as const },
  { label: "Female", value: "Female", icon: "female" as const },
  { label: "Other", value: "Other", icon: "person" as const },
];

export function GenderPickerModal({
  visible,
  onClose,
  onSelect,
  currentValue,
}: GenderPickerModalProps) {
  const colorScheme = useColorScheme();
  const [selectedGender, setSelectedGender] = useState(currentValue);

  // Update internal state when currentValue changes or modal opens
  useEffect(() => {
    if (visible) {
      setSelectedGender(currentValue);
    }
  }, [visible, currentValue]);

  const handleSave = () => {
    if (selectedGender) {
      onSelect(selectedGender);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center px-6">
        <View className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <View className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex-row justify-between items-center">
            <Text className="text-lg font-bold text-zinc-900 dark:text-white">
              Select Gender
            </Text>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center"
            >
              <MaterialIcons
                name="close"
                size={18}
                color={Colors[colorScheme].icon}
              />
            </Pressable>
          </View>

          {/* Options */}
          <View className="p-4">
            {GENDER_OPTIONS.map((option) => {
              const isSelected = selectedGender === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setSelectedGender(option.value)}
                  className={`flex-row items-center p-4 mb-2 rounded-2xl border ${
                    isSelected
                      ? "bg-primary/5 border-primary"
                      : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800"
                  }`}
                >
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                      isSelected ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
                  >
                    <MaterialIcons
                      name={option.icon}
                      size={20}
                      color={isSelected ? "white" : "#71717a"}
                    />
                  </View>
                  <Text
                    className={`text-base flex-1 ${
                      isSelected
                        ? "font-bold text-zinc-900 dark:text-white"
                        : "text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <MaterialIcons name="check" size={20} color="#f39849" />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Footer Actions */}
          <View className="p-6 flex-row gap-4 border-t border-zinc-100 dark:border-zinc-800">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 py-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800"
            >
              <Text className="text-center font-bold text-zinc-500 dark:text-zinc-400">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 py-3.5 rounded-xl bg-primary"
            >
              <Text className="text-center font-bold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
