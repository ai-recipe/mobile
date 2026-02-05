import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { CreditCard } from "../../../components/CreditCard";
import { ScreenWrapper } from "../../../components/ScreenWrapper";
import { UpgradeProCard } from "../../../components/UpgradeProCard";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme].background;
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
      <ScrollView
        className="flex-1"
        style={{ backgroundColor }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 dark:bg-zinc-900 px-5 pt-4">
          <View className="flex-row items-center mb-6">
            <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Tivity <Text className="text-[#f39849]">AI</Text>
            </Text>
          </View>
        </View>
        {/* Scan Ingredients Banner */}

        <UpgradeProCard />
        <CreditCard />
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
        </View>
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
