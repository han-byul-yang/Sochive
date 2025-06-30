import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTheme } from "@/contexts/ThemeContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode
          ? "#E2DFD0"
          : Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          height: 66,
          elevation: 0,
          paddingTop: 8,
          borderTopWidth: 0,
          backgroundColor: isDarkMode ? "#121212" : "#fff",
        },
        // tabBarStyle: Platform.select({
        //   ios: {
        //     // Use a transparent background on iOS to show the blur effect
        //     position: "absolute",
        //     bottom: 0,
        //     borderTopWidth: 0,
        //     backgroundColor: "transparent",
        //   },
        //   default: {},
        // }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Archive",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="grid" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="gear" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
