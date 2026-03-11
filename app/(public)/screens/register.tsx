import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerWithEmailAsync } from "@/store/slices/authSlice";
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
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as yup from "yup";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isRegisterLoading, error: authError } = useAppSelector(
    (state) => state.auth
  );

  const registerSchema = useMemo(
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
        confirmPassword: yup
          .string()
          .required(t("auth.confirmPasswordRequired"))
          .oneOf([yup.ref("password")], t("auth.passwordsMustMatch")),
      }),
    [t]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const resultAction = await dispatch(registerWithEmailAsync(data));
      if (registerWithEmailAsync.fulfilled.match(resultAction)) {
        router.replace("/(protected)/(tabs)");
      } else {
        const message = resultAction.payload as string;
        Alert.alert(t("auth.error"), message || t("auth.registerFailed"));
      }
    } catch (err) {
      Alert.alert(t("auth.error"), t("auth.somethingWentWrong"));
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
                <View className="size-32 bg-white dark:bg-zinc-800 rounded-[40px] items-center justify-center shadow-2xl shadow-orange-500/30 rotate-3">
                  <MaterialCommunityIcons
                    name="chef-hat"
                    size={64}
                    color="#f39849"
                  />
                </View>
              </View>

              {/* Welcome Text */}
              <View className="px-10">
                <Text className="text-3xl font-black text-center text-zinc-900 dark:text-white leading-tight mb-2">
                  {t("auth.signUp")} <Text className="text-[#f39849]">{t("auth.createAccount")}</Text>
                </Text>
                <Text className="text-zinc-500 dark:text-zinc-400 text-center text-sm font-medium leading-relaxed">
                  {t("auth.heroSubtitle")}
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
              <View className="mb-4">
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

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={t("auth.confirmPasswordPlaceholder")}
                      placeholderTextColor="#9ca3af"
                      secureTextEntry
                      className={`w-full h-14 bg-white dark:bg-zinc-800 rounded-full px-5 text-zinc-900 dark:text-white text-base border-2 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <Text className="text-red-500 text-sm mt-1.5 ml-2">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                activeOpacity={0.8}
                disabled={isRegisterLoading}
                className={`w-full h-14 bg-[#f39849] rounded-full flex-row items-center justify-center mb-4 shadow-lg shadow-orange-500/30 ${
                  isRegisterLoading ? "opacity-70" : ""
                }`}
              >
                {isRegisterLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-[17px]">
                    {t("auth.signUp")}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Login link */}
              <View className="flex-row justify-center items-center gap-1">
                <Text className="text-zinc-600 dark:text-zinc-400 text-sm">
                  {t("auth.alreadyHaveAccount")}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(public)/screens/login")}
                >
                  <Text className="text-[#f39849] font-bold text-sm">
                    {t("auth.signIn")}
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
