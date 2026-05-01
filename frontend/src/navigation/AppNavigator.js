import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTabs from './AppTabs';
import PlansScreen from '../screens/user/PlansScreen';
import WorkoutsScreen from '../screens/user/WorkoutsScreen';
import DietsScreen from '../screens/user/DietsScreen';
import TrainersScreen from '../screens/user/TrainersScreen';
import ProgressScreen from '../screens/user/ProgressScreen';
import BookingsScreen from '../screens/user/BookingsScreen';
import SupportPage from '../screens/guest/SupportPage';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={AppTabs} />
      <Stack.Screen name="Plans" component={PlansScreen} />
      <Stack.Screen name="Workouts" component={WorkoutsScreen} />
      <Stack.Screen name="Diets" component={DietsScreen} />
      <Stack.Screen name="Trainers" component={TrainersScreen} />
      <Stack.Screen name="Progress" component={ProgressScreen} />
      <Stack.Screen name="Bookings" component={BookingsScreen} />
      <Stack.Screen name="Support" component={SupportPage} />
    </Stack.Navigator>
  );
}
