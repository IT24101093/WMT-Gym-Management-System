import "./global.css";
import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import our Auth Context
import { AuthProvider, AuthContext } from './src/context/AuthContext';

// We will build these two files next!
// import AuthStack from './src/navigation/AuthStack';
// import AppTabs from './src/navigation/AppTabs';

// Add this import near the top of App.js!
import AuthStack from './src/navigation/AuthStack';

const RootNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  // BOOM! If logged in, show a temporary text. If logged out, show our Onboarding Flow!
  return user ? (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <Text className="text-green-400 text-2xl font-bold">You are logged in! App Tabs go here.</Text>
    </View>
  ) : (
    <AuthStack />
  );
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