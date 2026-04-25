import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Import your Admin screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import PendingApprovals from '../screens/admin/PendingApprovals';
import AdminSettings from '../screens/admin/AdminSettings'; // 👈 Brought Settings back

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
  // Get current device theme (light or dark)
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#22c55e', // Gym Green
        tabBarInactiveTintColor: '#64748b', // Slate 500
        tabBarLabelStyle: {
          fontWeight: '800', // Matches font-extrabold
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 5,
        },
        tabBarStyle: {
          backgroundColor: isDark ? '#0f172a' : '#ffffff', // Dynamically switches slate-900 / white
          borderTopColor: isDark ? '#1e293b' : '#e2e8f0', // Dynamically switches slate-800 / slate-200
          borderTopWidth: 1,
          height: 65,
          paddingTop: 8,
          elevation: 0, // Removes Android shadow for a flatter look
          shadowOpacity: 0, // Removes iOS shadow
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminDashboard} 
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} /> 
        }}
      />
      <Tab.Screen 
        name="Approvals" 
        component={PendingApprovals} 
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="checkmark-circle" size={24} color={color} /> 
        }}
      />
      {/* 👇 Changed back to Settings */}
      <Tab.Screen 
        name="Settings" 
        component={AdminSettings} 
        options={{ 
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} /> 
        }}
      />
    </Tab.Navigator>
  );
}