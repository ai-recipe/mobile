import { useAppSelector } from "@/store/hooks";
import { Redirect, Stack } from "expo-router";

export default function PublicLayout() {
  const { isOnboarded } = useAppSelector((state) => state.auth);

  if (false) {
    //todo
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="screens/onboarding" />
      <Stack.Screen name="screens/login" />
      <Stack.Screen name="screens/register" />
    </Stack>
  );
}
