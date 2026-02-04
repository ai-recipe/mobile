import { useAppSelector } from "@/store/hooks";
import { initDeviceAsync } from "@/store/slices/authSlice";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function PublicLayout() {
  const { isOnboarded } = useAppSelector((state) => state.auth);
  const { currentLanguage } = useAppSelector((state) => state.app);
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentLanguage) {
      dispatch(initDeviceAsync({ locale: currentLanguage }) as any);
    }
  }, [dispatch, currentLanguage]);

  if (isOnboarded) {
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
