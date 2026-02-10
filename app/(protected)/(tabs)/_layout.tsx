import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BlurView } from "expo-blur";
import { CopilotStep, walkthroughable } from "react-native-copilot";

const CopilotView = walkthroughable(View);

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";

  const tabBarContainerStyle = [
    styles.tabBarContainer,
    {
      backgroundColor: theme.card,
      borderTopColor: theme.border,
      shadowColor: isDark ? "#000" : "#000",
    },
  ];
  const homeIndicatorStyle = [
    styles.homeIndicator,
    { backgroundColor: theme.border },
  ];
  const scanButtonTouchableStyle = [
    styles.scanButtonTouchable,
    { backgroundColor: theme.card, shadowColor: theme.tint },
  ];
  const scanButtonGradientStyle = [
    styles.scanButtonGradient,
    { borderColor: theme.card },
  ];

  return (
    <View style={tabBarContainerStyle}>
      <BlurView
        intensity={80}
        tint={isDark ? "dark" : "light"}
        style={[
          styles.blurWrapper,
          { paddingBottom: insets.bottom + 8, paddingTop: 12 },
        ]}
      >
        <View style={styles.tabBarInner}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              if (route.name === "scan") {
                router.push("/screens/ai-scan");
                return;
              }
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            if (route.name === "scan") {
              return (
                <CopilotStep
                  text="Kamera ile elindeki malzemeleri tarayarak anında tarif bulabilirsin."
                  order={2}
                  name="tarat"
                  key={route.name}
                >
                  <CopilotView
                    key={route.key}
                    style={styles.scanButtonContainer}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={onPress}
                      onLongPress={onLongPress}
                      style={scanButtonTouchableStyle}
                    >
                      <LinearGradient
                        colors={["#FFB76B", "#F48D4D"]}
                        style={scanButtonGradientStyle}
                      >
                        <MaterialIcons
                          name="center-focus-strong"
                          size={32}
                          color="white"
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                    <Text style={[styles.scanLabel, { color: theme.tint }]}>
                      Tarat
                    </Text>
                  </CopilotView>
                </CopilotStep>
              );
            }

            const getIcon = (name: string) => {
              switch (name) {
                case "index":
                  return (
                    <MaterialIcons name="home" size={24} color={iconColor} />
                  );
                case "daily-log":
                  return (
                    <MaterialIcons
                      name="calendar-today"
                      size={24}
                      color={iconColor}
                    />
                  );
                case "favorites":
                  return (
                    <MaterialIcons
                      name="favorite"
                      size={24}
                      color={iconColor}
                    />
                  );
                case "explore":
                  return (
                    <MaterialIcons name="explore" size={24} color={iconColor} />
                  );
                default:
                  return (
                    <MaterialIcons
                      name="help-outline"
                      size={24}
                      color={iconColor}
                    />
                  );
              }
            };

            const getLabel = (name: string) => {
              switch (name) {
                case "index":
                  return "Ana Sayfa";
                case "daily-log":
                  return "Daily Log";
                case "favorites":
                  return "Favorite";
                case "explore":
                  return "Keşfet";
                default:
                  return name;
              }
            };

            const iconColor = isFocused ? theme.tint : theme.tabIconDefault;
            const labelColor = isFocused ? theme.tint : theme.icon;

            const getStepProps = (name: string) => {
              switch (name) {
                case "explore":
                  return {
                    order: 3,
                    name: "kesfet",
                    text: "Sana özel önerileri ve trend tarifleri buradan keşfet.",
                  };
                case "favorites":
                  return {
                    order: 4,
                    name: "favoriler",
                    text: "Beğendiğin tariflere buradan kolayca ulaş.",
                  };
                case "recipes":
                  return {
                    order: 5,
                    name: "tariflerim",
                    text: "AI ile oluşturduğun tüm tariflerini burada saklıyoruz.",
                  };
                default:
                  return null;
              }
            };

            const stepProps = getStepProps(route.name);

            const tabItemContent = (
              <CopilotView style={styles.tabItem}>
                {getIcon(route.name)}
                <Text style={[styles.tabLabel, { color: labelColor }]}>
                  {getLabel(route.name)}
                </Text>
              </CopilotView>
            );

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1 }}
              >
                {stepProps ? (
                  <CopilotStep
                    key={route.name}
                    order={stepProps.order}
                    name={stepProps.name}
                    text={stepProps.text}
                  >
                    {tabItemContent}
                  </CopilotStep>
                ) : (
                  tabItemContent
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={homeIndicatorStyle} />
      </BlurView>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Keşfet",
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: "Tarat",
        }}
      />
      <Tabs.Screen
        name="daily-log"
        options={{
          title: "Daily Log",
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoriler",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  blurWrapper: {
    width: "100%",
  },
  tabBarInner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
  },
  scanButtonContainer: {
    alignItems: "center",
    marginTop: -40,
    position: "relative",
    zIndex: 50,
  },
  scanButtonTouchable: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 4,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  scanButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
  },
  scanLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
  },
  homeIndicator: {
    width: 128,
    height: 5,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 8,
  },
});
