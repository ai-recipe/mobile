import { FunnyLoader } from "@/components/FunnyLoader";
import useInitApp from "@/hooks/useInitApp";
import { useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";
import i18n from "@/i18n";

export default function Index() {
  const {
    isAuthenticated,
    isOnboarded,
    isInitDeviceLoading,
    isPreferencesLoading,
    preferences,
  } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.app);
  useInitApp();

  if (isLoading || isInitDeviceLoading) {
    return <FunnyLoader />;
  }

  if (isAuthenticated) {
    // Wait for preferences to finish loading before deciding where to go
    if (isPreferencesLoading) {
      return <FunnyLoader />;
    }
    // preferences === null means the user hasn't completed the survey yet.
    // fetchUserPreferencesAsync already pushed to /screens/survey — don't
    // override that navigation by redirecting to tabs.
    if (preferences === null) {
      return null;
    }
    return <Redirect href="/(protected)/(tabs)" />;
  }

  if (isOnboarded) {
    return <Redirect href="/(public)/screens/login" />;
  }

  return <Redirect href="/(public)/screens/onboarding" />;
}
