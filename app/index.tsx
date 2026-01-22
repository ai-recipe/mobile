import { useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";
export default function Index() {
  const isAuthenticated = false;
  const { isOnboarded } = useAppSelector((state) => state.auth);
  console.log("isOnboarded app", isOnboarded);
  if (isAuthenticated || isOnboarded) {
    return <Redirect href="/(protected)/(tabs)" />;
  }
  return <Redirect href="/(public)/screens/onboarding" />;
}
