import { FunnyLoader } from "@/components/FunnyLoader";
import useInitApp from "@/hooks/useInitApp";
import { useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated, isOnboarded } = useAppSelector(
    (state) => state.auth,
  );
  const { isLoading } = useAppSelector((state) => state.app);
  useInitApp();
  const { isInitDeviceLoading } = useAppSelector((state) => state.auth);
  if (isLoading || isInitDeviceLoading) {
    return <FunnyLoader />;
  }
  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)" />;
  } else if (isOnboarded) {
    return <Redirect href="/(public)/screens/login" />;
  } else {
    return <Redirect href="/(public)/screens/onboarding" />;
  }
}
