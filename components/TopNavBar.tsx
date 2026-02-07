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

  const toggleLanguage = (lang: string) => {
    if (lang === currentLanguage) return;
    i18n.changeLanguage(lang);
    dispatch(setCurrentLanguage(lang));
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

      <View
        style={[
          styles.langSwitchContainer,
          { backgroundColor: isDark ? "#18181b" : "#f1f5f9" },
        ]}
      >
        <TouchableOpacity
          onPress={() => toggleLanguage("tr")}
          style={[
            styles.langSwitchOption,
            currentLanguage === "tr" && styles.activeOption,
          ]}
        >
          <Text
            style={[
              styles.langText,
              { color: currentLanguage === "tr" ? "white" : theme.text },
            ]}
          >
            TR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleLanguage("en")}
          style={[
            styles.langSwitchOption,
            currentLanguage === "en" && styles.activeOption,
          ]}
        >
          <Text
            style={[
              styles.langText,
              { color: currentLanguage === "en" ? "white" : theme.text },
            ]}
          >
            EN
          </Text>
        </TouchableOpacity>
      </View>
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
  langSwitchContainer: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 2,
    alignItems: "center",
  },
  langSwitchOption: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 18,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  activeOption: {
    backgroundColor: "#f39849",
  },
  langText: {
    fontSize: 11,
    fontWeight: "800",
  },
});
