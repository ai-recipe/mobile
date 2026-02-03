import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { CreditCard } from "../../../components/CreditCard";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme].background;
  const floatAnim = useSharedValue(0);

  React.useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, [floatAnim]);

  const animatedMascotStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatAnim.value },
      { rotate: `${floatAnim.value / 4}deg` },
    ],
  }));

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor }}
        showsVerticalScrollIndicator={false}
      >
        {/* Scan Ingredients Banner */}
        <View className="px-5 pb-2 pt-4">
          <LinearGradient
            colors={
              colorScheme === "dark"
                ? ["#c96a1a", "#e67e22", "#b85c14"]
                : ["#f39849", "#ffb373", "#e67e22"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 36,
              overflow: "hidden",
            }}
          >
            <View className="p-8 relative overflow-hidden">
              <View
                className={`absolute -right-16 -top-16 size-48 rounded-full blur-3xl opacity-50 ${
                  colorScheme === "dark" ? "bg-white/10" : "bg-white/20"
                }`}
              />
              <View
                className={`absolute -left-10 -bottom-10 size-40 rounded-full blur-2xl ${
                  colorScheme === "dark" ? "bg-white/5" : "bg-black/5"
                }`}
              />

              <View className="relative z-10 items-center">
                <View
                  className={`flex-row items-center self-start px-3 py-1.5 rounded-full mb-6 backdrop-blur-md ${
                    colorScheme === "dark"
                      ? "bg-white/20 border border-white/30"
                      : "bg-white/30 border border-white/40"
                  }`}
                >
                  <MaterialIcons
                    name="auto-awesome"
                    size={14}
                    color="white"
                    className="text-white"
                  />
                  <Text className="text-white text-[10px] font-extrabold ml-1.5 uppercase tracking-widest">
                    YAPAY ZEKA SİHİRİ
                  </Text>
                </View>
                <Text className="text-white text-[32px] font-extrabold leading-[1.1] mb-3 text-left w-full">
                  Malzemelerini{"\n"}Tarat
                </Text>
                <Text className="text-white/90 text-[15px] font-medium leading-relaxed mb-8 text-left w-full">
                  Buzdolabındaki malzemeleri saniyeler içinde gurme tariflere
                  dönüştüren yapay zeka gücü.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.95}
                  className={`flex-row items-center justify-center gap-3 w-full h-[60px] rounded-full ${
                    colorScheme === "dark" ? "bg-white/95" : "bg-white"
                  }`}
                  onPress={() => router.push("/screens/ai-scan")}
                >
                  <MaterialIcons
                    name="photo-camera"
                    size={24}
                    color={colorScheme === "dark" ? "#181411" : "#000"}
                  />
                  <Text
                    className={`font-extrabold text-[17px] ${
                      colorScheme === "dark" ? "text-[#181411]" : "text-black"
                    }`}
                  >
                    Taramaya Başla
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
        <CreditCard />

        {/* Mascot Speech Bubble Section 
        <View className="px-5 py-4">
          <View className="bg-[#FFF7ED] dark:bg-zinc-800/40 rounded-3xl p-5 border border-orange-100/50 dark:border-zinc-700/30 flex-row items-center gap-4">
            <Animated.View style={animatedMascotStyle} className="relative">
              <View className="size-16 items-center justify-center bg-white rounded-2xl">
                <MaterialCommunityIcons
                  name="robot"
                  size={42}
                  color="#f39849"
                />
                <View className="absolute -top-3 -right-3 rotate-12">
                  <MaterialIcons name="restaurant" size={20} color="#f39849" />
                </View>
              </View>
            </Animated.View>
            <View className="flex-1">
              <View className="bg-white dark:bg-zinc-700 px-4 py-3 rounded-2xl relative">
          
                <View className="absolute left-[-6px] top-1/2 -translate-y-1/2 size-4 bg-white dark:bg-zinc-700 rotate-45" />
                <Text className="text-[#5a4a3a] dark:text-zinc-200 text-[14px] font-bold leading-snug">
                  {'"Buzdolabında saklanan bir şaheser mi var? Hadi bulalım!"'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        */}
      </ScrollView>
    </ScreenWrapper>
  );
}
