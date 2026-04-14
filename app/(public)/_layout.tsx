import { useAppSelector } from "@/store/hooks";
import { Redirect, Stack } from "expo-router";

export default function PublicLayout() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
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
