import { RecipeDetailModal } from "@/app/screens/components/RecipeDetailModal";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";
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

const CopilotView = walkthroughable(View);
export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme].background;
  const floatAnim = useSharedValue(0);

  const { start, copilotEvents } = useCopilot();

  React.useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000 }),
        withTiming(0, { duration: 2000 }),
      ),
      -1,
      true,
    );

    const checkFirstTime = async () => {
      const hasSeenTour = await AsyncStorage.getItem("hasSeenTour");
      if (false) {
        setTimeout(() => {
          start();
        }, 1000);
      }
    };

    checkFirstTime();

    copilotEvents.on("stop", () => {
      AsyncStorage.setItem("hasSeenTour", "true");
    });
  }, [floatAnim, start, copilotEvents]);

  const animatedMascotStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatAnim.value },
      { rotate: `${floatAnim.value / 4}deg` },
    ],
  }));

  const [selectedRecipe, setSelectedRecipe] = React.useState({
    id: "48c2b9e2-64ee-4c63-a884-14e2e61af9cf",
    title: "Vegetable Fried Rice",
    description:
      "Quick and flavorful fried rice loaded with colorful vegetables",
    imageUrl:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=480",
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    totalTimeMinutes: 30,
    difficulty: "EASY",
    servings: 4,
    matchPercentage: 40,
    matchedIngredients: ["onion", "garlic"],
    missingIngredients: ["Rice", "Egg", "Bell Pepper"],
    steps: [
      "Cook rice and let it cool (or use day-old rice)",
      "Scramble eggs in wok, set aside",
      "Stir-fry vegetables until tender-crisp",
      "Add rice and eggs, season with soy sauce",
    ],
    dietaryTags: ["VEGETARIAN"],
    nutritionSummary: {
      calories: 320,
      protein: 10,
      carbs: 52,
      fat: 8,
    },
  });

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor }}
        showsVerticalScrollIndicator={false}
      >
        {/* Scan Ingredients Banner 
        <Button
          title="Scan Ingredients"
          onPress={() => setIsModalVisible(true)}
        />*/}
        <RecipeDetailModal
          recipe={selectedRecipe}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
        <UpgradeProCard />
        <CreditCard />
        {/* How it Works Section */}
        <View className="px-5 pt-8">
          <CopilotStep
            order={1}
            name="hosgeldiniz"
            text="Tarif AI'ya hoş geldin! Mutfağındaki ürünlerle harikalar yaratmaya hazır mısın? Hadi turumuza başlayalım."
            key="hosgeldiniz"
          >
            <CopilotView className="mb-8 px-1">
              <Text className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-3">
                Nasıl <Text className="text-[#f39849]">Çalışır?</Text>
              </Text>
              <Text className="text-zinc-500 dark:text-zinc-400 text-[16px] leading-relaxed font-medium">
                Yapay zeka ile mutfakta devrim yaratmaya hazır mısınız? Sadece
                birkaç adımda akşam yemeğiniz hazır.
              </Text>
            </CopilotView>
          </CopilotStep>

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
