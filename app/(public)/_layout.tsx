import { useAppSelector } from "@/store/hooks";
import { Redirect, Stack } from "expo-router";

export default function PublicLayout() {
  const { isOnboarded } = useAppSelector((state) => state.auth);

  if (isOnboarded) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="screens/onboarding" />
    </Stack>
  );
}
