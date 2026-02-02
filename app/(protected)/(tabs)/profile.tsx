import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAppDispatch } from "@/store/hooks";
import { logoutAsync } from "@/store/slices/authSlice";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Evet, Çıkış Yap",
          onPress: () => dispatch(logoutAsync()),
          style: "destructive",
        },
      ],
    );
  };

  return (
    <ScreenWrapper>
      <ScrollView className="flex-1 bg-white dark:bg-zinc-900 px-5">
        {/* Header */}
        <View className="items-center mt-8 mb-8">
          <View className="relative">
            <Image
              source={{
                uri: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
              }}
              className="size-24 rounded-full border-4 border-orange-100"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-[#f39849] p-2 rounded-full border-4 border-white">
              <MaterialIcons name="edit" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-4">
            Şahin Kundakcı
          </Text>
          <Text className="text-zinc-500 font-medium">Gurme Şef</Text>
        </View>

        {/* Menu Options */}
        <View className="gap-y-3">
          <ProfileMenuItem icon="notifications-none" label="Bildirimler" />
          <ProfileMenuItem icon="palette" label="Görünüm (Koyu Tema)" />
          <ProfileMenuItem icon="help-outline" label="Yardım ve Destek" />
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center p-4 bg-red-50 rounded-2xl mt-4"
          >
            <MaterialIcons name="logout" size={24} color="#ef4444" />
            <Text className="ml-4 flex-1 font-bold text-red-500">
              Çıkış Yap
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const ProfileMenuItem = ({ icon, label }: { icon: any; label: string }) => (
  <TouchableOpacity className="flex-row items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
    <MaterialIcons name={icon} size={24} color="#f39849" />
    <Text className="ml-4 flex-1 font-bold text-zinc-700 dark:text-zinc-200">
      {label}
    </Text>
    <MaterialIcons name="chevron-right" size={24} color="#a1a1aa" />
  </TouchableOpacity>
);

export default ProfileScreen;
