import { useAppSelector } from "@/store/hooks";
import { initDeviceAsync } from "@/store/slices/authSlice";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function PublicLayout() {
  const { isOnboarded } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initDeviceAsync() as any);
  }, [dispatch]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="screens/onboarding" />
      <Stack.Screen name="screens/login" />
      <Stack.Screen name="screens/register" />
    </Stack>
  );
}
