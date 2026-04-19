import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Pressable, Alert } from 'react-native';
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
  
  // Modal States
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [storeModalVisible, setStoreModalVisible] = useState(false); 
  const [activeFeature, setActiveFeature] = useState('');

  const navigation = useNavigation();

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      let feedback = ""; let color = ""; let percentage = 0;
      
      if (bmi < 18.5) { feedback = "Underweight 💪"; color = "#fbbf24"; percentage = 25; }
      else if (bmi < 25) { feedback = "Healthy Zone 🔥"; color = "#22c55e"; percentage = 50; }
      else if (bmi < 30) { feedback = "Overweight 🏃‍♂️"; color = "#f97316"; percentage = 75; }
      else { feedback = "Obese 🎯"; color = "#ef4444"; percentage = 90; }
      
      setBmiResult({ score: bmi, feedback, color, percentage });
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1 px-6 pt-16" showsVerticalScrollIndicator={false}>
        
        {/* RESTORED: YOUR ORIGINAL LOGIN BANNER STYLE */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Register')}
          className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl mb-8 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1">
            <Ionicons name="person-circle" size={24} color="#22c55e" />
            {/* Kept your exact text: "You are not logged in" */}
            <Text className="text-gray-900 dark:text-white font-bold ml-2">You are not logged in</Text>
          </View>
          <Text className="text-green-500 font-black uppercase text-xs">Login / Sign Up</Text>
        </TouchableOpacity>

        <View className="mb-8">
          <Text className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Guest Access</Text>
          <Text className="text-4xl font-black text-gray-900 dark:text-white leading-tight italic">ELITE <Text className="text-green-500">DASHBOARD</Text></Text>
        </View>

        {/* 1. BMI ANALYZER */}
        <View className="bg-gray-100 dark:bg-gray-900 rounded-[40px] p-8 mb-6 border border-gray-200 dark:border-gray-800">
          <Text className="text-xl font-black text-gray-900 dark:text-white uppercase mb-6 italic">BMI Analyzer</Text>
          
          <View className="flex-row gap-x-3 mb-6">
            <TextInput placeholder="H (cm)" placeholderTextColor="#64748b" keyboardType="numeric" value={height} onChangeText={setHeight} className="flex-1 bg-white dark:bg-black p-5 rounded-2xl dark:text-white font-bold border border-gray-200 dark:border-gray-800" />
            <TextInput placeholder="W (kg)" placeholderTextColor="#64748b" keyboardType="numeric" value={weight} onChangeText={setWeight} className="flex-1 bg-white dark:bg-black p-5 rounded-2xl dark:text-white font-bold border border-gray-200 dark:border-gray-800" />
            <TouchableOpacity onPress={calculateBMI} className="bg-green-500 px-8 rounded-2xl justify-center shadow-lg shadow-green-500/40">
              <Ionicons name="calculator" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {bmiResult && (
            <View className="mt-2">
              <View className="h-3 bg-gray-200 dark:bg-black rounded-full overflow-hidden flex-row mb-4">
                <View style={{ width: `${bmiResult.percentage}%`, backgroundColor: bmiResult.color }} className="h-full rounded-full" />
              </View>
              <View className="flex-row justify-between items-end">
                <View>
                   <Text className="text-4xl font-black dark:text-white">{bmiResult.score}</Text>
                   <Text style={{ color: bmiResult.color }} className="font-bold uppercase tracking-widest text-[10px]">{bmiResult.feedback}</Text>
                </View>
                <Ionicons name="stats-chart" size={32} color={bmiResult.color} />
              </View>
            </View>
          )}
        </View>

        {/* 2. PRICING BANNER (Correctly placed between BMI and Cards) */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Pricing')} 
          className="bg-green-500 rounded-3xl p-8 mb-6 flex-row justify-between items-center shadow-lg shadow-green-500/20"
        >
          <View className="flex-1">
            <Text className="text-black text-2xl font-black uppercase italic leading-none">Elite Plans</Text>
            <Text className="text-black font-medium opacity-60 mt-1">Upgrade for full access.</Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={40} color="black" />
        </TouchableOpacity>

        {/* 3. FEATURE CARDS GRID */}
        <View className="flex-row flex-wrap justify-between gap-y-4 mb-20">
          <ActionButton label="Trainers" icon="people" onPress={() => { setActiveFeature('Expert Trainers'); setAuthModalVisible(true); }} />
          <ActionButton label="Workouts" icon="barbell" onPress={() => { setActiveFeature('Pro Workouts'); setAuthModalVisible(true); }} />
          <ActionButton label="Diet Plan" icon="fast-food" onPress={() => { setActiveFeature('Diet Plans'); setAuthModalVisible(true); }} />
          <ActionButton label="Progress" icon="trending-up" onPress={() => { setActiveFeature('Progress Tracking'); setAuthModalVisible(true); }} />
          <ActionButton label="Store" icon="cart" onPress={() => setStoreModalVisible(true)} />
          <ActionButton label="Support" icon="help-buoy" onPress={() => navigation.navigate('Support')} />
        </View>
      </ScrollView>

      {/* --- AUTH MODAL --- */}
      <CustomThemeModal 
        visible={authModalVisible} 
        onClose={() => setAuthModalVisible(false)}
        title={`Unlock ${activeFeature}`}
        desc="Create an account to access premium features and track your progress."
        btnText="Register Now"
        onBtnPress={() => { setAuthModalVisible(false); navigation.navigate('Register'); }}
        icon="lock-closed"
      />

      {/* --- STORE "COMING SOON" MODAL --- */}
      <CustomThemeModal 
        visible={storeModalVisible} 
        onClose={() => setStoreModalVisible(false)}
        title="Elite Store"
        desc="Our premium merchandise store is currently under construction. Check back soon for exclusive gear!"
        btnText="Got it"
        onBtnPress={() => setStoreModalVisible(false)}
        icon="construct"
      />
    </View>
  );
};

// Reusable Theme-Compliant Modal
const CustomThemeModal = ({ visible, onClose, title, desc, btnText, onBtnPress, icon }) => (
  <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
    <Pressable className="flex-1 bg-black/40 dark:bg-black/80 justify-center items-center px-6" onPress={onClose}>
      <View className="bg-white dark:bg-gray-950 w-full p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 items-center shadow-2xl">
        <View className="bg-green-500/10 p-4 rounded-full mb-4">
          <Ionicons name={icon} size={40} color="#22c55e" />
        </View>
        <Text className="text-gray-900 dark:text-white text-2xl font-black text-center uppercase italic mb-2">{title}</Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center mb-8">{desc}</Text>
        <TouchableOpacity onPress={onBtnPress} className="bg-green-500 w-full py-5 rounded-2xl items-center mb-3">
          <Text className="text-black font-black uppercase">{btnText}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} className="w-full py-4 items-center">
          <Text className="text-gray-400 dark:text-gray-500 font-bold uppercase text-xs tracking-widest">Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);

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