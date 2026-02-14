import { ScreenWrapper } from "@/components/ScreenWrapper";
import i18n from "@/i18n";
import { AppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { setCurrentLanguage } from "@/store/slices/appSlice";
import type { ThemePreference } from "@/store/slices/uiSlice";
import { setTheme } from "@/store/slices/uiSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System (device)" },
];

const LANGUAGE_OPTIONS = [
  { value: "tr", label: "Türkçe" },
  { value: "en", label: "English" },
];

const ProfileScreen = () => {
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const currentTheme = useAppSelector((state) => state.ui.theme);
  const currentLanguage = useAppSelector((state) => state.app.currentLanguage);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSelectTheme = (theme: ThemePreference) => {
    dispatch(setTheme(theme));
    setThemeModalVisible(false);
  };

  const handleSelectLanguage = (lang: string) => {
    if (lang === currentLanguage) return;
    i18n.changeLanguage(lang);
    dispatch(setCurrentLanguage(lang));
    setLanguageModalVisible(false);
  };

  return (
    <ScreenWrapper
      showBackButton={true}
      showTopNavBar={false}
      withTabNavigation={false}
      title="Profil"
    >
      <ScrollView className="flex-1 bg-white dark:bg-zinc-900 px-5 mt-16">
        <View className="gap-y-3">
          <TouchableOpacity
            onPress={() => router.push("/subscription" as any)}
            className="flex-row items-center p-4 bg-orange-50 dark:bg-orange-500/10 rounded-2xl border border-orange-100 dark:border-orange-500/20"
          >
            <MaterialIcons name="auto-awesome" size={24} color="#f48c25" />
            <Text className="ml-4 flex-1 font-bold text-[#f48c25]">
              {"Pro'ya Yükselt"}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#f48c25" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setThemeModalVisible(true)}
            className="flex-row items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700"
          >
            <MaterialIcons name="palette" size={24} color="#f39849" />
            <Text className="ml-4 flex-1 font-bold text-zinc-700 dark:text-zinc-200">
              Görünüm (Tema)
            </Text>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400 mr-2 capitalize">
              {currentTheme}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#a1a1aa" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setLanguageModalVisible(true)}
            className="flex-row items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700"
          >
            <MaterialIcons name="language" size={24} color="#f39849" />
            <Text className="ml-4 flex-1 font-bold text-zinc-700 dark:text-zinc-200">
              Uygulama Dili
            </Text>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400 mr-2 uppercase">
              {currentLanguage}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#a1a1aa" />
          </TouchableOpacity>
          <ProfileMenuItem
            icon="history"
            label="Geçmiş Tarifler"
            onPress={() => router.push("/screens/ai-recipes" as any)}
          />
          <ProfileMenuItem
            icon="help-outline"
            label="Yardım ve Destek"
            onPress={() => {}}
          />
        </View>
      </ScrollView>

      <Modal
        visible={themeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center px-6"
          onPress={() => setThemeModalVisible(false)}
        >
          <Pressable
            className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="p-4 border-b border-zinc-100 dark:border-zinc-700">
              <Text className="text-lg font-bold text-zinc-900 dark:text-white">
                Görünüm (Tema)
              </Text>
            </View>
            {THEME_OPTIONS.map(({ value, label }) => (
              <TouchableOpacity
                key={value}
                onPress={() => handleSelectTheme(value)}
                className="flex-row items-center justify-between px-4 py-4 border-b border-zinc-100 dark:border-zinc-700 last:border-b-0"
              >
                <Text className="text-base text-zinc-900 dark:text-white">
                  {label}
                </Text>
                {currentTheme === value && (
                  <MaterialIcons name="check" size={24} color="#f39849" />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center px-6"
          onPress={() => setLanguageModalVisible(false)}
        >
          <Pressable
            className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="p-4 border-b border-zinc-100 dark:border-zinc-700">
              <Text className="text-lg font-bold text-zinc-900 dark:text-white">
                Dil Seçimi
              </Text>
            </View>
            {LANGUAGE_OPTIONS.map(({ value, label }) => (
              <TouchableOpacity
                key={value}
                onPress={() => handleSelectLanguage(value)}
                className="flex-row items-center justify-between px-4 py-4 border-b border-zinc-100 dark:border-zinc-700 last:border-b-0"
              >
                <Text className="text-base text-zinc-900 dark:text-white">
                  {label}
                </Text>
                {currentLanguage === value && (
                  <MaterialIcons name="check" size={24} color="#f39849" />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenWrapper>
  );
};

const ProfileMenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700"
  >
    <MaterialIcons name={icon as any} size={24} color="#f39849" />
    <Text className="ml-4 flex-1 font-bold text-zinc-700 dark:text-zinc-200">
      {label}
    </Text>
    <MaterialIcons name="chevron-right" size={24} color="#a1a1aa" />
  </TouchableOpacity>
);

export default ProfileScreen;
