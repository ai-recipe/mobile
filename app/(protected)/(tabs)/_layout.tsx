import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BlurView } from "expo-blur";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.tabBarContainer}>
      <BlurView
        intensity={80}
        tint="light"
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

            // Central Scan Button
            if (route.name === "scan") {
              return (
                <View key={route.key} style={styles.scanButtonContainer}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    style={styles.scanButtonTouchable}
                  >
                    <LinearGradient
                      colors={["#FFB76B", "#F48D4D"]}
                      style={styles.scanButtonGradient}
                    >
                      <MaterialIcons
                        name="center-focus-strong"
                        size={32}
                        color="white"
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                  <Text style={styles.scanLabel}>Tarat</Text>
                </View>
              );
            }

            const getIcon = (name: string, focused: boolean) => {
              switch (name) {
                case "index":
                  return "home";
                case "recipes":
                  return "menu-book";
                case "favorites":
                  return focused ? "favorite" : "favorite-border";
                case "profile":
                  return focused ? "person" : "person-outline";
                default:
                  return "help-outline";
              }
            };

            const getLabel = (name: string) => {
              switch (name) {
                case "index":
                  return "Ana Sayfa";
                case "recipes":
                  return "Tarifler";
                case "favorites":
                  return "Favoriler";
                case "profile":
                  return "Profil";
                default:
                  return name;
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
              >
                <MaterialIcons
                  name={getIcon(route.name, isFocused) as any}
                  size={24}
                  color={isFocused ? "#F48D4D" : "#94A3B8"}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? "#F48D4D" : "#64748B" },
                  ]}
                >
                  {getLabel(route.name)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* iOS style home indicator hint */}
        <View style={styles.homeIndicator} />
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
        name="recipes"
        options={{
          title: "Tarifler",
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Tarat",
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoriler",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
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
    backgroundColor: "transparent", // Use transparent with BlurView
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    // Add shadow for premium feel
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    overflow: "hidden", // Important for blur clipping
  },
  blurWrapper: {
    width: "100%",
  },
  tabBarInner: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    marginTop: -40, // Elevated Look
    position: "relative",
    zIndex: 50,
  },
  scanButtonTouchable: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
    padding: 4,
    // Shadow for FAB
    shadowColor: "#F48D4D",
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
    borderColor: "white",
  },
  scanLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#F48D4D",
    marginTop: 4,
  },
  homeIndicator: {
    width: 128,
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 8,
  },
});
