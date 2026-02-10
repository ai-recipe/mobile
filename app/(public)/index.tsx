import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function PublicIndex() {
  const { isOnboarded } = useSelector((state: any) => state.auth);
  console.log("isOnboarded", isOnboarded);
  if (isOnboarded) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return <Redirect href="/(public)/screens/onboarding" />;
}
