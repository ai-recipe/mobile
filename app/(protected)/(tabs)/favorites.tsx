import React from "react";
import { Text } from "react-native";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

export default function FavoritesScreen() {
  return (
    <ScreenWrapper withTabBar>
      <Text className="text-xl font-bold p-5">Favoriler</Text>
    </ScreenWrapper>
  );
}
