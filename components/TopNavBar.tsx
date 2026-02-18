import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setTheme } from "@/store/slices/uiSlice";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

import { useRouter } from "expo-router";

export const TopNavBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";

  const toggleTheme = () => {
    const nextTheme = colorScheme === "dark" ? "light" : "dark";
    dispatch(setTheme(nextTheme));
  };

  return (
    <View style={[styles.header, { borderBottomColor: theme.border }]}>
      <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
        <MaterialIcons
          name={isDark ? "light-mode" : "dark-mode"}
          size={24}
          color={theme.text}
        />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{"Chad AI"}</Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/profile")}
        style={styles.iconButton}
      >
        <MaterialIcons name="account-circle" size={28} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
