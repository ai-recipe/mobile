import { setIsOnboarded } from "@/store/slices/authSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const STEPS = [
  {
    id: 1,
    title: "Yapay Zeka ile Tara",
    description:
      "Dolabındakilerin fotoğrafını çek, gelişmiş yapay zekamız malzemeleri anında tanısın ve size en uygun seçenekleri sunsun.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfIOgyd-AArVUDn1vb4CK8i67wcKT_M3vbkOOK8sLATy9sWjjGWTkVsKUniY-YMzQ5EsUUlioSsVy-A0JpUhqZeDnS-kr6MsPQePrWnEMQaXgpGxQg58LSGOfiWXblMOYUwtYVyaG10MQjHhJLQ4xVfaVh8OP9UPXUo8X6OVBLDa7lbl80-3kOMowAFVzdXK3B-ePh2lHjjPa8YQzOY45LNBsDal19fkfDFvMWo7X_KBWWPJWA49zi7IKR-2vs0iRk7NW7TIcFHs4r",
  },
  {
    id: 2,
    title: "Akıllı Tercihler",
    description:
      "Yapay zeka, beslenme alışkanlıklarınıza ve vaktinize göre seçimlerinizi optimize eder.",
  },
  {
    id: 3,
    title: "AI Şefiniz Hazır",
    description:
      "Algoritmalarımız milyonlarca tarif arasından dolabındaki malzemelere en uygun olanı senin için hazırladı.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmjOmiiS239943G5GLit-7rAuZrgKXGh9Bc8NmzdnEat5Tca7seP4lbVgd_YpABEBnj5MB8o-2df00VKO7Ly9lVm0OK3W2Uv6-29sO32LJyRVXt4hXcxBkdCcVnG9m21yAOcW38J27m3HAPW6w_9t2LcT00CzhDkXSqSgrcJh3ZRqxdV8MdyYSTmlgYpnWVtEMU5M-4h4S7_uOgymVtNpm0gsPEFvSsbkE_N7ueLIC5e9jLOp0X3O3jyL5MUPcVJFtbfW_RjJ4bX-p",
  },
];

const PREP_TIMES = [
  {
    id: "15",
    label: "15 Dakika",
    sub: "Hızlı ve pratik tarifler",
    icon: "clock-outline",
  },
  {
    id: "30",
    label: "30 Dakika",
    sub: "Standart akşam yemekleri",
    icon: "timer-outline",
  },
  {
    id: "60",
    label: "60+ Dakika",
    sub: "Gurme deneyimler için",
    icon: "history",
  },
];

const DIETARY = [
  "Vegan",
  "Vejetaryen",
  "Glutensiz",
  "Keto",
  "Paleo",
  "Laktozsuz",
  "Düşük Karbonhidrat",
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPrepTime] = useState("30");
  const [selectedDietary] = useState(["Vegan", "Glutensiz"]);
  const dispatch = useDispatch();

  const scanPos = useSharedValue(0);

  useEffect(() => {
    if (currentStep === 0) {
      scanPos.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
    }
  }, [currentStep, scanPos]);

  const animatedScanStyle = useAnimatedStyle(() => ({
    top: `${20 + scanPos.value * 60}%`,
  }));

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      AsyncStorage.setItem("isOnboarded", "true");

      router.replace("/(public)/screens/login");
      dispatch(setIsOnboarded(true));
    }
  };

  const renderProgress = () => (
    <View className="flex-row justify-center items-center gap-3 py-6">
      {STEPS.map((_, index) => (
        <View
          key={index}
          className={`h-2 rounded-full ${
            currentStep === index
              ? "w-8 bg-primary"
              : "w-2 bg-gray-300 dark:bg-gray-700"
          }`}
        />
      ))}
    </View>
  );

  const renderStep0 = () => (
    <View className="flex-1 px-6">
      <View className="flex-1 justify-center items-center">
        <View className="w-full aspect-square bg-primary/10 rounded-3xl items-center justify-center border-primary/20 overflow-hidden">
          {/* Phone Illustration Mockup */}
          <View className="w-48 h-80 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-4 border-gray-100 dark:border-gray-700 overflow-hidden relative">
            <View className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full z-10" />
            <View className="mt-8 flex-1 bg-gray-50 dark:bg-gray-900 m-2 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Image
                source={{ uri: STEPS[0].image }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
              <View className="absolute inset-2 border-2 border-primary rounded-lg items-center justify-center">
                <View className="bg-primary/90 px-3 py-1 rounded-full mb-1">
                  <Text className="text-[10px] text-white font-bold">
                    Domates
                  </Text>
                </View>
                <View className="bg-primary/90 px-3 py-1 rounded-full">
                  <Text className="text-[10px] text-white font-bold">
                    Biber
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Scanning Line Animation */}
          <Animated.View
            style={[animatedScanStyle]}
            className="absolute left-0 right-0 h-1 bg-primary shadow-lg shadow-primary"
          />
        </View>
      </View>

      <View className="py-8 items-center">
        <Text className="text-3xl font-black text-center text-text dark:text-white mb-3">
          {STEPS[0].title}
        </Text>
        <Text className="text-base text-center text-secondary dark:text-gray-300 leading-relaxed font-medium">
          {STEPS[0].description}
        </Text>
      </View>

      <View className="pb-10">
        <Pressable
          onPress={nextStep}
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

  const renderStep1 = () => (
    <View className="flex-1">
      <ScrollView className="flex-1 px-6">
        <Text className="text-2xl font-black text-text dark:text-white mt-4 mb-2">
          Hazırlık Süresi
        </Text>
        <Text className="text-sm text-secondary mb-6 font-medium">
          Yemek hazırlamak için ne kadar vaktin var?
        </Text>

        <View className="gap-4 mb-10">
          {PREP_TIMES.map((time) => (
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
          {DIETARY.map((item) => {
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
          onPress={nextStep}
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

  const renderStep2 = () => (
    <View className="flex-1">
      <ScrollView className="flex-1 px-6">
        <View className="py-12 items-center">
          <View
            style={{ transform: [{ rotate: "3deg" }] }}
            className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <Image
              source={{ uri: STEPS[2].image }}
              className="w-full aspect-[4/3]"
              contentFit="cover"
            />
            <View className="absolute top-4 right-4 bg-white/95 px-4 py-1.5 rounded-full shadow-md">
              <Text className="text-text font-black text-[10px]">
                ORTA SEVİYE
              </Text>
            </View>
            <View className="p-8">
              <Text className="text-primary text-xs font-black tracking-widest uppercase mb-2">
                SANA ÖZEL TARİF
              </Text>
              <Text className="text-2xl font-black text-text dark:text-white mb-3">
                Fırında Baharatlı Somon
              </Text>
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#f39849"
                />
                <Text className="text-secondary text-sm font-bold ml-1.5">
                  25 dk Hazırlık
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="items-center py-6">
          <Text className="text-4xl font-black text-text dark:text-white text-center mb-4">
            {STEPS[2].title}
          </Text>
          <Text className="text-lg text-secondary dark:text-gray-300 text-center leading-relaxed font-medium">
            {STEPS[2].description}
          </Text>
        </View>
      </ScrollView>

      <View className="p-10 pb-12">
        <Pressable
          onPress={nextStep}
          className="w-full bg-primary py-5 rounded-full shadow-xl shadow-primary/30 flex-row items-center justify-center gap-2 active:opacity-95"
        >
          <Text className="text-white text-lg font-bold">Hadi Başlayalım</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-darker">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <View className="w-12" />
        <Text className="text-xl font-black text-text dark:text-white">
          {currentStep === 0
            ? ""
            : currentStep === 1
              ? "Tercihlerini Belirle"
              : ""}
        </Text>
        <View className="w-12" />
      </View>

      {renderProgress()}

      {currentStep === 0 && renderStep0()}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
    </SafeAreaView>
  );
}
