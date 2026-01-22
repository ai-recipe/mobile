import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

export default function HomeScreen() {
  const floatAnim = useSharedValue(0);

  React.useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000 }),
        withTiming(0, { duration: 2000 }),
      ),
      -1,
      true,
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
      <StatusBar barStyle="dark-content" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Scan Ingredients Banner */}
        <View className="px-5 pb-2 pt-10">
          <LinearGradient
            colors={["#f39849", "#ffb373", "#e67e22"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 36,
              overflow: "hidden",
            }}
          >
            <View className="p-8  relative overflow-hidden ">
              <View className="absolute -right-16 -top-16 size-48 bg-white/20 rounded-full blur-3xl opacity-50" />
              <View className="absolute -left-10 -bottom-10 size-40 bg-black/5 rounded-full blur-2xl" />

              <View className="relative z-10 items-center">
                <View className="flex-row items-center self-start px-3 py-1.5 rounded-full bg-white/30 border border-white/40 mb-6 backdrop-blur-md">
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
                  className="flex-row items-center justify-center gap-3 bg-white w-full h-[60px] rounded-full "
                >
                  <MaterialIcons name="photo-camera" size={24} color="black" />
                  <Text className="text-black font-extrabold text-[17px]">
                    Taramaya Başla
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Mascot Speech Bubble Section */}
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
                {/* Speech bubble tail simulation */}
                <View className="absolute left-[-6px] top-1/2 -translate-y-1/2 size-4 bg-white dark:bg-zinc-700 rotate-45" />
                <Text className="text-[#5a4a3a] dark:text-zinc-200 text-[14px] font-bold leading-snug">
                  {'"Buzdolabında saklanan bir şaheser mi var? Hadi bulalım!"'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* How it Works Section */}
        <View className="px-5 pt-8">
          <View className="mb-8 px-1">
            <Text className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-3">
              Nasıl <Text className="text-[#f39849]">Çalışır?</Text>
            </Text>
            <Text className="text-zinc-500 dark:text-zinc-400 text-[16px] leading-relaxed font-medium">
              Yapay zeka ile mutfakta devrim yaratmaya hazır mısınız? Sadece
              birkaç adımda akşam yemeğiniz hazır.
            </Text>
          </View>

          <View className="gap-y-4">
            {/* Step 1 */}
            <View className="bg-white/80 dark:bg-zinc-800/50 p-5 rounded-[28px] flex-row items-center border border-white/20 dark:border-zinc-700/30 ">
              <View className="size-14 bg-orange-100 dark:bg-orange-500/10 rounded-2xl items-center justify-center mr-4">
                <MaterialIcons name="photo-camera" size={28} color="#f39849" />
              </View>
              <View className="flex-1">
                <Text className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[2px] mb-1">
                  Adım 1
                </Text>
                <Text className="text-zinc-900 dark:text-zinc-100 font-bold text-[17px] leading-tight">
                  Önce ürünlerinizi tarayınız
                </Text>
              </View>
            </View>

            {/* Step 2 */}
            <View className="bg-white/80 dark:bg-zinc-800/50 p-5 rounded-[28px] flex-row items-center border border-white/20 dark:border-zinc-700/30 ">
              <View className="size-14 bg-orange-100 dark:bg-orange-500/10 rounded-2xl items-center justify-center mr-4">
                <MaterialIcons name="fact-check" size={28} color="#f39849" />
              </View>
              <View className="flex-1">
                <Text className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[2px] mb-1">
                  Adım 2
                </Text>
                <Text className="text-zinc-900 dark:text-zinc-100 font-bold text-[17px] leading-tight">
                  Ürünleri onaylayın veya ekleyin
                </Text>
              </View>
            </View>

            {/* Step 3 */}
            <View className="bg-white/80 dark:bg-zinc-800/50 p-5 rounded-[28px] flex-row items-center border border-white/20 dark:border-zinc-700/30 ">
              <View className="size-14 bg-orange-100 dark:bg-orange-500/10 rounded-2xl items-center justify-center mr-4">
                <MaterialIcons name="timer" size={28} color="#f39849" />
              </View>
              <View className="flex-1">
                <Text className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[2px] mb-1">
                  Adım 3
                </Text>
                <Text className="text-zinc-900 dark:text-zinc-100 font-bold text-[17px] leading-tight">
                  Ne kadar süreniz var?
                </Text>
              </View>
            </View>

            {/* Step 4 */}
            <View className="bg-white/80 dark:bg-zinc-800/50 p-5 rounded-[28px] flex-row items-center border border-white/20 dark:border-zinc-700/30 ">
              <View className="size-14 bg-orange-100 dark:bg-orange-500/10 rounded-2xl items-center justify-center mr-4">
                <MaterialIcons
                  name="manage-accounts"
                  size={28}
                  color="#f39849"
                />
              </View>
              <View className="flex-1">
                <Text className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[2px] mb-1">
                  Adım 4
                </Text>
                <Text className="text-zinc-900 dark:text-zinc-100 font-bold text-[17px] leading-tight">
                  Diyet tercihlerinizi belirleyin
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            className="mt-10 bg-[#f39849] w-full h-[64px] rounded-2xl items-center justify-center flex-row shadow-lg shadow-orange-500/30"
          >
            <Text className="text-white font-extrabold text-[18px] mr-2">
              Hadi Başlayalım
            </Text>
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
