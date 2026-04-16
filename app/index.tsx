import { useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated, isOnboarded } = useAppSelector(
    (state) => state.auth,
  );

  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)" />;
  }
  return <Redirect href="/(public)/screens/login" />;
}
