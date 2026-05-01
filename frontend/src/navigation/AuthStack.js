import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import PricingPage from '../screens/guest/PricingPage'; // We will create this file next
import SupportPage from '../screens/guest/SupportPage'; // We will create this file next

// 1. Only ONE import per screen
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import GuestTabs from './GuestTabs'; 

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';


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