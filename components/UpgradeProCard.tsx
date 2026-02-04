import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const UpgradeProCard = () => {
  const router = useRouter();
  return (
    <View className="px-5 pt-4">
      <View className="bg-primary p-5 rounded-[28px] overflow-hidden border border-white/20">
        {/* Decorative elements */}
        <View className="absolute -right-8 -top-8 size-32 bg-white/10 rounded-full blur-3xl" />
        <View className="absolute -left-10 -bottom-10 size-24 bg-white/5 rounded-full blur-2xl" />

        <View className="flex-row items-center gap-4 mb-5">
          <View className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30">
            <MaterialCommunityIcons name="crown" size={30} color="#FDE047" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-black text-xl leading-tight">
              Pro&apos;ya Yükselt
            </Text>
            <Text className="text-white/80 text-sm font-medium">
              Günde 3 ekstra kredi ve daha fazlası!
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(protected)/subscription")}
          activeOpacity={0.9}
          className="flex-1 flex-row items-center justify-center gap-2 bg-white/20 backdrop-blur-md py-3.5 rounded-2xl border border-white/30"
        >
          <Text className="text-white font-black text-sm uppercase tracking-wider">
            Şimdi Yükselt
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
