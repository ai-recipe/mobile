import { useSubscription } from "@/hooks/useSubscription";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StepPaywall } from "./components/StepPaywall";

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const { isProOrTrial, isLoading } = useSubscription();

  // If the user is already subscribed, close the paywall
  useEffect(() => {
    if (!isLoading && isProOrTrial) {
      router.back();
    }
  }, [isProOrTrial, isLoading]);

  return (
    <View
      className="flex-1 bg-white dark:bg-zinc-900"
      style={{ paddingTop: insets.top }}
    >
      <View className="items-end px-4 pb-2">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center active:opacity-70"
        >
          <MaterialIcons name="close" size={20} color="#71717a" />
        </Pressable>
      </View>

      <StepPaywall onFinish={() => router.back()} />
    </View>
  );
}
