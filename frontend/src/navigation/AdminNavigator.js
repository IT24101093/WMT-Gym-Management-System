import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

// Screens
import AdminDashboard from "../screens/admin/AdminDashboard";
import PendingApprovals from "../screens/admin/PendingApprovals";
import AdminSettings from "../screens/admin/AdminSettings";
import QRScannerScreen from "../screens/admin/QRScannerScreen"; // 👈 අලුතින් සාදන Screen එක

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: {
          fontWeight: "800",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 5,
        },
        tabBarStyle: {
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          borderTopColor: isDark ? "#1e293b" : "#e2e8f0",
          borderTopWidth: 1,
          height: 65,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid" size={24} color={color} />
          ),
        }}
      />

      {/* 🔘 SCANNER TAB (Hidden from bottom bar but accessible via navigation) */}
      <Tab.Screen
        name="Scanner"
        component={QRScannerScreen}
        options={{
          tabBarButton: () => null, // 👈 Tab bar එකේ පෙන්වන්නේ නැතිව ඉන්න
          tabBarVisible: false,
        }}
      />

      <Tab.Screen
        name="Approvals"
        component={PendingApprovals}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-circle" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={AdminSettings}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
