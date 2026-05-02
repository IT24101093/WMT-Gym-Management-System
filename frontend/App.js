import "./global.css";
import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import AdminNavigator from './src/navigation/AdminNavigator';
import AuthStack from './src/navigation/AuthStack';
import ManagePlansScreen from './src/screens/admin/ManagePlansScreen';
import ManageTrainersScreen from './src/screens/admin/ManageTrainersScreen';
import ManageUsersScreen from './src/screens/admin/ManageUsersScreen';
import ManageDietsScreen from './src/screens/admin/ManageDietsScreen';
import ManageWorkoutsScreen from './src/screens/admin/ManageWorkoutsScreen';
import ManageProgressScreen from './src/screens/admin/ManageProgressScreen';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminTabs" component={AdminNavigator} />
    <Stack.Screen name="AdminPlans" component={ManagePlansScreen} />
    <Stack.Screen name="AdminTrainers" component={ManageTrainersScreen} />
    <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
    <Stack.Screen name="ManageDiets" component={ManageDietsScreen} />
    <Stack.Screen name="ManageWorkouts" component={ManageWorkoutsScreen} />
    <Stack.Screen name="ManageProgress" component={ManageProgressScreen} />
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

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        user.role === 'admin' ? (
          <Stack.Screen name="AdminRoot" component={AdminStack} />
        ) : (
          <Stack.Screen name="UserRoot" component={AppNavigator} />
        )
      ) : (
        <Stack.Screen name="AuthRoot" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
