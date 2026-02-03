import React from "react";
import { Text } from "react-native";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

export default function ScanScreen() {
  return (
    <ScreenWrapper withTabNavigation>
      <Text className="text-xl font-bold p-5 text-zinc-900 dark:text-white">
        Tarat
      </Text>
    </ScreenWrapper>
  );
}
