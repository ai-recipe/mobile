import { AnimatedCircleProgress } from "@/components/AnimatedCircleProgress";
import { MaterialIcons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface WaterActivityTabProps {
  waterLoading: boolean;
  waterEntries: any[];
  waterProgress: number;
  waterIntake: number;
  waterGoal: number;
  waterAdding: boolean;
  themeColors: any;
  onAddWater: (amountMl: number) => void;
  onDeleteWater: (id: string) => void;
}

export const WaterActivityTab: React.FC<WaterActivityTabProps> = ({
  waterLoading,
  waterEntries,
  waterProgress,
  waterIntake,
  waterGoal,
  waterAdding,
  themeColors,
  onAddWater,
  onDeleteWater,
}) => {
  const { t } = useTranslation();
  return (
    <View className="pb-10">
      {waterLoading && !waterEntries.length ? (
        <ActivityIndicator size="large" color="#3b82f6" className="my-10" />
      ) : (
        <>
          <View className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 mb-6 items-center">
            <View className="relative w-48 h-48 items-center justify-center mb-6">
              <AnimatedCircleProgress
                progress={waterProgress}
                trackColor="#f1f5f9"
                progressColor="#3b82f6"
                exceedColor={themeColors.error}
                size={192}
                radius={88}
                strokeWidth={12}
              />

              <View className="absolute inset-0 items-center justify-center">
                <MaterialIcons name="opacity" size={48} color="#3b82f6" />
                <Text className="text-3xl font-black text-zinc-900 dark:text-white mt-1">
                  {waterIntake}
                </Text>
                <Text className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                  / {waterGoal} ml
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-full mb-8">
              <Text className="text-xs font-bold text-blue-500">
                {Math.round(waterProgress)}% {t("water.dailyGoalReached")}
              </Text>
            </View>

            <View className="flex-row gap-4 w-full ">
              <Pressable
                onPress={() => onAddWater(250)}
                disabled={waterAdding}
                style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                className="flex-1 bg-blue-500 py-4 rounded-2xl items-center shadow-lg shadow-blue-500/30 relative"
              >
                {waterAdding ? (
                  <View className="absolute left-1/2 top-1/2 -translate-x-1/2 ">
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                ) : null}

                <Text className="text-white font-bold text-base">+250ml</Text>
                <Text className="text-white/70 text-[10px] uppercase font-bold tracking-tighter mt-0.5">
                  {t("water.oneGlass")}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onAddWater(500)}
                disabled={waterAdding}
                style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 py-4 rounded-2xl items-center relative"
              >
                {waterAdding ? (
                  <View className="absolute left-1/2 top-1/2 -translate-x-1/2 ">
                    <ActivityIndicator size="small" color="#zinc-900" />
                  </View>
                ) : null}
                <Text className="text-zinc-900 dark:text-white font-bold text-base">
                  +500ml
                </Text>
                <Text className="text-zinc-400 text-[10px] uppercase font-bold tracking-tighter mt-0.5">
                  {t("water.bottle")}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Water entries list (like meal activity) */}
          {waterEntries.length > 0 ? (
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4 px-2">
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 rounded-lg items-center justify-center bg-blue-500/20">
                    <MaterialIcons name="opacity" size={18} color="#3b82f6" />
                  </View>
                  <Text className="text-base font-bold text-zinc-900 dark:text-white">
                    {t("water.waterLog")}
                  </Text>
                </View>
                <Text className="text-sm font-bold text-[#3b82f6]">
                  {waterEntries.reduce((sum, e) => sum + e.amountMl, 0)} ml
                </Text>
              </View>
              <View className="gap-3">
                {[...waterEntries]
                  .sort(
                    (a, b) =>
                      new Date(b.loggedAt).getTime() -
                      new Date(a.loggedAt).getTime(),
                  )
                  .map((entry) => (
                    <View
                      key={entry.id}
                      className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex-row items-center justify-between"
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="flex-col">
                          <Text className="text-zinc-900 dark:text-white font-bold">
                            {entry.amountMl} ml
                          </Text>
                          <Text className="text-zinc-500 text-xs mt-0.5">
                            {format(parseISO(entry.loggedAt), "HH:mm")}
                          </Text>
                        </View>
                      </View>
                      <Pressable
                        onPress={() => onDeleteWater(entry.id)}
                        className="p-1.5 rounded-full active:bg-zinc-100 dark:active:bg-zinc-800"
                      >
                        <MaterialIcons
                          name="delete-outline"
                          size={18}
                          color="#ef4444"
                        />
                      </Pressable>
                    </View>
                  ))}
              </View>
            </View>
          ) : (
            <View className="flex-col items-center justify-center py-8 gap-2 mb-6">
              <Text className="text-zinc-500 dark:text-zinc-400 text-sm text-center">
                {t("water.noWaterLogged")}
              </Text>
              <Text className="text-3xl">💧</Text>
            </View>
          )}

          {/* Tips Section for Water */}
          <View className="bg-blue-50 dark:bg-blue-500/5 p-6 rounded-3xl border border-blue-100 dark:border-blue-500/10 flex-row gap-4">
            <View className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl items-center justify-center">
              <MaterialIcons
                name="lightbulb-outline"
                size={24}
                color="#3b82f6"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                {t("water.stayHydrated")}
              </Text>
              <Text className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t("water.hydrationTip")}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};
