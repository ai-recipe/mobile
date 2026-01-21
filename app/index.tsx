import { Redirect } from "expo-router";

export default function Index() {
  const isAuthenticated = false;
  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)" />;
  }
  return <Redirect href="/(public)/screens/onboarding" />;
}
