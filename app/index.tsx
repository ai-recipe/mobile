import { useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";
export default function Index() {
  const isAuthenticated = false;
  const { isOnboarded, isOnboardingStateLoaded } = useAppSelector(
    (state) => state.auth,
  );

  if (!isOnboardingStateLoaded) {
    return null;
  }
  if (isAuthenticated || isOnboarded) {
    return <Redirect href="/(protected)/(tabs)" />;
  }
  return <Redirect href="/(public)/screens/onboarding" />;
}
