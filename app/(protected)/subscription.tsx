import { ScreenWrapper } from "@/components/ScreenWrapper";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SubscriptionScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper
      showBackButton
      title="Pro'ya Yükselt"
      withTabNavigation={false}
      showTopNavBar={false}
    >
      <ScrollView
        className="flex-1 bg-zinc-50 dark:bg-zinc-950"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HeaderImage / Hero */}
        <View className="px-4 py-4">
          <LinearGradient
            colors={["#f48c25", "#ffc085"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full rounded-[32px] min-h-[220px] items-center justify-center overflow-hidden"
          >
            <View className="items-center">
              <MaterialIcons name="rocket-launch" size={64} color="white" />
              <View className="mt-3 bg-white/20 px-3 py-1 rounded-full border border-white/30">
                <Text className="text-white text-xs font-black uppercase tracking-widest">
                  PREMIUM ERİŞİM
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* HeadlineText */}
        <View className="items-center px-6 py-4">
          <Text className="text-zinc-900 dark:text-white text-[32px] font-black text-center leading-tight">
            Neden Pro?
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-400 text-center mt-2 text-base font-medium">
            Gelişmiş özellikler ve daha yüksek limitlerle mutfaktaki
            verimliliğinizi artırın.
          </Text>
        </View>

        {/* Stats Section */}
        <View className="flex-row gap-4 px-4 py-4">
          <View className="flex-1 bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <Text className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">
              ÜCRETSİZ
            </Text>
            <Text className="text-zinc-900 dark:text-white text-2xl font-black mb-2">
              1 Kredi
            </Text>
            <View className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <View className="bg-zinc-900 dark:bg-white h-full w-1/3" />
            </View>
          </View>

          <View className="flex-1 bg-orange-50 dark:bg-orange-500/5 p-5 rounded-3xl border-2 border-[#f48c25] relative overflow-hidden shadow-orange-500/10 shadow-lg">
            <View className="absolute top-0 right-0 bg-[#f48c25] px-2 py-0.5 rounded-bl-lg">
              <Text className="text-white text-[9px] font-black uppercase">
                EN POPÜLER
              </Text>
            </View>
            <Text className="text-[#f48c25] text-[10px] font-black uppercase tracking-widest mb-1">
              PRO PLAN
            </Text>
            <View className="flex-row items-baseline gap-1 mb-2">
              <Text className="text-zinc-900 dark:text-white text-2xl font-black">
                3 Kredi
              </Text>
              <Text className="text-green-500 text-sm font-bold">+200%</Text>
            </View>
            <View className="h-2 w-full bg-orange-200 dark:bg-orange-950 rounded-full overflow-hidden">
              <View className="bg-[#f48c25] h-full w-full" />
            </View>
          </View>
        </View>

        {/* SectionHeader */}
        <View className="px-5 pt-6 pb-2">
          <Text className="text-zinc-900 dark:text-white text-xl font-black">
            Özellik Karşılaştırması
          </Text>
        </View>

        {/* Comparison List */}
        <View className="px-4 gap-3 mb-24">
          <FeatureRow
            icon="speed"
            iconColor="#f48c25"
            title="İşlem Hızı"
            subtitle="Öncelikli kuyruk erişimi"
            proLabel="Anında"
            freeLabel="Standart"
          />
          <FeatureRow
            icon="cloud-upload"
            iconColor="#3b82f6"
            title="Bulut Depolama"
            subtitle="Güvenli uzaktan yedekleme"
            proLabel="Sınırsız"
            freeLabel="100MB"
          />
          <FeatureRow
            icon="verified-user"
            iconColor="#a855f7"
            title="Gelişmiş Araçlar"
            subtitle="AI analitiği ve raporlar"
            isProOnly
          />
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 shadow-2xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            Aylık Ödeme
          </Text>
          <View className="items-end">
            <View className="flex flex-row items-center gap-2">
              <Text className="text-2xl font-black text-zinc-900 dark:text-white flex gap-2">
                300 TL
              </Text>
              <Text className="text-sm font-normal text-zinc-500">/ay</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          className="w-full bg-[#f48c25] h-16 rounded-full flex-row items-center justify-center gap-2 shadow-lg shadow-orange-500/40"
        >
          <Text className="text-white text-lg font-black">Şimdi Abone Ol</Text>
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-[10px] text-zinc-400 text-center mt-3 px-6 leading-tight">
          İstediğiniz zaman iptal edin. Abone olarak Hizmet Şartlarımızı ve
          Gizlilik Politikamızı kabul etmiş olursunuz.
        </Text>
      </View>
    </ScreenWrapper>
  );
}

function FeatureRow({
  icon,
  iconColor,
  title,
  subtitle,
  proLabel,
  freeLabel,
  isProOnly = false,
}: {
  icon: any;
  iconColor: string;
  title: string;
  subtitle: string;
  proLabel?: string;
  freeLabel?: string;
  isProOnly?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between p-4 rounded-[24px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <View className="flex-row items-center gap-4 flex-1">
        <View
          style={{ backgroundColor: `${iconColor}20` }}
          className="size-12 rounded-2xl items-center justify-center"
        >
          <MaterialIcons name={icon} size={24} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="text-zinc-900 dark:text-white font-bold text-sm">
            {title}
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-400 text-xs">
            {subtitle}
          </Text>
        </View>
      </View>
      {isProOnly ? (
        <MaterialCommunityIcons name="check-circle" size={24} color="#10b981" />
      ) : (
        <View className="items-end">
          <Text className="text-xs font-black text-[#f48c25]">{proLabel}</Text>
          <Text className="text-[10px] text-zinc-400 line-through">
            {freeLabel}
          </Text>
        </View>
      )}
    </View>
  );
}
