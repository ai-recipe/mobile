import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePersonalDetailsAsync } from "@/store/slices/userSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { parse } from "date-fns";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CalendarModal } from "../../screens/components/CalendarModal";
import { GenderPickerModal } from "../../screens/components/GenderPickerModal";
import { RulerPickerModal } from "../../screens/components/RulerPickerModal";

const PersonalDetailItem = ({
  label,
  value,
  onPress,
  isLast = false,
}: {
  label: string;
  value: any;
  onPress?: () => void;
  isLast?: boolean;
}) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`flex-row items-center justify-between p-5 ${
        !isLast ? "border-b border-zinc-100 dark:border-zinc-800" : ""
      }`}
    >
      <Text className="text-base text-zinc-500 dark:text-zinc-400">
        {label}
      </Text>
      <View className="flex-row items-center gap-3">
        <Text className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {value}
        </Text>
        <MaterialIcons
          name="edit"
          size={18}
          color={colorScheme === "dark" ? "#71717a" : "#d4d4d8"}
        />
      </View>
    </TouchableOpacity>
  );
};

const GoalsAndWeight = () => {
  const { personalDetails } = useAppSelector((state) => state.user);
  const [activeModal, setActiveModal] = useState<
    null | "goalWeight" | "currentWeight" | "height" | "dob" | "gender"
  >(null);
  const dispatch = useAppDispatch();

  const handleSave = (newValue: any) => {
    if (!activeModal) return;

    const unit = activeModal === "height" ? "cm" : "kg";
    dispatch(
      updatePersonalDetailsAsync({
        goalWeight:
          activeModal === "goalWeight" ? newValue : personalDetails?.goalWeight,
        currentWeight:
          activeModal === "currentWeight"
            ? newValue
            : personalDetails?.currentWeight,
        height: activeModal === "height" ? newValue : personalDetails?.height,
      }),
    );
    setActiveModal(null);
  };

  const modalConfig = useMemo(
    () => ({
      goalWeight: {
        title: "Goal weight",
        unit: "kg",
        min: 30,
        max: 200,
        step: 0.1,
        initial: parseFloat(personalDetails?.goalWeight?.toString() || "0"),
      },
      currentWeight: {
        title: "Current weight",
        unit: "kg",
        min: 30,
        max: 200,
        step: 0.1,
        initial: parseFloat(personalDetails?.currentWeight?.toString() || "0"),
      },
      height: {
        title: "Height",
        unit: "cm",
        min: 100,
        max: 250,
        step: 1,
        initial: parseFloat(personalDetails?.height?.toString() || "0"),
      },
    }),
    [personalDetails],
  );

  return (
    <ScreenWrapper
      showBackButton={true}
      showTopNavBar={false}
      withTabNavigation={true}
    >
      <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Goal Weight Card */}
          <View className="bg-white dark:bg-zinc-900 rounded-[28px] p-6 mb-6  border border-zinc-100 dark:border-zinc-800 flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                Goal Weight
              </Text>
              <Text className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {personalDetails?.goalWeight}
              </Text>
            </View>

            <TouchableOpacity
              className="bg-primary px-6 py-3 rounded-full shadow-md"
              onPress={() => setActiveModal("goalWeight")}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-md">Change Goal</Text>
            </TouchableOpacity>
          </View>

          {/* Details List */}
          <View className="bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden  border border-zinc-100 dark:border-zinc-800">
            <PersonalDetailItem
              label="Current weight"
              value={personalDetails?.currentWeight}
              onPress={() => setActiveModal("currentWeight")}
            />
            <PersonalDetailItem
              label="Height"
              value={personalDetails?.height}
              onPress={() => setActiveModal("height")}
            />
            <PersonalDetailItem
              label="Date of birth"
              value={personalDetails?.dateOfBirth}
              onPress={() => setActiveModal("dob")}
            />
            <PersonalDetailItem
              label="Gender"
              value={personalDetails?.gender}
              onPress={() => setActiveModal("gender")}
            />
          </View>
        </ScrollView>
      </View>

      {activeModal && activeModal !== "dob" && activeModal !== "gender" && (
        <RulerPickerModal
          visible={!!activeModal}
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
          title={modalConfig[activeModal].title}
          unit={modalConfig[activeModal].unit}
          min={modalConfig[activeModal].min}
          max={modalConfig[activeModal].max}
          step={modalConfig[activeModal].step}
          fractionDigits={modalConfig[activeModal].step < 1 ? 1 : 0}
          initialValue={modalConfig[activeModal].initial}
        />
      )}

      <CalendarModal
        visible={activeModal === "dob"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleSave}
        initialDate={parse(
          personalDetails?.dateOfBirth || "",
          "MM/dd/yyyy",
          new Date(),
        )}
      />

      <GenderPickerModal
        visible={activeModal === "gender"}
        onClose={() => setActiveModal(null)}
        onSelect={(gender) => {
          handleSave(gender);
          setActiveModal(null);
        }}
        currentValue={personalDetails?.gender}
      />
    </ScreenWrapper>
  );
};

export default GoalsAndWeight;
