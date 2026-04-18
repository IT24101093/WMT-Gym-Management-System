import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import PricingPage from '../screens/guest/PricingPage'; // We will create this file next
import SupportPage from '../screens/guest/SupportPage'; // We will create this file next

// 1. Only ONE import per screen
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import GuestTabs from './GuestTabs'; 

// 2. Simple placeholders for Login/Register (only declared ONCE)
const LoginScreen = () => (
  <View className="flex-1 items-center justify-center bg-gray-950">
    <Text className="text-white text-2xl font-bold">Login Coming Soon 🔒</Text>
  </View>
);

const RegisterScreen = () => (
  <View className="flex-1 items-center justify-center bg-gray-950">
    <Text className="text-white text-2xl font-bold">Register Coming Soon 📝</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="GuestTabs" component={GuestTabs} /> 
      <Stack.Screen name="Pricing" component={PricingPage} />
      <Stack.Screen name="Support" component={SupportPage} />
    </Stack.Navigator>
  );
}