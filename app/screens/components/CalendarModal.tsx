import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
}

export function CalendarModal({
  visible,
  onClose,
  onConfirm,
  initialDate = new Date(),
}: CalendarModalProps) {
  const colorScheme = useColorScheme();
  const [tempDate, setTempDate] = useState(initialDate);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);
  };

  const handleConfirm = () => {
    onConfirm(tempDate);
    onClose();
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
              Select Date
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

          {/* Picker Area */}
          <View className="p-4 items-center">
            <DateTimePicker
              value={tempDate}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onChange}
              accentColor="#f39849"
              textColor={colorScheme === "dark" ? "#ffffff" : "#000000"}
              themeVariant={colorScheme}
            />
          </View>

          {/* Footer Actions */}
          <View className="p-6 flex-row gap-4 border-t border-zinc-100 dark:border-zinc-800">
            <Pressable
              onPress={onClose}
              className="flex-1 py-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800"
            >
              <Text className="text-center font-bold text-zinc-500 dark:text-zinc-400">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              className="flex-1 py-3.5 rounded-xl bg-[#f39849]"
            >
              <Text className="text-center font-bold text-white">Confirm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
