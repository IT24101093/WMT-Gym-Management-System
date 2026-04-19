import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import DashboardScreen from '../screens/user/DashboardScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import SettingsScreen from '../screens/user/SettingsScreen';
import PlansScreen from '../screens/user/PlansScreen'; 
import SupportPage from '../screens/guest/SupportPage'; 

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const { colorScheme } = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff', 
          borderTopWidth: colorScheme === 'dark' ? 0 : 1,
          borderTopColor: '#e2e8f0',
          height: 85, 
          paddingBottom: 25 
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#475569' : '#94a3b8',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarShowLabel: false,
      })}
    >
      {/* 🟢 VISIBLE TABS */}
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} /> 

      {/* 👻 HIDDEN SCREENS (No ghost spacing!) */}
      <Tab.Screen 
        name="Support" 
        component={SupportPage} 
        options={{ 
          tabBarButton: () => null, 
          tabBarItemStyle: { display: 'none' } 
        }} 
      />
      <Tab.Screen 
        name="Plans" 
        component={PlansScreen} 
        options={{ 
          tabBarButton: () => null, 
          tabBarItemStyle: { display: 'none' } 
        }} 
      />
    </Tab.Navigator>
  );
}