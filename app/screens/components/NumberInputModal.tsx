import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

interface NumberInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
  initialValue?: number;
  min?: number;
  max?: number;
  unit?: string;
  title?: string;
  fractionDigits?: number;
}

export function NumberInputModal({
  visible,
  onClose,
  onSave,
  initialValue = 75.4,
  min = 0,
  max = 500,
  unit = "kg",
  title = "Current weight",
  fractionDigits = 1,
}: NumberInputModalProps) {
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    if (visible) {
      setTextValue(initialValue.toFixed(fractionDigits));
    }
  }, [visible, initialValue, fractionDigits]);

  const handleTextChange = (text: string) => {
    const filtered = text.replace(/[^0-9.]/g, "");

    const parts = filtered.split(".");
    if (parts.length > 2) return;

    setTextValue(filtered);
  };

  const handleSave = () => {
    let numValue = parseFloat(textValue);

    if (isNaN(numValue)) {
      numValue = initialValue;
    }

    if (numValue < min) numValue = min;
    if (numValue > max) numValue = max;

    const finalValue = Number(numValue.toFixed(fractionDigits));

    onSave(finalValue);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/40"
      >
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full bg-white dark:bg-[#1a2e22] rounded-t-[32px] p-6 pb-10 shadow-2xl">
          <View className="w-12 h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full self-center mb-6" />

          <View className="flex-row justify-between items-center mb-8">
            <Pressable onPress={onClose} className="p-1">
              <MaterialIcons
                name="close"
                size={24}
                className="text-zinc-400 dark:text-zinc-500"
              />
            </Pressable>
            <Text className="text-xl font-bold text-zinc-900 dark:text-white">
              {title}
            </Text>
            <View style={{ width: 32 }} />
          </View>

          <View className="items-center mb-12 mt-4">
            <View className="flex-row items-baseline border-b-2 border-zinc-200 dark:border-white/20 pb-2 px-6 overflow-visible">
              <TextInput
                value={textValue}
                onChangeText={handleTextChange}
                keyboardType="decimal-pad"
                autoFocus={true}
                maxLength={6}
                selectionColor="#10b981"
                className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tighter text-center min-w-[120px] "
                style={{ fontVariant: ["tabular-nums"] }}
              />
              <Text className="text-2xl font-medium text-zinc-400 dark:text-zinc-500 ml-2">
                {unit}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleSave}
            className="w-full bg-primary dark:bg-white py-4 rounded-2xl active:scale-[0.98]"
          >
            <Text className="text-white dark:text-black text-center font-bold text-lg">
              Save{" "}
              {title.toLowerCase().includes("weight")
                ? "weight"
                : title.toLowerCase()}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
