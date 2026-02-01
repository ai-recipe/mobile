import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

export default function LoginScreen() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    console.log("Google Login Triggered");
    // Implement standard Google Auth Session here
  };

  const handleAppleLogin = () => {
    console.log("Apple Login Triggered");
    router.replace("/(protected)/(tabs)");
    // Implement expo-apple-authentication here
  };

  const handleGuestAccess = () => {
    router.replace("/home"); // Skip to main app
  };

  return (
    <ScreenWrapper withTabNavigation={false}>
      <View className="flex-1 justify-between">
        {/* Top Visual Section */}
        <Animated.View
          entering={FadeInUp.duration(1000).springify()}
          className="flex-1 items-center justify-center relative"
        >
          {/* Background Decorative Blobs */}
          <View className="absolute top-10 left-[-50] size-64 bg-orange-400/20 rounded-full blur-3xl" />
          <View className="absolute bottom-10 right-[-50] size-64 bg-blue-400/10 rounded-full blur-3xl" />

          {/* Main Illustration (Placeholder or Icon) */}
          <View className="items-center justify-center mb-8">
            <View className="size-32 bg-white dark:bg-zinc-800 rounded-[40px] items-center justify-center shadow-2xl shadow-orange-500/30 rotate-3">
              <MaterialCommunityIcons
                name="chef-hat"
                size={64}
                color="#f39849"
              />
            </View>
            <View className="absolute -bottom-4 -right-4 bg-zinc-900 dark:bg-white p-3 rounded-2xl rotate-[-6deg] shadow-lg">
              <MaterialCommunityIcons
                name="auto-awesome"
                size={24}
                color={"#f39849"}
              />
            </View>
          </View>

          {/* Welcome Text */}
          <View className="px-10">
            <Text className="text-4xl font-black text-center text-zinc-900 dark:text-white leading-tight mb-4">
              Mutfakta <Text className="text-[#f39849]">Sihir</Text> Yaratın
            </Text>
            <Text className="text-zinc-500 dark:text-zinc-400 text-center text-base font-medium leading-relaxed">
              Yapay zeka şefiniz ile buzdolabındaki malzemeleri gurme tariflere
              dönüştürün.
            </Text>
          </View>
        </Animated.View>

        {/* Bottom Action Section */}
        <Animated.View
          entering={FadeInDown.duration(1000).delay(200).springify()}
          className="w-full px-6 pb-12 pt-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-t-[40px] border-t border-white/20"
        >
          {/* Apple Button */}
          <TouchableOpacity
            onPress={handleAppleLogin}
            activeOpacity={0.8}
            className="w-full h-14 bg-black dark:bg-white rounded-full flex-row items-center justify-center mb-4 shadow-lg shadow-black/20"
          >
            <AntDesign
              size={24}
              color="gray"
              className="text-white dark:text-black absolute left-6"
            />
            {/* Note: Icon color logic is handled by class/parent in real CSS, simpler here to just force contrast if needed or rely on theme */}
            <View className="absolute left-6">
              <AntDesign size={24} className="text-white dark:text-black" />
            </View>
            <Text className="text-white dark:text-black font-bold text-[17px]">
              Apple ile Devam Et
            </Text>
          </TouchableOpacity>

          {/* Google Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
            className="w-full h-14 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full flex-row items-center justify-center mb-6 shadow-sm"
          >
            <View className="absolute left-6">
              <AntDesign name="google" size={24} color="#EA4335" />
            </View>
            <Text className="text-zinc-700 dark:text-zinc-200 font-bold text-[17px]">
              Google ile Devam Et
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
}
