import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const CreditCard = () => {
  const router = useRouter();
  const [credit, setCredit] = React.useState(1);
  const maxCredit = 50;
  return (
    <View className="px-5 pt-4">
      <View className="bg-white dark:bg-zinc-800 p-5 rounded-3xl border border-slate-100 dark:border-zinc-700 ">
        <View className="flex-row justify-between items-end mb-4">
          <View>
            <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Kalan Limit
            </Text>
            <View className="flex-row items-baseline">
              <Text className="text-2xl font-black text-slate-900 dark:text-white">
                {credit}
              </Text>
              <Text className="text-slate-400 dark:text-zinc-500 font-bold text-sm ml-1">
                / {maxCredit} Kredi
              </Text>
            </View>
          </View>
          <View className="flex-row items-center bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-100 dark:border-orange-500/20">
            <MaterialIcons name="bolt" size={14} color="#f39849" />
          </View>
        </View>

        {/* Progress Bar */}
        <View className="w-full h-2.5 bg-slate-100 dark:bg-zinc-700/50 rounded-full overflow-hidden mb-6">
          <View
            className="h-full bg-primary rounded-full"
            style={{ width: `${(credit / maxCredit) * 100}%` }}
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.push("/(protected)/top-up")}
            activeOpacity={0.9}
            className="flex-1 flex-row items-center justify-center gap-2 bg-primary py-3.5 rounded-2xl "
          >
            <MaterialIcons name="add-circle" size={18} color="white" />
            <Text className="text-white font-black text-sm">Kredi Yükle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-1 flex-row items-center justify-center gap-2 bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 py-3.5 rounded-2xl "
          >
            <MaterialIcons name="stars" size={18} color="#f39849" />
            <Text className="text-slate-700 dark:text-slate-200 font-bold text-sm">
              Kredi Kazan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
