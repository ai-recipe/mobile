import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

interface StepRateUsProps {
  onNext: () => void;
  direction?: "forward" | "backward";
}

const MOCK_REVIEWS = [
  {
    id: "1",
    user: "Ayşe Y.",
    rating: 5,
    comment: "Harika bir uygulama! Mutfak becerilerim çok gelişti. 😍",
  },
  {
    id: "2",
    user: "Mehmet K.",
    rating: 5,
    comment:
      "Yapay zeka şefi gerçekten çok akıllı, eldeki malzemelerle harikalar yaratıyor.",
  },
  {
    id: "3",
    user: "Selin B.",
    rating: 5,
    comment: "Tasarıma bayıldım, kullanımı çok kolay ve tarifler çok lezzetli!",
  },
];

export function StepRateUs({ onNext, direction = "forward" }: StepRateUsProps) {
  const { t } = useTranslation();
  const [userRating, setUserRating] = useState(0);
  const entering = direction === "forward" ? SlideInRight : SlideInLeft;
  const exiting = direction === "forward" ? SlideOutLeft : SlideOutRight;

  const onReview = () => {
    if (Platform.OS === "android") {
      // open play store
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.chefai",
      );
    } else {
      // open app store
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.chefai",
      );
    }
  };
  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      className="flex-1 px-5 pt-2"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="items-center mb-8">
          <View className="bg-orange-100 dark:bg-orange-500/20 p-6 rounded-full mb-6">
            <MaterialCommunityIcons
              name="star-face"
              size={64}
              color="#f39849"
            />
          </View>
          <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white text-center mb-2">
            {t("rateUs.title")}{" "}
            <Text className="text-[#f39849]">{t("rateUs.titleHighlight")}</Text>
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-400 text-base text-center px-4">
            {t("rateUs.subtitle")}
          </Text>
        </View>

        {/* Stars */}
        <View className="flex-row justify-center gap-2 mb-10">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setUserRating(star)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={star <= userRating ? "star" : "star-border"}
                size={48}
                color="#f39849"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Mock Reviews */}
        <View className="gap-4">
          <Text className="text-lg font-bold text-zinc-800 dark:text-zinc-200 ml-1">
            {t("rateUs.userReviews")}
          </Text>
          {MOCK_REVIEWS.map((review, index) => (
            <Animated.View
              key={review.id}
              entering={FadeInDown.delay(index * 200)}
              className="bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-700"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-bold text-zinc-900 dark:text-white">
                  {review.user}
                </Text>
                <View className="flex-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <MaterialIcons
                      key={s}
                      name="star"
                      size={14}
                      color="#f39849"
                    />
                  ))}
                </View>
              </View>
              <Text className="text-zinc-600 dark:text-zinc-400 text-sm italic">
                "{review.comment}"
              </Text>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <View className="pb-8 pt-2">
        <TouchableOpacity
          onPress={onReview}
          activeOpacity={0.9}
          className="bg-[#f39849] w-full h-[64px] rounded-2xl items-center justify-center shadow-lg shadow-orange-500/30"
        >
          <Text className="text-white font-extrabold text-lg">
            {t("rateUs.rateNow")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.7}
          className="mt-4 items-center"
        >
          <Text className="text-zinc-400 font-medium">
            {t("common.maybeLater")}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
