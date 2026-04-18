import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const { toggleColorScheme, colorScheme } = useColorScheme();
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black px-6 pt-16">
      <Text className="text-4xl font-black dark:text-white mb-8 italic">SETTINGS</Text>
      
      {/* AUTH PROMPT BANNER */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('Onboarding')}
        className="bg-gray-100 dark:bg-gray-900 border-2 border-green-500 p-6 rounded-3xl mb-8 flex-row justify-between items-center"
      >
        <View className="flex-1 pr-4">
          <Text className="dark:text-white font-bold text-lg">Save your progress?</Text>
          <Text className="text-gray-500 text-xs">Create an account to sync your BMI and gym data.</Text>
        </View>
        <Ionicons name="person-add" size={24} color="#22c55e" />
      </TouchableOpacity>

      {/* THEME TOGGLE */}
      <TouchableOpacity 
        onPress={toggleColorScheme} 
        className="bg-gray-100 dark:bg-gray-900 p-5 rounded-2xl flex-row justify-between items-center mb-4"
      >
        <View className="flex-row items-center">
          <Ionicons name={colorScheme === 'dark' ? 'moon' : 'sunny'} size={20} color="#22c55e" />
          <Text className="dark:text-white font-bold ml-3">App Theme</Text>
        </View>
        <Text className="text-green-500 font-black uppercase">{colorScheme}</Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-500 mt-10 text-xs font-bold uppercase tracking-widest">Version 1.0.0 (Guest Mode)</Text>
    </ScrollView>
  );
}