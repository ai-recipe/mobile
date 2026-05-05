import { ScreenWrapper } from "@/components/ScreenWrapper";
import TrophyRoom from "@/components/badges/TrophyRoom";
import i18n from "@/i18n";
import { AppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { setCurrentLanguage } from "@/store/slices/appSlice";
import {
  deleteAccountAsync,
  logoutAsync,
  updateLocaleAsync,
} from "@/store/slices/authSlice";
import { selectShouldShowPaywallBanners } from "@/store/slices/subscriptionSlice";
import type { ThemePreference } from "@/store/slices/uiSlice";
import { setTheme } from "@/store/slices/uiSlice";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

const THEME_OPTIONS: { value: ThemePreference; labelKey: string }[] = [
  { value: "light", labelKey: "profile.themeLight" },
  { value: "dark", labelKey: "profile.themeDark" },
  { value: "system", labelKey: "profile.themeSystem" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", key: "en" },
  { value: "tr", label: "Türkçe", key: "tr" },
];

const ProfileScreen = () => {
  const { t } = useTranslation();
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const currentTheme = useAppSelector((state) => state.ui.theme);
  const currentLanguage = useAppSelector((state) => state.app.currentLanguage);
  const user = useAppSelector((state) => state.auth.user);
  const subscription = useAppSelector((state) => state.subscription.data);
  const shouldShowPaywallBanners = useAppSelector(
    selectShouldShowPaywallBanners,
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSelectTheme = (theme: ThemePreference) => {
    dispatch(setTheme(theme));
    setThemeModalVisible(false);
  };

  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleSelectLanguage = async (lang: string) => {
    if (lang === currentLanguage) return;
    await AsyncStorage.setItem("CURRENT_LANGUAGE", lang);
    i18n.changeLanguage(lang);
    dispatch(updateLocaleAsync(lang));
    dispatch(setCurrentLanguage(lang));
    setLanguageModalVisible(false);
  };

  const handleLogout = () => {
    Alert.alert(t("profile.logout"), t("profile.logoutDescription"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("profile.logout"),
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          await dispatch(logoutAsync());
          setLoggingOut(false);
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t("profile.deleteAccount"),
      t("profile.deleteAccountDescription"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("profile.deleteAccount"),
          style: "destructive",
          onPress: async () => {
            setDeletingAccount(true);
            await dispatch(deleteAccountAsync());
            setDeletingAccount(false);
          },
        },
      ],
    );
  };

  return (
    <ScreenWrapper showTopNavBar={false} withTabNavigation={true}>
      <ScrollView className="flex-1 px-5 mt-4">
        <View className="gap-y-3">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-zinc-900 dark:text-white">
              {t("profile.title")}
            </Text>
            <TouchableOpacity
              onPress={handleLogout}
              disabled={loggingOut}
              className="p-2 rounded-full bg-red-50 dark:bg-red-500/10"
              hitSlop={8}
            >
              {loggingOut ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <MaterialIcons name="logout" size={22} color="#ef4444" />
              )}
            </TouchableOpacity>
          </View>
          {user && (
            <View className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 mb-1">
              <View className="flex-row items-center mb-3">
                {user.firstName && (
                  <View className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 items-center justify-center mr-3">
                    <Text className="text-xl font-bold text-orange-500">
                      {(user.firstName?.[0] ?? "").toUpperCase()}
                    </Text>
                  </View>
                )}

                <View className="flex-1">
                  {user.firstName && user.lastName && (
                    <Text className="text-base font-bold text-zinc-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </Text>
                  )}
                  {user.email && (
                    <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </Text>
                  )}
                </View>
              </View>
              <SubscriptionBadge
                tier={subscription?.tier ?? "free"}
                isActive={subscription?.isActive ?? false}
                currentPeriodEnd={subscription?.currentPeriodEnd ?? null}
                t={t}
              />
            </View>
          )}
          {shouldShowPaywallBanners && (
            <TouchableOpacity
              onPress={() => router.push("/screens/paywall" as any)}
              className="flex-row items-center p-4 bg-orange-50 dark:bg-orange-500/10 rounded-2xl border border-orange-100 dark:border-orange-500/20"
            >
              <MaterialIcons name="auto-awesome" size={24} color="#f48c25" />
              <Text className="ml-4 flex-1 font-bold text-[#f48c25]">
                {t("profile.upgradeToPro")}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#f48c25" />
            </TouchableOpacity>
          )}
          <ProfileMenuItem
            isMaterialCommunityIcon={true}
            icon="chef-hat"
            label={t("profile.favorites")}
            onPress={() => router.push("/screens/favorites" as any)}
          />
          {false && (
            <TouchableOpacity
              onPress={() => setThemeModalVisible(true)}
              className="flex-row items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700"
            >
              <MaterialIcons name="palette" size={24} color="#f39849" />
              <Text className="ml-4 flex-1 font-bold text-zinc-700 dark:text-zinc-200">
                {t("profile.appearance")}
              </Text>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400 mr-2 capitalize">
                {currentTheme}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#a1a1aa" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setLanguageModalVisible(true)}
            className="flex-row items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700"
          >
            <MaterialIcons name="language" size={24} color="#f39849" />
            <Text className="ml-4 flex-1 font-bold text-zinc-700 dark:text-zinc-200">
              {t("profile.language")}
            </Text>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400 mr-2 uppercase">
              {currentLanguage}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#a1a1aa" />
          </TouchableOpacity>
          <ProfileMenuItem
            icon="help-outline"
            label={t("profile.help")}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://slaycal.com/contact")
            }
          />
          {__DEV__ && (
            <TouchableOpacity
              onPress={() => router.push("/screens/analytics-dev" as any)}
              className="flex-row items-center p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20"
            >
              <MaterialIcons name="science" size={22} color="#6366f1" />
              <Text className="ml-3 font-bold text-indigo-600 dark:text-indigo-400 flex-1">
                Analytics Dev
              </Text>
              <MaterialIcons name="chevron-right" size={22} color="#6366f1" />
            </TouchableOpacity>
          )}
          <ProfileMenuItem
            icon="delete-forever"
            label={t("profile.deleteAccount")}
            onPress={handleDeleteAccount}
            iconColor="#71717a"
            labelClassName="text-zinc-500 dark:text-zinc-400"
            loading={deletingAccount}
            disabled={deletingAccount}
            showChevron={false}
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
                {t("profile.themeTitle")}
              </Text>
            </View>
            {THEME_OPTIONS.map(({ value, labelKey }) => (
              <TouchableOpacity
                key={value}
                onPress={() => handleSelectTheme(value)}
                className="flex-row items-center justify-between px-4 py-4 border-b border-zinc-100 dark:border-zinc-700 last:border-b-0"
              >
                <Text className="text-base text-zinc-900 dark:text-white">
                  {t(labelKey)}
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
                {t("profile.languageTitle")}
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

const SubscriptionBadge = ({
  tier,
  isActive,
  currentPeriodEnd,
  t,
}: {
  tier: "free" | "pro" | "trial";
  isActive: boolean;
  currentPeriodEnd: string | null;
  t: (key: string, opts?: Record<string, string>) => string;
}) => {
  const isExpired =
    (tier === "pro" || tier === "trial") && !isActive && !!currentPeriodEnd;

  const isActivePro =
    (tier === "pro" || tier === "trial") &&
    isActive &&
    (!currentPeriodEnd || new Date(currentPeriodEnd) > new Date());

  let label: string;
  let bgClass: string;
  let textClass: string;
  let iconColor: string;
  let iconName: "crown" | "star" | "close-circle" | "account";

  if (isActivePro && tier === "pro") {
    label = t("profile.planPro");
    bgClass = "bg-orange-50 dark:bg-orange-500/10";
    textClass = "text-orange-500";
    iconColor = "#f48c25";
    iconName = "crown";
  } else if (isActivePro && tier === "trial") {
    label = t("profile.planTrial");
    bgClass = "bg-blue-50 dark:bg-blue-500/10";
    textClass = "text-blue-500";
    iconColor = "#3b82f6";
    iconName = "star";
  } else if (isExpired) {
    label = t("profile.planExpired");
    bgClass = "bg-red-50 dark:bg-red-500/10";
    textClass = "text-red-500";
    iconColor = "#ef4444";
    iconName = "close-circle";
  } else {
    label = t("profile.planFree");
    bgClass = "bg-zinc-100 dark:bg-zinc-700/40";
    textClass = "text-zinc-500 dark:text-zinc-400";
    iconColor = "#a1a1aa";
    iconName = "account";
  }

  const renewalText =
    isActivePro && currentPeriodEnd
      ? t("profile.renewsOn", {
          date: format(parseISO(currentPeriodEnd), "MMM d, yyyy"),
        })
      : null;

  return (
    <View className="flex-row items-center gap-2 flex-wrap">
      <View className={`flex-row items-center ${bgClass} rounded-xl px-3 py-2`}>
        <MaterialCommunityIcons name={iconName} size={14} color={iconColor} />
        <Text className={`ml-1 text-xs font-semibold ${textClass}`}>
          {label}
        </Text>
      </View>
      {renewalText && (
        <Text className="text-xs text-zinc-400 dark:text-zinc-500">
          {renewalText}
        </Text>
      )}
    </View>
  );
};

const ProfileMenuItem = ({
  icon,
  label,
  onPress,
  isMaterialCommunityIcon = false,
  iconColor = "#f39849",
  labelClassName = "text-zinc-700 dark:text-zinc-200",
  loading = false,
  disabled = false,
  showChevron = true,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  isMaterialCommunityIcon?: boolean;
  iconColor?: string;
  labelClassName?: string;
  loading?: boolean;
  disabled?: boolean;
  showChevron?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || loading}
    className="flex-row items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700"
  >
    {loading ? (
      <ActivityIndicator size="small" color={iconColor} />
    ) : isMaterialCommunityIcon ? (
      <MaterialCommunityIcons name={icon as any} size={24} color={iconColor} />
    ) : (
      <MaterialIcons name={icon as any} size={24} color={iconColor} />
    )}
    <Text className={`ml-4 flex-1 font-bold ${labelClassName}`}>{label}</Text>
    {showChevron && (
      <MaterialIcons name="chevron-right" size={24} color="#a1a1aa" />
    )}
  </TouchableOpacity>
);

export default ProfileScreen;
