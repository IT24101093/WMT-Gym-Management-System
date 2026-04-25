import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { AuthContext } from '../../context/AuthContext';

export default function AdminSettings({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  // State for custom logout modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView 
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* 🏆 Header - Now matches User Settings with Back Button */}
        <View className="flex-row items-center mb-10">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Ionicons name="arrow-back" size={28} color="#22c55e" />
          </TouchableOpacity>
          <Text className="text-3xl font-black dark:text-white uppercase italic">
            Admin <Text className="text-green-500">Settings</Text>
          </Text>
        </View>

        {/* 🌓 Theme Toggle - Exact match to SettingsScreen.js */}
        <Text className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4">Preferences</Text>
        <TouchableOpacity 
          onPress={toggleColorScheme} 
          className="bg-gray-100 dark:bg-gray-900 p-5 rounded-2xl flex-row justify-between items-center mb-8 border border-gray-200 dark:border-gray-800"
        >
          <View className="flex-row items-center">
            <Ionicons name={colorScheme === 'dark' ? 'moon' : 'sunny'} size={24} color="#22c55e" />
            <Text className="dark:text-white font-bold text-lg ml-4">Dark Mode</Text>
          </View>
          <View className={`w-14 h-8 rounded-full justify-center px-1 ${colorScheme === 'dark' ? 'bg-green-500' : 'bg-gray-300'}`}>
            <View className={`w-6 h-6 bg-white rounded-full ${colorScheme === 'dark' ? 'self-end' : 'self-start'}`} />
          </View>
        </TouchableOpacity>

        {/* 🛡️ Authority Actions */}
        <Text className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4">Session Management</Text>
        <TouchableOpacity 
          onPress={() => setShowLogoutModal(true)} 
          className="bg-red-500/10 p-5 rounded-2xl flex-row items-center border border-red-500/20"
        >
          <Ionicons name="log-out" size={24} color="#ef4444" />
          <Text className="text-red-500 font-black text-lg ml-4 uppercase italic">Terminate Session</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ⚠️ CUSTOM LOGOUT MODAL - Standardized across Portal */}
      <Modal 
        animationType="fade" 
        transparent={true} 
        visible={showLogoutModal} 
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 bg-black/60 dark:bg-black/80 justify-center items-center px-6">
          <View className="bg-white dark:bg-gray-900 w-full p-8 rounded-[30px] border border-gray-200 dark:border-gray-800 shadow-2xl items-center">
            
            <View className="bg-red-500/10 p-4 rounded-full mb-4">
              <Ionicons name="log-out" size={40} color="#ef4444" />
            </View>

            <Text className="text-2xl font-black dark:text-white uppercase italic text-center mb-2">
              Hold Up!
            </Text>
            
            <Text className="text-gray-500 dark:text-gray-400 text-center mb-8 font-medium">
              Are you sure you want to log out of the admin portal?
            </Text>

            <TouchableOpacity 
              onPress={() => {
                setShowLogoutModal(false);
                logout();
              }} 
              className="w-full bg-red-500 py-4 rounded-2xl items-center mb-3 shadow-lg shadow-red-500/30"
            >
              <Text className="text-white font-black uppercase">Yes, Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setShowLogoutModal(false)} 
              className="w-full py-4 items-center"
            >
              <Text className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">
                Cancel
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}