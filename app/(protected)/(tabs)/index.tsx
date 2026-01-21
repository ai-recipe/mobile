import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

export default function HomeScreen() {
  const floatAnim = useSharedValue(0);

  React.useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000 }),
        withTiming(0, { duration: 2000 }),
      ),
      -1,
      true,
    );
  }, [floatAnim]);

  const animatedMascotStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatAnim.value },
      { rotate: `${floatAnim.value / 4}deg` },
    ],
  }));

  const remoteImages = {
    profile:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlPbF5SyiqYHOw9MvzpLgA9djeRORumXGM3s8iLmDqz-wHE30_KNgDcUrPOorhKUg7STEUTsPguhPfbbZjSVe6fxpmOkAyaSMR3Mb33R9dqWGdNTxpDPGTCyU7GQnFPlZSvmSgau9WXFV-s50NWRAXJnuJtTsG3171m3emtHZ_7zdvXpalJStTWAM0txF3fgu3iGfsAGgR2_AbpUOZwsB3_QcIE2Z6BSv74lqti22-H7ghzx8N4PZ10ZDzhvPPKwSTpvhMW6tw0e06",
    pasta:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCObA8mlqBV4stqfLnbyTsXs19qURFCTnM79heytpRqNy4R_4Pkgd-wFmCSvvtuYqWWXeNv8AfmEVT1DTTcK9T0egdhAgB4bQSyYf7eeZbmdRn-dwXeCxtpfIkCp7c32vSN_XhlVFwGI01BcRBRyzovvnmkNT8Z6sHA2r41dyD2YYeah8_Nvhpumf7WVtFcWB3EVTdgOIA5qiBLQCwxnDkj_cplLNTVpsGkHhnBM52i45fH30LFW-TZME_9O4MIYiNTRbMdDk8w-XzE",
    salad:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHEy-wv2JhBZO7kV08cNU3gBgsfjv329fG-gx97xJsHvTyXB6RlOu58chEioDeBfg6pqeObUI-Dt21i0oiBGCV2_k8GV76vMPnNcrPNI3hetMIfI9B6ySpwc9C2GCe_qTSwa1slHTFtB3Sw1lCd8PDNfnkCXRFW8yI7PmvzHy-7cUb2J5VuPZCWSu_LCr4ZvG1fVE3jNeVRHkrCekomyNcytgdgbeShThp0IWK1pVhh__1QfCIRj1qHnPjnWgvGa5tYAMbj6xn1LjV",
    salmon:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSwDEx6ubfln7p66waOTbZnmbYXOmtmG9QX4Q81o8INAEcBB3KEus8zO49pYAZ2JozwhAw3WEjehBCr3jhqISiTBh3-vokdIe9ameqGht6ZNJren19amVjIgt9LohWtSRCAH9HJ3rlgcuEJr_c0a7OzLoGs0ET-b5XLDDDBsVklDzFWOt0Vg71uR4pYgwQF37DjuLQzYaHHnEA_JyCjIm6jGVp6iDSvXLElSYtCY70LdY6-ztSky2FfdP5-rReCeZqhYUueL9Y4Sqz",
    yogurt:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkn3A23H_SFLjyIZrj6zmN20H2utEo-DTb6VFbSV3qp2cIzL6nGWi44OoTEzAsSbAQkLc-OEa26_BjFlIcEQD06DdpRzcOWzFKYVgDJln00Zb0ZcTtLYxgCuIvFNnTAcejgrL8q0OcC-XF00wRh5F2y5qvFNC9a3V8nrLfrCo0373zVtUmeZ3gxTdk6FkuhNKvMfE25RqeroC0cbn0DQXGI-DPSiIncQceaOghEAOlpuTUV8aCIomjMqNsw3osj0bIikoschk4MvjVt",
    quinoa:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3OfSYb7-slCezdx-6WDGDbp_pJw6ZLCwatASyV-eP2YyDOEOCJaEe3cDQA1XZyDsJ659UL_JKhpiojiZA2SFSOl5hqOpHgEGyOGzQlHoY1DH4MAe9Nj6pyxRaZagpCBiCObUFOzy8CKYrRi032MZKj75mfFQSRRA-a-h1zXANNS0xbsWlpsnlrkYWZLySTYMLWJFV5BYuPfWq3NrFigY07V6lDawmjh-Rf_B_Ma2ukvZViidtPHNq3hZV7CajCMbUVXKB47RVQbTd",
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 36 }}
        >
          {/* Scan Ingredients Banner */}
          <View className="px-5 pb-2 pt-10">
            <LinearGradient
              colors={["#f39849", "#ffb373", "#e67e22"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 36,
                overflow: "hidden",
              }}
            >
              <View className="p-8  relative overflow-hidden ">
                <View className="absolute -right-16 -top-16 size-48 bg-white/20 rounded-full blur-3xl opacity-50" />
                <View className="absolute -left-10 -bottom-10 size-40 bg-black/5 rounded-full blur-2xl" />

                <View className="relative z-10 items-center">
                  <View className="flex-row items-center self-start px-3 py-1.5 rounded-full bg-white/30 border border-white/40 mb-6 backdrop-blur-md">
                    <MaterialIcons
                      name="auto-awesome"
                      size={14}
                      color="white"
                      className="text-white"
                    />
                    <Text className="text-white text-[10px] font-extrabold ml-1.5 uppercase tracking-widest">
                      YAPAY ZEKA SİHİRİ
                    </Text>
                  </View>
                  <Text className="text-white text-[32px] font-extrabold leading-[1.1] mb-3 text-left w-full">
                    Malzemelerini{"\n"}Tarat
                  </Text>
                  <Text className="text-white/90 text-[15px] font-medium leading-relaxed mb-8 text-left w-full">
                    Buzdolabındaki malzemeleri saniyeler içinde gurme tariflere
                    dönüştüren yapay zeka gücü.
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.95}
                    className="flex-row items-center justify-center gap-3 bg-white w-full h-[60px] rounded-full "
                  >
                    <MaterialIcons
                      name="photo-camera"
                      size={24}
                      color="black"
                    />
                    <Text className="text-black font-extrabold text-[17px]">
                      Taramaya Başla
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Mascot Speech Bubble Section */}
          <View className="px-5 py-4">
            <View className="bg-[#FFF7ED] dark:bg-zinc-800/40 rounded-3xl p-5 border border-orange-100/50 dark:border-zinc-700/30 flex-row items-center gap-4">
              <Animated.View style={animatedMascotStyle} className="relative">
                <View className="size-16 items-center justify-center bg-white rounded-2xl">
                  <MaterialCommunityIcons
                    name="robot"
                    size={42}
                    color="#f39849"
                  />
                  <View className="absolute -top-3 -right-3 rotate-12">
                    <MaterialIcons
                      name="restaurant"
                      size={20}
                      color="#f39849"
                    />
                  </View>
                </View>
              </Animated.View>
              <View className="flex-1">
                <View className="bg-white dark:bg-zinc-700 px-4 py-3 rounded-2xl relative">
                  {/* Speech bubble tail simulation */}
                  <View className="absolute left-[-6px] top-1/2 -translate-y-1/2 size-4 bg-white dark:bg-zinc-700 rotate-45" />
                  <Text className="text-[#5a4a3a] dark:text-zinc-200 text-[14px] font-bold leading-snug">
                    {
                      '"Buzdolabında saklanan bir şaheser mi var? Hadi bulalım!"'
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* How it Works Section */}
          <View className="px-5 pt-8">
            <View className="mb-8 px-1">
              <Text className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-3">
                Nasıl <Text className="text-[#f39849]">Çalışır?</Text>
              </Text>
              <Text className="text-zinc-500 dark:text-zinc-400 text-[16px] leading-relaxed font-medium">
                Yapay zeka ile mutfakta devrim yaratmaya hazır mısınız? Sadece
                birkaç adımda akşam yemeğiniz hazır.
              </Text>
            </View>

            <View className="gap-y-4">
              {/* Step 1 */}
              <View className="bg-white/80 dark:bg-zinc-800/50 p-5 rounded-[28px] flex-row items-center border border-white/20 dark:border-zinc-700/30 ">
                <View className="size-14 bg-orange-100 dark:bg-orange-500/10 rounded-2xl items-center justify-center mr-4">
                  <MaterialIcons
                    name="photo-camera"
                    size={28}
                    color="#f39849"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[2px] mb-1">
                    Adım 1
                  </Text>
                  <Text className="text-zinc-900 dark:text-zinc-100 font-bold text-[17px] leading-tight">
                    Önce ürünlerinizi tarayınız
                  </Text>
                </View>
              </View>

              {/* Step 2 */}
              <View className="bg-white/80 dark:bg-zinc-800/50 p-5 rounded-[28px] flex-row items-center border border-white/20 dark:border-zinc-700/30 ">
                <View className="size-14 bg-orange-100 dark:bg-orange-500/10 rounded-2xl items-center justify-center mr-4">
                  <MaterialIcons name="fact-check" size={28} color="#f39849" />
                </View>
                <View className="flex-1">
                  <Text className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[2px] mb-1">
                    Adım 2
                  </Text>
                  <Text className="text-zinc-900 dark:text-zinc-100 font-bold text-[17px] leading-tight">
                    Ürünleri onaylayın veya ekleyin
                  </Text>
                </View>
              </View>

              {/* Step 3 */}
              <View className="bg-white/80 dark:bg-zinc-800/50 p-5 rounded-[28px] flex-row items-center border border-white/20 dark:border-zinc-700/30 ">
                <View className="size-14 bg-orange-100 dark:bg-orange-500/10 rounded-2xl items-center justify-center mr-4">
                  <MaterialIcons name="timer" size={28} color="#f39849" />
                </View>
                <View className="flex-1">
                  <Text className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[2px] mb-1">
                    Adım 3
                  </Text>
                  <Text className="text-zinc-900 dark:text-zinc-100 font-bold text-[17px] leading-tight">
                    Ne kadar süreniz var?
                  </Text>
                </View>
              </View>

              {/* Step 4 */}
              <View className="bg-white/80 dark:bg-zinc-800/50 p-5 rounded-[28px] flex-row items-center border border-white/20 dark:border-zinc-700/30 ">
                <View className="size-14 bg-orange-100 dark:bg-orange-500/10 rounded-2xl items-center justify-center mr-4">
                  <MaterialIcons
                    name="manage-accounts"
                    size={28}
                    color="#f39849"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[2px] mb-1">
                    Adım 4
                  </Text>
                  <Text className="text-zinc-900 dark:text-zinc-100 font-bold text-[17px] leading-tight">
                    Diyet tercihlerinizi belirleyin
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              className="mt-10 bg-[#f39849] w-full h-[64px] rounded-2xl items-center justify-center flex-row shadow-lg shadow-orange-500/30"
            >
              <Text className="text-white font-extrabold text-[18px] mr-2">
                Hadi Başlayalım
              </Text>
              <MaterialIcons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
