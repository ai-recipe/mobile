import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setImage } from "@/store/slices/recipeSlice";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { ScreenWrapper } from "../../components/ScreenWrapper";

export default function AIScanScreen() {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme].background;

  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
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
            // Use fullScreen to avoid PHPicker/PageSheet issues on iOS
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
      if (useCamera) {
        setIsLoadingCamera(false);
      } else {
        setIsLoadingGallery(false);
      }
    }
  };

  return (
    <ScreenWrapper
      showBackButton
      withTabNavigation={false}
      showTopNavBar={false}
    >
      <ScrollView
        className="flex-1 px-5"
        style={{ backgroundColor }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="pt-8 pb-6">
          <Text className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            Ürünleri <Text className="text-[#f39849]">Tara</Text>
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-400 text-base mt-2">
            AI mutfak şefiniz malzemeleri tanımak için hazır.
          </Text>
        </View>

        {/* Action Options */}
        <View className="flex-row gap-4 mb-10">
          {/* Take Photo */}
          <TouchableOpacity
            onPress={() => handlePickImage(true)}
            activeOpacity={0.9}
            className="flex-1 bg-zinc-900 dark:bg-orange-500 h-48 rounded-[32px] items-center justify-center"
          >
            <View className="size-16 bg-white/10 rounded-full items-center justify-center mb-3">
              {isLoadingCamera ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <MaterialIcons name="photo-camera" size={32} color="white" />
              )}
            </View>
            <Text className="text-white font-bold text-lg">Fotoğraf Çek</Text>
          </TouchableOpacity>

          {/* Gallery */}
          <TouchableOpacity
            onPress={() => handlePickImage(false)}
            activeOpacity={0.9}
            className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-48 rounded-[32px] items-center justify-center"
          >
            <View className="size-16 bg-orange-100 dark:bg-zinc-700 rounded-full items-center justify-center mb-3">
              {isLoadingGallery ? (
                <ActivityIndicator size="large" color="#f39849" />
              ) : (
                <MaterialIcons name="collections" size={32} color="#f39849" />
              )}
            </View>
            <Text className="text-zinc-900 dark:text-white font-bold text-lg">
              Galeriden Seç
            </Text>
          </TouchableOpacity>
        </View>

        {/* Guidelines Section */}
        <View className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-700">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={20}
              color="#f39849"
            />
            <Text className="text-zinc-900 dark:text-white font-extrabold text-lg">
              En İyi Sonuç İçin İpuçları
            </Text>
          </View>

          <View className="gap-y-6">
            <GuidelineItem
              icon="wb-sunny"
              title="İyi Aydınlatma"
              desc="Malzemelerin net görünmesi için aydınlık bir ortam tercih edin."
            />
            <GuidelineItem
              icon="center-focus-weak"
              title="Net Odaklama"
              desc="Kamerayı titretmemeye çalışın ve ürünlere odaklanın."
            />
            <GuidelineItem
              icon="layers"
              title="Üst Üste Koymayın"
              desc="Malzemelerin birbirini kapatmadığından emin olun."
            />
            <GuidelineItem
              icon="Checklist"
              title="Etiketleri Okutun"
              desc="Mümkünse ürün paketlerinin üzerindeki isimleri gösterin."
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

// Sub-component for clean organization
function GuidelineItem({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <View className="flex-row items-start gap-4">
      <View className="mt-1">
        <MaterialIcons name={icon} size={22} color="#f39849" />
      </View>
      <View className="flex-1">
        <Text className="text-zinc-900 dark:text-zinc-100 font-bold text-[15px] mb-1">
          {title}
        </Text>
        <Text className="text-zinc-500 dark:text-zinc-400 text-[13px] leading-5">
          {desc}
        </Text>
      </View>
    </View>
  );
}
