import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Modal, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext'; // Adjust path if needed

// 🎨 Custom Themed Error Dialog (Crash-free, matches your Elite theme)
const CustomAlert = ({ visible, title, message, onClose }) => (
  <Modal 
    transparent={true} 
    visible={visible} 
    animationType="fade"
    onRequestClose={onClose}
  >
    <Pressable 
      className="flex-1 justify-center items-center bg-black/70 px-6" 
      onPress={onClose}
    >
      <View className="bg-white dark:bg-gray-900 w-full p-8 rounded-3xl items-center border border-gray-200 dark:border-gray-800 shadow-2xl">
        <View className="w-16 h-16 rounded-full items-center justify-center mb-4 bg-red-100 dark:bg-red-900/30">
          <Ionicons name="alert-circle" size={36} color="#ef4444" />
        </View>
        <Text className="text-2xl font-black dark:text-white mb-2 text-center uppercase italic">{title}</Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center mb-8 leading-6 text-base">{message}</Text>
        <TouchableOpacity 
          onPress={onClose} 
          className="w-full py-4 rounded-2xl items-center bg-gray-900 dark:bg-gray-100"
        >
          <Text className="font-black uppercase text-lg text-white dark:text-black">
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Alert State
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '' });

  // Pull the login function straight from your context
  const { login } = useContext(AuthContext);

  const showError = (title, message) => {
    setAlertConfig({ visible: true, title, message });
  };

  const handleLogin = async () => {
    // 1. Frontend Validation
    if (!email || !password) {
      return showError('Hold up', 'Please fill in both your email and password.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return showError('Invalid Email', 'Please enter a valid email address format.');
    }

    // 2. Execute Login
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    // 3. Handle Backend Errors
    if (!result.success) {
      showError('Login Failed', result.message || 'Check your credentials and try again.');
    }
    // Note: If successful, AuthContext updates `user` and App.js automatically mounts AppTabs!
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* 🚨 Injecting the Custom Alert Modal */}
      <CustomAlert 
        visible={alertConfig.visible} 
        title={alertConfig.title} 
        message={alertConfig.message} 
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })} 
      />

      {/* 🛡️ Keyboard Avoiding Layout */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center', // 🎯 This vertically centers the content
            paddingHorizontal: 24, 
            paddingBottom: 40 
          }}
        >
          {/* 🔙 Back Button: Absolute position keeps it in the top left corner */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="absolute top-4 left-0 z-10"
          >
            <Ionicons name="arrow-back" size={28} color="#22c55e" />
          </TouchableOpacity>

          <View className="mt-12 mb-10">
            <Text className="text-4xl font-black dark:text-white mb-2 uppercase italic">
              Welcome <Text className="text-green-500">Back</Text>
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 font-medium">
              Sign in to continue your elite journey.
            </Text>
          </View>

          <View className="mb-8">
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 text-lg text-black dark:text-white mb-4"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 text-lg text-black dark:text-white mb-2"
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-green-500 py-5 rounded-2xl items-center shadow-lg shadow-green-500/20"
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text className="font-black uppercase text-black text-lg">Log In</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500 dark:text-gray-400">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-green-500 font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}