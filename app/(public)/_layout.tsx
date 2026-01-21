import { Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function PublicLayout() {
  // Show loading state while checking auth
  if (false) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="screens/onboarding" />
    </Stack>
  );
}
