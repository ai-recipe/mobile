import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { format, parse } from "date-fns";
import React, { useState } from "react";
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
  value: string;
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
  const [details, setDetails] = useState({
    goalWeight: "78.5 kg",
    currentWeight: "75.4 kg",
    height: "168 cm",
    dob: "12/01/1990",
    gender: "Male",
    stepGoal: "10000 steps",
  });

  const [activeModal, setActiveModal] = useState<
    | null
    | "goalWeight"
    | "currentWeight"
    | "height"
    | "stepGoal"
    | "dob"
    | "gender"
  >(null);

  const handleSave = (newValue: number) => {
    if (!activeModal) return;

    const unit =
      activeModal === "height"
        ? "cm"
        : activeModal === "stepGoal"
        ? "steps"
        : "kg";
    setDetails((prev) => ({
      ...prev,
      [activeModal]: `${newValue} ${unit}`,
    }));
    setActiveModal(null);
  };

  const modalConfig = {
    goalWeight: {
      title: "Goal weight",
      unit: "kg",
      min: 30,
      max: 200,
      step: 0.1,
      initial: parseFloat(details.goalWeight),
    },
    currentWeight: {
      title: "Current weight",
      unit: "kg",
      min: 30,
      max: 200,
      step: 0.1,
      initial: parseFloat(details.currentWeight),
    },
    height: {
      title: "Height",
      unit: "cm",
      min: 100,
      max: 250,
      step: 1,
      initial: parseFloat(details.height),
    },
    stepGoal: {
      title: "Daily step goal",
      unit: "steps",
      min: 1000,
      max: 50000,
      step: 500,
      initial: parseFloat(details.stepGoal),
    },
  };

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
                {details.goalWeight}
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
              value={details.currentWeight}
              onPress={() => setActiveModal("currentWeight")}
            />
            <PersonalDetailItem
              label="Height"
              value={details.height}
              onPress={() => setActiveModal("height")}
            />
            <PersonalDetailItem
              label="Date of birth"
              value={details.dob}
              onPress={() => setActiveModal("dob")}
            />
            <PersonalDetailItem
              label="Gender"
              value={details.gender}
              onPress={() => setActiveModal("gender")}
            />
            <PersonalDetailItem
              label="Daily step goal"
              value={details.stepGoal}
              isLast
              onPress={() => setActiveModal("stepGoal")}
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
        onConfirm={(date) => {
          setDetails((prev) => ({
            ...prev,
            dob: format(date, "MM/dd/yyyy"),
          }));
          setActiveModal(null);
        }}
        initialDate={parse(details.dob, "MM/dd/yyyy", new Date())}
      />

      <GenderPickerModal
        visible={activeModal === "gender"}
        onClose={() => setActiveModal(null)}
        onSelect={(gender) => {
          setDetails((prev) => ({
            ...prev,
            gender,
          }));
          setActiveModal(null);
        }}
        currentValue={details.gender}
      />
    </ScreenWrapper>
  );
};

export default GoalsAndWeight;
