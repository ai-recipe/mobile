import { Stack } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Text } from "react-native";

export default function OnboardingScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} className=""></Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
