import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axios';

// 🛠️ Reusable Input Field 
const InputField = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType, className, autoCapitalize, customStyle }) => (
  <TextInput
    placeholder={placeholder}
    placeholderTextColor="#9ca3af"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType || 'default'}
    autoCapitalize={autoCapitalize || 'words'}
    className={`bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-black dark:text-white ${customStyle || ''} ${className}`}
  />
);

// 🎨 Custom Themed Alert Dialog (Modeled exactly after GuestTabs.js)
const CustomAlert = ({ visible, title, message, onClose, isSuccess }) => (
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
        <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${isSuccess ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
          <Ionicons name={isSuccess ? "checkmark-circle" : "alert-circle"} size={36} color={isSuccess ? "#22c55e" : "#ef4444"} />
        </View>
        <Text className="text-2xl font-black dark:text-white mb-2 text-center uppercase italic">{title}</Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center mb-8 leading-6 text-base">{message}</Text>
        <TouchableOpacity 
          onPress={onClose} 
          className={`w-full py-4 rounded-2xl items-center ${isSuccess ? 'bg-green-500' : 'bg-gray-900 dark:bg-gray-100'}`}
        >
          <Text className={`font-black uppercase text-lg ${isSuccess ? 'text-black' : 'text-white dark:text-black'}`}>
            {isSuccess ? 'Continue' : 'Got it'}
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', age: '', nic: '', height: '', weight: ''
  });
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', isSuccess: false });

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const showAlert = (title, message, isSuccess = false) => {
    setAlertConfig({ visible: true, title, message, isSuccess });
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, visible: false });
    if (alertConfig.isSuccess) {
      navigation.navigate('Login');
    }
  };

  // 🛡️ Frontend Validation Logic
  const validateForm = () => {
    const { name, email, password, confirmPassword, phone, age, nic, height, weight } = form;

    if (!name || !email || !password || !confirmPassword || !phone || !age || !nic || !height || !weight) {
      showAlert('Hold up', 'Please fill in all fields to complete your profile.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    if (password.length < 6) {
      showAlert('Weak Password', 'Your password must be at least 6 characters long.');
      return false;
    }

    if (password !== confirmPassword) {
      showAlert('Password Mismatch', 'Your passwords do not match. Please check them and try again.');
      return false;
    }

    const phoneRegex = /^\d{9,12}$/;
    if (!phoneRegex.test(phone)) {
      showAlert('Invalid Phone', 'Please enter a valid phone number.');
      return false;
    }

    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    if (!nicRegex.test(nic)) {
      showAlert('Invalid NIC', 'Please enter a valid Sri Lankan NIC (e.g., 981234567V or 199812345678).');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post('/users/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        nic: form.nic,
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight)
      });
      
      showAlert('Welcome to Elite!', 'Your account has been created successfully. Log in to start crushing your goals.', true);
    } catch (error) {
      showAlert('Registration Failed', error.response?.data?.message || 'Check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // 🔴/🟢 Dynamic Border Glow Logic (No Reanimated Transition Classes)
  let confirmGlowStyle = "";
  if (form.confirmPassword.length > 0) {
    if (form.password === form.confirmPassword) {
      confirmGlowStyle = "border-green-500 bg-green-500/10";
    } else {
      confirmGlowStyle = "border-red-500 bg-red-500/10";
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <CustomAlert 
        visible={alertConfig.visible} 
        title={alertConfig.title} 
        message={alertConfig.message} 
        isSuccess={alertConfig.isSuccess}
        onClose={closeAlert} 
      />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 40 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
          <Ionicons name="arrow-back" size={28} color="#22c55e" />
        </TouchableOpacity>

        <Text className="text-4xl font-black dark:text-white mb-2 uppercase italic">
          Join <Text className="text-green-500">Elite</Text>
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
          Create your account and start crushing your goals.
        </Text>

        <View className="mb-8">
          <InputField placeholder="Full Name" value={form.name} onChangeText={(v) => handleChange('name', v)} className="mb-4" />
          
          <InputField placeholder="Email Address" value={form.email} onChangeText={(v) => handleChange('email', v)} keyboardType="email-address" autoCapitalize="none" className="mb-4" />
          
          <InputField placeholder="Password (Min. 6 chars)" value={form.password} onChangeText={(v) => handleChange('password', v)} secureTextEntry autoCapitalize="none" className="mb-4" />
          
          <InputField 
            placeholder="Confirm Password" 
            value={form.confirmPassword} 
            onChangeText={(v) => handleChange('confirmPassword', v)} 
            secureTextEntry 
            autoCapitalize="none" 
            customStyle={confirmGlowStyle}
            className="mb-4" 
          />
          
          <InputField placeholder="Phone Number" value={form.phone} onChangeText={(v) => handleChange('phone', v)} keyboardType="phone-pad" className="mb-4" />
          
          <InputField placeholder="NIC Number (e.g., 981234567V)" value={form.nic} onChangeText={(v) => handleChange('nic', v)} autoCapitalize="none" className="mb-4" />
          
          <View className="flex-row justify-between mb-4">
            <View className="w-[48%]">
               <InputField placeholder="Age" value={form.age} onChangeText={(v) => handleChange('age', v)} keyboardType="numeric" />
            </View>
            <View className="w-[48%]">
               <InputField placeholder="Height (cm)" value={form.height} onChangeText={(v) => handleChange('height', v)} keyboardType="numeric" />
            </View>
          </View>
          
          <InputField placeholder="Weight (kg)" value={form.weight} onChangeText={(v) => handleChange('weight', v)} keyboardType="numeric" />
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="bg-green-500 py-5 rounded-2xl items-center shadow-lg shadow-green-500/20 mb-6"
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="font-black uppercase text-black text-lg">Create Account</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500 dark:text-gray-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-green-500 font-bold">Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}