import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginWithEmailAsync,
  loginWithGoogleAsync,
  loginWithAppleAsync,
} from "@/store/slices/authSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as yup from "yup";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isLoginLoading, isGoogleLoading, isAppleLoading } = useAppSelector(
    (state) => state.auth,
  );

  const loginSchema = useMemo(
    () =>
      yup.object({
        email: yup
          .string()
          .required(t("auth.emailRequired"))
          .email(t("auth.validEmail")),
        password: yup
          .string()
          .required(t("auth.passwordRequired"))
          .min(6, t("auth.passwordMinLength")),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const resultAction = await dispatch(loginWithEmailAsync(data));
      if (loginWithEmailAsync.fulfilled.match(resultAction)) {
        router.replace("/(protected)/(tabs)");
      } else {
        const message = resultAction.payload as string;
        Alert.alert(t("auth.error"), message || t("auth.loginFailed"));
      }
    } catch (err) {
      Alert.alert(t("auth.error"), t("auth.somethingWentWrong"));
    }
  };

  const handleGoogleLogin = async () => {
    const resultAction = await dispatch(loginWithGoogleAsync());
    if (loginWithGoogleAsync.fulfilled.match(resultAction)) {
      router.replace("/(protected)/(tabs)");
    } else {
      const message = resultAction.payload as string;
      if (message !== "cancelled") {
        Alert.alert(t("auth.error"), message || t("auth.googleLoginFailed"));
      }
    }
  };

  const handleAppleLogin = async () => {
    const resultAction = await dispatch(loginWithAppleAsync());
    if (loginWithAppleAsync.fulfilled.match(resultAction)) {
      router.replace("/(protected)/(tabs)");
    } else {
      const message = resultAction.payload as string;
      if (message !== "cancelled") {
        Alert.alert(t("auth.error"), message || t("auth.appleLoginFailed"));
      }
    }
  };

  return (
    <ScreenWrapper withTabNavigation={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 min-h-[500px] justify-center py-4">
            {/* Top Visual Section - compact */}
            <Animated.View
              entering={FadeInUp.duration(1000).springify()}
              className="items-center justify-center relative py-4"
            >
              {/* Background Decorative Blobs */}
              <View className="absolute top-10 left-[-50] size-64 bg-orange-400/20 rounded-full blur-3xl" />
              <View className="absolute bottom-10 right-[-50] size-64 bg-blue-400/10 rounded-full blur-3xl" />

              {/* Main Illustration */}
              <View className="items-center justify-center mb-4">
                <View className="size-32 bg-white dark:bg-zinc-800 rounded-[40px] items-center justify-center shadow-2xl shadow-orange-500/30">
                  <Image
                    source={require("@/assets/images/logo.png")}
                    className="w-24 h-24"
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Welcome Text */}
              <View className="px-10">
                <Text className="text-3xl font-black text-center text-zinc-900 dark:text-white leading-tight mb-2">
                  {t("auth.signInHeroTitle1")}{" "}
                  <Text className="text-[#f39849]">
                    {t("auth.signInHeroTitle2")}
                  </Text>{" "}
                  {t("auth.signInHeroTitle3")}
                </Text>
                <Text className="text-zinc-500 dark:text-zinc-400 text-center text-sm font-medium leading-relaxed">
                  {t("auth.loginHeroSubtitle")}
                </Text>
              </View>
            </Animated.View>

            {/* Form Section - centered */}
            <Animated.View
              entering={FadeInDown.duration(1000).delay(200).springify()}
              className="w-full px-6 pb-12 pt-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-t-[40px] border-t border-white/20 dark:border-zinc-700/50"
            >
              {/* Email Input */}
              <View className="mb-4">
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={t("auth.emailPlaceholder")}
                      placeholderTextColor="#9ca3af"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      className={`w-full h-14 bg-white dark:bg-zinc-800 rounded-full px-5 text-zinc-900 dark:text-white text-base border-2 ${
                        errors.email
                          ? "border-red-500"
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                    />
                  )}
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1.5 ml-2">
                    {errors.email.message}
                  </Text>
                )}
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={t("auth.passwordPlaceholder")}
                      placeholderTextColor="#9ca3af"
                      secureTextEntry
                      className={`w-full h-14 bg-white dark:bg-zinc-800 rounded-full px-5 text-zinc-900 dark:text-white text-base border-2 ${
                        errors.password
                          ? "border-red-500"
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                    />
                  )}
                />
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1.5 ml-2">
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                activeOpacity={0.8}
                disabled={isLoginLoading}
                className={`w-full h-14 bg-[#f39849] rounded-full flex-row items-center justify-center mb-4 shadow-lg shadow-orange-500/30 ${
                  isLoginLoading ? "opacity-70" : ""
                }`}
              >
                {isLoginLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-[17px]">
                    {t("auth.signIn")}
                  </Text>
                )}
              </TouchableOpacity>

              {/* OR Divider */}
              <View className="flex-row items-center my-5">
                <View className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
                <Text className="text-zinc-400 dark:text-zinc-500 text-sm font-medium mx-4 uppercase">
                  {t("auth.or")}
                </Text>
                <View className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
              </View>

              {/* Google Button */}
              <TouchableOpacity
                onPress={handleGoogleLogin}
                activeOpacity={0.8}
                disabled={isGoogleLoading}
                className={`w-full h-14 rounded-full flex-row items-center justify-center mb-3 border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 ${
                  isGoogleLoading ? "opacity-70" : ""
                }`}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator color="#f39849" />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="google"
                      size={20}
                      color="#DB4437"
                    />
                    <Text className="text-zinc-900 dark:text-white font-bold text-[15px] ml-2">
                      {t("auth.continueWithGoogle")}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Apple Button (iOS only) */}
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  onPress={handleAppleLogin}
                  activeOpacity={0.8}
                  disabled={isAppleLoading}
                  className={`w-full h-14 rounded-full flex-row items-center justify-center mb-4 bg-zinc-900 dark:bg-white ${
                    isAppleLoading ? "opacity-70" : ""
                  }`}
                >
                  {isAppleLoading ? (
                    <ActivityIndicator
                      color={Platform.OS === "ios" ? "white" : "#000"}
                    />
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="apple"
                        size={22}
                        color={Platform.OS === "ios" ? "#fff" : "#000"}
                      />
                      <Text className="text-white dark:text-zinc-900 font-bold text-[15px] ml-2">
                        {t("auth.continueWithApple")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              {/* Sign up link */}
              <View className="flex-row justify-center items-center gap-1">
                <Text className="text-zinc-600 dark:text-zinc-400 text-sm">
                  {t("auth.noAccount")}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(public)/screens/register")}
                >
                  <Text className="text-[#f39849] font-bold text-sm">
                    {t("auth.signUp")}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
