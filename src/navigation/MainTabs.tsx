import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import type { MainTabParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import ScannerScreen from "../screens/ScannerScreen";
import GameModeScreen from "../screens/GameModeScreen";
import ARGameplayScreen from "../screens/ARGameplayScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#00FFA3",
        tabBarInactiveTintColor: "rgba(255,255,255,0.55)",
        tabBarStyle: {
          backgroundColor: "rgba(5,8,20,0.9)",
          borderTopColor: "rgba(123,92,255,0.25)",
          borderTopWidth: 1,
          height: 68,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let name: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "Home") name = focused ? "home" : "home-outline";
          if (route.name === "Scanner") name = focused ? "scan" : "scan-outline";
          if (route.name === "Game") name = focused ? "game-controller" : "game-controller-outline";
          if (route.name === "Hunt") name = focused ? "aperture" : "aperture-outline";
          if (route.name === "Leaderboard") name = focused ? "podium" : "podium-outline";
          if (route.name === "Profile") name = focused ? "person" : "person-outline";
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="Game" component={GameModeScreen} />
      <Tab.Screen name="Hunt" component={ARGameplayScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

