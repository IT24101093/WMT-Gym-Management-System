import "./global.css";
import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // 👈 Added this!

import AppTabs from './src/navigation/AppTabs';
import AdminNavigator from './src/navigation/AdminNavigator';
import AuthStack from './src/navigation/AuthStack';

// 👇 Import your new Admin Screens here!
import ManagePlansScreen from './src/screens/admin/ManagePlansScreen';
import ManageUsersScreen from './src/screens/admin/ManageUsersScreen';

import { AuthProvider, AuthContext } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

// 🏗️ NEW: The Admin Stack 
// This holds the Tabs AND the full-screen pages like Plans and Members
const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* 1. The Tabs are the base screen */}
    <Stack.Screen name="AdminTabs" component={AdminNavigator} />
    
    {/* 2. These screens slide over the top of the tabs! */}
    <Stack.Screen name="AdminPlans" component={ManagePlansScreen} />
    <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  if (user) {
    // 🚦 REDIRECT ADMINS HERE
    if (user.role === 'admin') { 
      return <AdminStack />; // 👈 Now returning the STACK instead of just the Tabs
    }
    
    // Regular Users go here
    return <AppTabs />;
  }

  return <AuthStack />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}