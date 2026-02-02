import { MaterialCommunityIcons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as yup from "yup";
import { ScreenWrapper } from "../../../components/ScreenWrapper";

const loginSchema = yup.object({
  email: yup
    .string()
    .required("E-posta alanı zorunludur")
    .email("Geçerli bir e-posta adresi girin"),
  password: yup
    .string()
    .required("Şifre alanı zorunludur")
    .min(6, "Şifre en az 6 karakter olmalıdır"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    // TODO: Implement email/password login
    router.replace("/(protected)/(tabs)");
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
                <View className="absolute -bottom-4 -right-4 bg-zinc-900 dark:bg-white p-3 rounded-2xl rotate-[-6deg] shadow-lg">
                  <MaterialCommunityIcons
                    name="auto-awesome"
                    size={24}
                    color={"#f39849"}
                  />
                </View>
              </View>

              {/* Welcome Text */}
              <View className="px-10">
                <Text className="text-3xl font-black text-center text-zinc-900 dark:text-white leading-tight mb-2">
                  Mutfakta <Text className="text-[#f39849]">Sihir</Text> Yaratın
                </Text>
                <Text className="text-zinc-500 dark:text-zinc-400 text-center text-sm font-medium leading-relaxed">
                  Yapay zeka şefiniz ile buzdolabındaki malzemeleri gurme
                  tariflere dönüştürün.
                </Text>
              </View>
            </Animated.View>

            {/* Form Section - centered */}
            <Animated.View
              entering={FadeInDown.duration(1000).delay(200).springify()}
              className="w-full px-6 pb-12 pt-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-t-[40px] border-t border-white/20"
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
                      placeholder="E-posta"
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
                      placeholder="Şifre"
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
                className="w-full h-14 bg-[#f39849] rounded-full flex-row items-center justify-center mb-4 shadow-lg shadow-orange-500/30"
              >
                <Text className="text-white font-bold text-[17px]">
                  Giriş Yap
                </Text>
              </TouchableOpacity>

              {/* Sign up link */}
              <View className="flex-row justify-center items-center gap-1">
                <Text className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Hesabınız yok mu?
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(public)/screens/register")}
                >
                  <Text className="text-[#f39849] font-bold text-sm">
                    Kayıt Ol
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
