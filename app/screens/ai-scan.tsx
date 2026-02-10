import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setImage } from "@/store/slices/recipeSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { ScreenWrapper } from "../../components/ScreenWrapper";

export default function AIScanScreen() {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme];

  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [showPickerMenu, setShowPickerMenu] = useState(false);

  const handlePickImage = async (useCamera: boolean) => {
    if (useCamera) {
      setIsLoadingCamera(true);
    } else {
      setIsLoadingGallery(true);
    }

    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          "İzin Gerekli",
          "Ürünleri taramak için kamera veya galeri izni vermeniz gerekiyor.",
        );
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
            presentationStyle:
              ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
          });

      if (!result.canceled) {
        dispatch(setImage(result.assets[0].uri));
        router.push("/screens/ai-scan-form");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingCamera(false);
      setIsLoadingGallery(false);
      setShowPickerMenu(false);
    }
  };

  return (
    <ScreenWrapper
      showBackButton={false}
      withTabNavigation={false}
      showTopNavBar={false}
    >
      <View className="flex-1">
        {/* Top Section: Recipe Generator */}
        <Pressable
          onPress={() => setShowPickerMenu(true)}
          className="flex-1 overflow-hidden"
        >
          <ImageBackground
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFard3CDoLTNGZdbi8HHMwYQIF7YDrLkaHKkRO8p9JSNVNDDlVlbeoEhgf4ZpqoszOKtcz1y81yjyGY_vwnQiu92KEh6zJb2vjGrFOhCuF7lTSJ7U6pn0l5EhNejyi0iOcs3B4bkjgQdEi70Pr1k9tMO3WxAebum3-HC3Ykm8SYHZeZk-lvacqR8aZt_Eubxptw2ExJ9XApoiwVlMcXbKclSF-sI1zUBNpBn0PKx4XiOrN32z3Q_wFrC1FShDW6d0OEnXQH4vD2eYM",
            }}
            className="flex-1"
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
              className="absolute inset-0"
            />
            <View className="flex-1 justify-center items-center p-8">
              <BlurView
                intensity={colorScheme === "dark" ? 40 : 60}
                tint={colorScheme === "dark" ? "dark" : "light"}
                className="overflow-hidden rounded-3xl border border-white/10 dark:border-white/5 w-full max-w-sm"
              >
                <View className="p-6 items-center">
                  <View
                    className="h-14 w-14 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${themeColors.primary}20` }}
                  >
                    <MaterialIcons
                      name="restaurant-menu"
                      size={32}
                      color={themeColors.primary}
                    />
                  </View>
                  <Text className="text-2xl font-bold mb-2 text-white text-center">
                    Smart Recipe Generator
                  </Text>
                  <Text className="text-zinc-300 mb-6 text-sm font-light text-center">
                    Turn ingredients into meals instantly.
                  </Text>
                  <View
                    style={{ backgroundColor: themeColors.primary }}
                    className="w-full py-3.5 rounded-xl flex-row items-center justify-center gap-2"
                  >
                    <MaterialIcons
                      name="photo-camera"
                      size={20}
                      color="black"
                    />
                    <Text className="text-black font-bold text-base">
                      Scan Ingredients
                    </Text>
                  </View>
                </View>
              </BlurView>
            </View>

            {/* AI Powered Badge */}
            <View className="absolute top-6 left-6">
              <BlurView
                intensity={40}
                tint="dark"
                className="px-3 py-1 rounded-full border border-white/20 overflow-hidden"
              >
                <Text
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: themeColors.primary }}
                >
                  AI Powered
                </Text>
              </BlurView>
            </View>
          </ImageBackground>
        </Pressable>

        {/* Divider Line with Pulse Effect */}
        <View
          style={{ height: 2, backgroundColor: themeColors.background }}
          className="relative items-center justify-center z-10"
        >
          <View
            style={{ backgroundColor: themeColors.primary }}
            className="h-10 w-10 rounded-full items-center justify-center border-4 border-black/20"
          >
            <MaterialIcons name="bolt" size={24} color="black" />
          </View>
          <View
            style={{ backgroundColor: themeColors.primary }}
            className="absolute h-[1px] w-full opacity-30"
          />
        </View>

        {/* Bottom Section: Nutrition Tracker */}
        <Pressable
          onPress={() => router.push("/daily-log")}
          className="flex-1 overflow-hidden"
        >
          <ImageBackground
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIVud_T2fqvtdE1wvDCZ6TFhLa8yNTQ1FRvNo-nXUZ8VfHM0VmfP04pUlaknwKWJPnULAm5rAagw192R4LhW2qn2NdkHgVAKxs-mmDAS0t9SxnAJwOBTQgU0o6NV-fVgjqjg7P3GBKzX3iJcm3b1k8nav-HXApyQ9po1xleJ9q8Z2O6KtAy2ZIIbCFvXark0oN1upV6X-EPPvgER_8bMBKVZijINjl1IVBAnew3khofJkOl-YGsESGWH7WKLBGMED5PWYlyd-EB9FL",
            }}
            className="flex-1"
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.6)"]}
              className="absolute inset-0"
            />
            <View className="flex-1 justify-center items-center p-8">
              <BlurView
                intensity={colorScheme === "dark" ? 40 : 60}
                tint={colorScheme === "dark" ? "dark" : "light"}
                className="overflow-hidden rounded-3xl border border-white/10 dark:border-white/5 w-full max-w-sm"
              >
                <View className="p-6 items-center">
                  <View
                    className="h-14 w-14 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${themeColors.primary}20` }}
                  >
                    <MaterialIcons
                      name="leaderboard"
                      size={32}
                      color={themeColors.primary}
                    />
                  </View>
                  <Text className="text-2xl font-bold mb-2 text-white text-center">
                    Nutrition Tracker
                  </Text>
                  <Text className="text-zinc-300 mb-6 text-sm font-light text-center">
                    Analyze macros & calories in seconds.
                  </Text>
                  <View
                    className="w-full py-3.5 rounded-xl border-2 flex-row items-center justify-center gap-2"
                    style={{ borderColor: themeColors.primary }}
                  >
                    <MaterialIcons
                      name="qr-code-scanner"
                      size={20}
                      color={themeColors.primary}
                    />
                    <Text
                      className="font-bold text-base"
                      style={{ color: themeColors.primary }}
                    >
                      Scan Meal
                    </Text>
                  </View>
                </View>
              </BlurView>
            </View>
          </ImageBackground>
        </Pressable>

        {/* Picker Modal */}
        <Modal
          visible={showPickerMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPickerMenu(false)}
        >
          <Pressable
            className="flex-1 bg-black/60 justify-end"
            onPress={() => setShowPickerMenu(false)}
          >
            <View className="bg-zinc-100 dark:bg-zinc-900 rounded-t-[40px] p-8 pb-12">
              <View className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-8" />
              <Text className="text-zinc-900 dark:text-white text-2xl font-bold mb-6 text-center">
                Select Source
              </Text>
              <View className="flex-row gap-4">
                <Pressable
                  onPress={() => handlePickImage(true)}
                  className="flex-1 bg-white dark:bg-zinc-800 p-6 rounded-3xl items-center border border-zinc-200 dark:border-zinc-700"
                >
                  <MaterialIcons
                    name="photo-camera"
                    size={32}
                    color={themeColors.primary}
                  />
                  <Text className="text-zinc-900 dark:text-white font-bold mt-2">
                    Camera
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handlePickImage(false)}
                  className="flex-1 bg-white dark:bg-zinc-800 p-6 rounded-3xl items-center border border-zinc-200 dark:border-zinc-700"
                >
                  <MaterialIcons
                    name="collections"
                    size={32}
                    color={themeColors.primary}
                  />
                  <Text className="text-zinc-900 dark:text-white font-bold mt-2">
                    Gallery
                  </Text>
                </Pressable>
              </View>
              {(isLoadingCamera || isLoadingGallery) && (
                <View className="absolute inset-0 bg-white/50 dark:bg-black/50 items-center justify-center rounded-t-[40px]">
                  <ActivityIndicator size="large" color={themeColors.primary} />
                </View>
              )}
            </View>
          </Pressable>
        </Modal>
      </View>
    </ScreenWrapper>
  );
}
