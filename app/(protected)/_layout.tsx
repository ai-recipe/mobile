import { useAppSelector } from "@/store/hooks";
import { fetchUserAsync } from "@/store/slices/authSlice";
import { fetchGoalPlanActiveAsync } from "@/store/slices/goalPlansSlice";
import { fetchSubscriptionStatus } from "@/store/slices/subscriptionSlice";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function ProtectedLayout() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGoalPlanActiveAsync() as any);
    dispatch(fetchUserAsync() as any);
    dispatch(fetchSubscriptionStatus() as any);
  }, [dispatch]);

  const user = useAppSelector((state) => state.auth.user);
  console.log("user", user);
  // Authenticated and onboarding complete - render protected routes
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
