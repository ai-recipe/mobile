import React from "react";
import { Text } from "react-native";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

export default function ScanScreen() {
  return (
    <ScreenWrapper withTabBar>
      <Text className="text-xl font-bold p-5">Tarat</Text>
    </ScreenWrapper>
  );
}
