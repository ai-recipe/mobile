import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function PublicIndex() {
  const { isOnboarded } = useSelector((state: any) => state.auth);

  if (isOnboarded) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return <Redirect href="/(public)/screens/onboarding" />;
}
