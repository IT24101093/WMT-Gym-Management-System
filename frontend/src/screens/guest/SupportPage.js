import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SupportPage({ navigation }) {
  return (
    <View className="flex-1 bg-white dark:bg-black px-6 pt-16">
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
        <Ionicons name="arrow-back" size={28} color="#22c55e" />
      </TouchableOpacity>

      <Text className="text-4xl font-black dark:text-white mb-4 uppercase italic">Support</Text>
      <Text className="text-gray-500 text-lg mb-8">Got questions? Our trainers and tech team are here to help.</Text>
      
      <View className="bg-gray-100 dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
        <View className="mb-6">
          <Text className="text-green-500 font-black uppercase text-xs mb-1">Email Us</Text>
          <Text className="text-xl font-bold dark:text-white">support@elitegym.com</Text>
        </View>
        
        <View>
          <Text className="text-green-500 font-black uppercase text-xs mb-1">Emergency Help</Text>
          <Text className="text-xl font-bold dark:text-white">+1 (555) 000-GYM</Text>
        </View>
      </View>
    </View>
  );
}