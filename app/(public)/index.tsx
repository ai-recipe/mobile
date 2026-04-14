import { useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";

export default function PublicIndex() {
  const { isAuthenticated, isOnboarded } = useAppSelector(
    (state) => state.auth,
  );

  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)" />;
  }
  if (isOnboarded) {
    return <Redirect href="/(public)/screens/login" />;
  }
  return <Redirect href="/(public)/screens/onboarding" />;
}
