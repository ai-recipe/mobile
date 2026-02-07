import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

interface StepPaywallProps {
  onFinish: () => void;
  direction?: "forward" | "backward";
}

const OFFERS = [
  {
    id: "monthly",
    title: "Aylık",
    price: "$4.99",
    period: "aylık",
    description: "Tüm özelliklere sınırsız erişim",
    featured: false,
  },
  {
    id: "yearly",
    title: "Yıllık",
    price: "$20",
    period: "yıllık",
    description: "Sadece $1.66/ay - 3 Gün Ücretsiz Deneme!",
    featured: true,
    badge: "EN POPÜLER",
  },
  {
    id: "lifetime",
    title: "Ömür Boyu",
    price: "$49.99",
    period: "tek seferlik",
    description: "Sonsuza dek sizin olsun",
    featured: false,
  },
];

const FEATURES = [
  "Sınırsız Yapay Zeka Tarif Oluşturma",
  "Tüm Mutfaklara Erişim",
  "Besin Değerleri Analizi",
  "Favorilere Ekleme ve Kaydetme",
  "Reklamsız Deneyim",
];

export function StepPaywall({
  onFinish,
  direction = "forward",
}: StepPaywallProps) {
  const [selectedOffer, setSelectedOffer] = useState("yearly");
  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;

  return (
    <Animated.View entering={entering} exiting={exiting} className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          paddingTop: 10,
        }}
      >
        {/* Header Section */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white text-center mb-2">
            Chef AI <Text className="text-[#f39849]">Premium</Text>
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-400 text-base text-center">
            Mutfaktaki sınırları kaldırın ve tam potansiyelinizi keşfedin.
          </Text>
        </View>

        {/* Feature List */}
        <View className="gap-3 mb-10 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-[32px]">
          {FEATURES.map((feature, index) => (
            <View key={index} className="flex-row items-center gap-3">
              <View className="bg-[#f39849]/10 rounded-full p-1">
                <MaterialIcons name="check" size={16} color="#f39849" />
              </View>
              <Text className="text-zinc-700 dark:text-zinc-300 font-medium">
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* Offers */}
        <View className="gap-4 mb-8">
          {OFFERS.map((offer) => {
            const isSelected = selectedOffer === offer.id;
            return (
              <TouchableOpacity
                key={offer.id}
                onPress={() => setSelectedOffer(offer.id)}
                activeOpacity={0.8}
                className={`p-5 rounded-[24px] border-2 relative ${
                  isSelected
                    ? "bg-[#f39849]/5 border-[#f39849]"
                    : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700"
                }`}
              >
                {offer.badge && (
                  <View className="absolute -top-3 right-6 bg-[#f39849] px-3 py-1 rounded-full">
                    <Text className="text-white text-[10px] font-black">
                      {offer.badge}
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                      {offer.title}
                    </Text>
                    <Text className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
                      {offer.description}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xl font-black text-zinc-900 dark:text-white">
                      {offer.price}
                    </Text>
                    <Text className="text-zinc-400 text-[10px] uppercase font-bold">
                      {offer.period}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text className="text-center text-[10px] text-zinc-400 px-6 leading-4 mb-10">
          Aboneliğinizi dilediğiniz zaman hesap ayarlarınızdan iptal
          edebilirsiniz. 3 günlük ücretsiz deneme süresi sonunda ücretlendirme
          başlayacaktır.
        </Text>
      </ScrollView>

      {/* Persistence Button */}
      <View className="px-5 pb-8 pt-2">
        <TouchableOpacity
          onPress={onFinish}
          activeOpacity={0.9}
          className="bg-[#f39849] w-full h-[64px] rounded-2xl items-center justify-center shadow-lg shadow-orange-500/30"
        >
          <Text className="text-white font-extrabold text-lg">
            {selectedOffer === "yearly"
              ? "Ücretsiz Denemeyi Başlat"
              : "Abone Ol"}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
