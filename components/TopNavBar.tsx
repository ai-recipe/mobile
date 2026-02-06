import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import i18n from "@/i18n";
import { RootState } from "@/store";
import { setCurrentLanguage } from "@/store/slices/appSlice";
import { setTheme } from "@/store/slices/uiSlice";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export const TopNavBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";

  const currentLanguage = useSelector(
    (state: RootState) => state.app.currentLanguage,
  );

  const toggleTheme = () => {
    const nextTheme = colorScheme === "dark" ? "light" : "dark";
    dispatch(setTheme(nextTheme));
  };

  const toggleLanguage = () => {
    const nextLang = currentLanguage === "en" ? "tr" : "en";
    i18n.changeLanguage(nextLang);
    dispatch(setCurrentLanguage(nextLang));
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
        <Text style={[styles.title, { color: theme.text }]}>
          {t("app_name")}
        </Text>
      </View>

      <TouchableOpacity onPress={toggleLanguage} style={styles.iconButton}>
        <Text style={[styles.langText, { color: theme.text }]}>
          {currentLanguage.toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
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
  langText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
