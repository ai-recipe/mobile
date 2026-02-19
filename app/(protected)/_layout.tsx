import { fetchGoalPlanActiveAsync } from "@/store/slices/goalPlansSlice";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function ProtectedLayout() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGoalPlanActiveAsync() as any);
  }, [dispatch]);
  // Authenticated and onboarding complete - render protected routes
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
