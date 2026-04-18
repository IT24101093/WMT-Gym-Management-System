import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SettingsScreen from '../screens/guest/SettingsScreen';
import { useColorScheme } from 'nativewind';

const Tab = createBottomTabNavigator();

const GuestHomeScreen = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState('');

  const navigation = useNavigation();

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      let feedback = ""; let color = "";
      if (bmi < 18.5) { feedback = "Underweight: Time to bulk up! 💪"; color = "#fbbf24"; }
      else if (bmi < 25) { feedback = "Healthy: You're in the zone! 🔥"; color = "#22c55e"; }
      else if (bmi < 30) { feedback = "Overweight: Let's start moving! 🏃‍♂️"; color = "#f97316"; }
      else { feedback = "Obese: Focus on consistency! 🎯"; color = "#ef4444"; }
      setBmiResult({ score: bmi, feedback, color });
    }
  };

  const openAuthModal = (feature) => {
    setActiveFeature(feature);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1 px-6 pt-16">
        <View className="mb-8">
          <Text className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Guest Access</Text>
          <Text className="text-4xl font-black text-gray-900 dark:text-white leading-tight">Your Fitness <Text className="text-green-500">Dashboard</Text></Text>
        </View>

        {/* BMI WIDGET */}
        <View className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-6 mb-6 border border-gray-200 dark:border-gray-800">
          <Text className="text-xl font-black text-gray-900 dark:text-white uppercase mb-4">BMI Tracker</Text>
          <View className="flex-row gap-x-3 mb-4">
            <TextInput placeholder="H (cm)" placeholderTextColor="#64748b" keyboardType="numeric" value={height} onChangeText={setHeight} className="flex-1 bg-white dark:bg-black p-4 rounded-xl dark:text-white font-bold" />
            <TextInput placeholder="W (kg)" placeholderTextColor="#64748b" keyboardType="numeric" value={weight} onChangeText={setWeight} className="flex-1 bg-white dark:bg-black p-4 rounded-xl dark:text-white font-bold" />
            <TouchableOpacity onPress={calculateBMI} className="bg-green-500 px-6 rounded-xl justify-center"><Text className="font-black text-black">GO</Text></TouchableOpacity>
          </View>
          {bmiResult && (
            <View style={{ borderColor: bmiResult.color }} className="mt-2 p-4 border-l-4 bg-white dark:bg-black rounded-r-xl">
              <Text className="text-3xl font-black dark:text-white">{bmiResult.score}</Text>
              <Text style={{ color: bmiResult.color }} className="font-bold">{bmiResult.feedback}</Text>
            </View>
          )}
        </View>

        {/* PRICING BANNER */}
        <TouchableOpacity onPress={() => navigation.navigate('Pricing')} className="bg-green-500 rounded-3xl p-6 mb-6">
          <Text className="text-black text-2xl font-black uppercase italic">See Elite Pricing</Text>
          <Text className="text-black font-medium">Join the 1% of top athletes today.</Text>
        </TouchableOpacity>

        {/* GRID COMPONENTS */}
        <View className="flex-row flex-wrap justify-between gap-y-4 mb-10">
          <ActionButton label="Trainers" icon="people" onPress={() => openAuthModal('Trainers')} />
          <ActionButton label="Workouts" icon="barbell" onPress={() => openAuthModal('Workouts')} />
          <ActionButton label="Store" icon="cart" onPress={() => openAuthModal('Store')} />
          <ActionButton label="Support" icon="help-buoy" onPress={() => navigation.navigate('Support')} />
        </View>
      </ScrollView>

      {/* --- CUSTOM ADAPTIVE AUTH MODAL --- */}
<Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
  <Pressable 
    className="flex-1 bg-black/40 dark:bg-black/80 justify-center items-center px-6" 
    onPress={() => setModalVisible(false)}
  >
    {/* Card background: White in Light Mode, Dark Gray in Dark Mode */}
    <View className="bg-white dark:bg-gray-950 w-full p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 items-center shadow-2xl">
      
      <View className="bg-green-500/10 p-4 rounded-full mb-4">
        <Ionicons name="lock-closed" size={40} color="#22c55e" />
      </View>

      {/* Text: Black in Light Mode, White in Dark Mode */}
      <Text className="text-gray-900 dark:text-white text-2xl font-black text-center uppercase italic mb-2">
        Unlock {activeFeature}
      </Text>
      
      <Text className="text-gray-500 dark:text-gray-400 text-center mb-8">
        Create an account to access premium features and track your progress.
      </Text>
      
      <TouchableOpacity 
        onPress={() => { setModalVisible(false); navigation.navigate('Register'); }}
        className="bg-green-500 w-full py-5 rounded-2xl items-center mb-3 shadow-lg shadow-green-500/30"
      >
        <Text className="text-black font-black uppercase">Register Now</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => setModalVisible(false)}
        className="w-full py-4 rounded-2xl items-center border border-gray-200 dark:border-gray-700"
      >
        <Text className="text-gray-400 dark:text-gray-500 font-bold uppercase">Maybe Later</Text>
      </TouchableOpacity>
    </View>
  </Pressable>
  </Modal>
    </View>
  );
};

const ActionButton = ({ label, icon, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ width: '48%' }} className="bg-gray-100 dark:bg-gray-900 p-6 rounded-3xl items-center border border-gray-200 dark:border-gray-800">
    <Ionicons name={icon} size={28} color="#22c55e" />
    <Text className="mt-2 font-bold text-gray-900 dark:text-white">{label}</Text>
  </TouchableOpacity>
);

export default function GuestTabs() {
  const { colorScheme } = useColorScheme(); // Get current theme

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { 
          // This dynamically changes the color based on the theme
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff', 
          borderTopWidth: colorScheme === 'dark' ? 0 : 1,
          borderTopColor: '#e2e8f0',
          height: 85, 
          paddingBottom: 25 
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#475569' : '#94a3b8',
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Home' ? 'home' : 'settings';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={GuestHomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}