import { Stack } from "expo-router";
import React from "react";

export default function ProtectedLayout() {
  // Authenticated and onboarding complete - render protected routes
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
