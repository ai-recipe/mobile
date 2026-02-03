import { ScreenWrapper } from "@/components/ScreenWrapper";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const PACKAGES = [
  { id: "1", credits: 10, price: "$9.99", icon: "payments" },
  { id: "2", credits: 50, price: "$39.99", icon: "savings" },
  { id: "3", credits: 100, price: "$69.99", icon: "diamond", bestValue: true },
  { id: "4", credits: 250, price: "$149.99", icon: "rocket-launch" },
  { id: "5", credits: 500, price: "$249.99", icon: "crown" },
];

export default function TopUpScreen() {
  const [selectedId, setSelectedId] = React.useState("3");

  return (
    <ScreenWrapper
      withTabNavigation={false}
      showBackButton={true}
      title="Top-up Credits"
    >
      <ScrollView
        className="flex-1 bg-[#f8f7f5] dark:bg-[#221910]"
        showsVerticalScrollIndicator={false}
      >
        {/* Account Overview Card */}
        <View className="p-4">
          <View className="flex-row items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-[#2d2218] p-5 border border-[#e6e0db] dark:border-[#3d3126]">
            <View className="flex-[2] justify-center">
              <Text className="text-[#8a7560] dark:text-[#b0a090] text-sm font-medium mb-1">
                Account Overview
              </Text>
              <Text className="text-[#181411] dark:text-white text-3xl font-black mb-1">
                125
              </Text>
              <Text className="text-[#8a7560] dark:text-[#b0a090] text-sm font-normal">
                Current Balance (Credits)
              </Text>
            </View>
            <View className="w-24 bg-[#f48c25]/10 rounded-xl items-center justify-center aspect-square">
              <MaterialCommunityIcons
                name="molecule"
                size={40}
                color="#f48c25"
              />
            </View>
          </View>
        </View>

        <Text className="text-[#181411] dark:text-white text-lg font-black px-4 pt-4 mb-2">
          Select a Package
        </Text>

        <View className="flex-row flex-wrap p-4 gap-3">
          {PACKAGES.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              onPress={() => setSelectedId(pkg.id)}
              activeOpacity={0.8}
              className={`bg-white dark:bg-[#2d2218] border-2 flex flex-col gap-3 rounded-xl p-4 ${
                selectedId === pkg.id
                  ? "border-[#f48c25]"
                  : "border-transparent"
              } ${pkg.bestValue ? "w-full" : "w-[47%]"}`}
            >
              {pkg.bestValue && (
                <View className="absolute top-0 right-0 bg-[#f48c25] px-3 py-1 rounded-bl-lg">
                  <Text className="text-white text-[10px] font-black uppercase">
                    BEST VALUE
                  </Text>
                </View>
              )}

              <View
                className={`${pkg.bestValue ? "flex-row items-center gap-4" : ""}`}
              >
                <View
                  className={`${
                    selectedId === pkg.id ? "bg-[#f48c25]" : "bg-[#f48c25]/10"
                  } size-10 rounded-xl items-center justify-center`}
                >
                  <MaterialIcons
                    name={pkg.icon as any}
                    size={24}
                    color={selectedId === pkg.id ? "white" : "#f48c25"}
                  />
                </View>
                <View className="mt-2">
                  <Text
                    className={`text-[#181411] dark:text-white ${
                      pkg.bestValue ? "text-xl" : "text-lg"
                    } font-black`}
                  >
                    {pkg.credits} Credits
                  </Text>
                  <Text className="text-[#f48c25] text-base font-black mt-1">
                    {pkg.price}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="p-4 pb-12 space-y-4">
          <Text className="text-center text-[#8a7560] dark:text-[#b0a090] text-[10px] px-6 mb-6">
            Credits are non-refundable and will be added to your account
            instantly after successful payment.
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            className="w-full bg-[#f48c25] py-5 rounded-full items-center justify-center flex-row gap-2"
          >
            <Text className="text-white font-black text-lg">Buy Now</Text>
            <MaterialIcons
              name="shopping-cart-checkout"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
