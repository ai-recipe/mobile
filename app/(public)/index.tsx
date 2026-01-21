import { Redirect } from "expo-router";

export default function PublicIndex() {
  if (false) {
    return null;
  }

  return <Redirect href="/(public)/screens/onboarding" />;
}
