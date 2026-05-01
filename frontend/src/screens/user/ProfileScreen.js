import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios'; 

export default function ProfileScreen() {
  const { user, setUser, logout } = useContext(AuthContext); 

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Basic Form States 
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');

  // Password Update States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 🎨 Custom Themed Feedback Modal State
  const [feedback, setFeedback] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success' // 'success' | 'error'
  });

  const showFeedback = (title, message, type = 'error') => {
    setFeedback({ visible: true, title, message, type });
  };

  const closeFeedback = () => {
    setFeedback(prev => ({ ...prev, visible: false }));
  };

  // 💾 Update DB Logic
  const handleSave = async () => {
    if (!name.trim() || !weight.trim() || !height.trim() || !age.trim()) {
      showFeedback("Missing Fields", "Please fill out all required basic fields.", "error");
      return;
    }

    if (newPassword && !oldPassword) {
      showFeedback("Password Required", "Please enter your current password to set a new one.", "error");
      return;
    }

    setLoading(true);
    try {
      const userId = user._id || user.id; 
      
      const payload = {
        name,
        phone,
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseFloat(height)
      };

      if (newPassword && oldPassword) {
        payload.password = newPassword;
        payload.oldPassword = oldPassword;
      }

      const response = await api.put(`/users/${userId}`, payload);

      if (setUser) {
        setUser({ 
          ...user, 
          name: response.data.name, 
          phone, 
          age: parseInt(age), 
          weight: parseFloat(weight), 
          height: parseFloat(height) 
        });
      }

      setOldPassword('');
      setNewPassword('');
      setIsEditing(false);
      showFeedback("Success!", "Your elite profile has been successfully updated.", "success");
    } catch (error) {
      console.log("Profile Update Error:", error.response?.data || error.message);
      showFeedback("Update Failed", error.response?.data?.message || "Could not save your changes. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setAge(user?.age?.toString() || '');
    setWeight(user?.weight?.toString() || '');
    setHeight(user?.height?.toString() || '');
    setOldPassword('');
    setNewPassword('');
    setIsEditing(false);
  };

  // 🗑️ Delete Account Logic
  const executeDelete = async () => {
    if (!deletePassword.trim()) {
      showFeedback("Password Required", "You must enter your password to delete your account.", "error");
      return;
    }
    setDeleteLoading(true);
    try {
      const userId = user._id || user.id;
      await api.delete(`/users/${userId}`, { data: { password: deletePassword } }); 
      setShowDeleteModal(false);
      logout(); 
    } catch (error) {
      setShowDeleteModal(false);
      showFeedback("Deletion Failed", error.response?.data?.message || "Could not delete account.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-32 h-32 bg-green-500/10 rounded-full justify-center items-center mb-4 border-2 border-green-500/30">
              <Ionicons name="person" size={60} color="#22c55e" />
              {isEditing && (
                <View className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full border-2 border-white dark:border-black">
                  <Ionicons name="pencil" size={16} color="black" />
                </View>
              )}
            </View>
            <Text className="text-3xl font-black dark:text-white uppercase italic text-center">
              {user?.name || "Athlete"}
            </Text>
            <Text className="text-green-500 font-bold uppercase tracking-widest text-xs mt-1">
              Elite Member
            </Text>
          </View>

          {/* Form Fields */}
          <View className="space-y-4 mb-8">
            <View>
              <Text className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2 ml-2">Email Address (Non-Editable)</Text>
              <View className="bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex-row items-center opacity-70">
                <Ionicons name="mail" size={20} color="#64748b" className="mr-3" />
                <Text className="dark:text-white font-medium ml-3">{user?.email || "No Email Found"}</Text>
              </View>
            </View>

            <View>
              <Text className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2 ml-2">Full Name</Text>
              <View className={`bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl border flex-row items-center ${isEditing ? 'border-green-500' : 'border-gray-200 dark:border-gray-800'}`}>
                <Ionicons name="person-outline" size={20} color={isEditing ? "#22c55e" : "#64748b"} />
                <TextInput value={name} onChangeText={setName} editable={isEditing} className="flex-1 dark:text-white font-medium ml-3" placeholderTextColor="#64748b" />
              </View>
            </View>

            <View className="flex-row gap-x-4">
              <View className="flex-[2]">
                <Text className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2 ml-2">Phone Number</Text>
                <View className={`bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl border flex-row items-center ${isEditing ? 'border-green-500' : 'border-gray-200 dark:border-gray-800'}`}>
                  <Ionicons name="call-outline" size={20} color={isEditing ? "#22c55e" : "#64748b"} />
                  <TextInput value={phone} onChangeText={setPhone} editable={isEditing} keyboardType="phone-pad" className="flex-1 dark:text-white font-medium ml-3" placeholderTextColor="#64748b" />
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2 ml-2">Age</Text>
                <View className={`bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl border flex-row items-center ${isEditing ? 'border-green-500' : 'border-gray-200 dark:border-gray-800'}`}>
                  <TextInput value={age} onChangeText={setAge} editable={isEditing} keyboardType="numeric" className="flex-1 dark:text-white font-medium text-center" placeholderTextColor="#64748b" />
                </View>
              </View>
            </View>

            <View className="flex-row gap-x-4">
              <View className="flex-1">
                <Text className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2 ml-2">Height (CM)</Text>
                <View className={`bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl border flex-row items-center ${isEditing ? 'border-green-500' : 'border-gray-200 dark:border-gray-800'}`}>
                  <Ionicons name="resize" size={20} color={isEditing ? "#22c55e" : "#64748b"} />
                  <TextInput value={height} onChangeText={setHeight} editable={isEditing} keyboardType="numeric" className="flex-1 dark:text-white font-medium ml-3" placeholderTextColor="#64748b" />
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2 ml-2">Weight (KG)</Text>
                <View className={`bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl border flex-row items-center ${isEditing ? 'border-green-500' : 'border-gray-200 dark:border-gray-800'}`}>
                  <Ionicons name="scale" size={20} color={isEditing ? "#22c55e" : "#64748b"} />
                  <TextInput value={weight} onChangeText={setWeight} editable={isEditing} keyboardType="numeric" className="flex-1 dark:text-white font-medium ml-3" placeholderTextColor="#64748b" />
                </View>
              </View>
            </View>

            {/* Change Password Section */}
            {isEditing && (
              <View className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Text className="text-gray-900 dark:text-white font-black uppercase italic mb-4">Change Password</Text>
                
                <View className="mb-4">
                  <Text className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2 ml-2">Current Password</Text>
                  <View className="bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex-row items-center">
                    <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
                    <TextInput value={oldPassword} onChangeText={setOldPassword} secureTextEntry className="flex-1 dark:text-white font-medium ml-3" placeholder="Enter current password" placeholderTextColor="#64748b" />
                  </View>
                </View>

                <View>
                  <Text className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2 ml-2">New Password</Text>
                  <View className="bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex-row items-center">
                    <Ionicons name="key-outline" size={20} color="#64748b" />
                    <TextInput value={newPassword} onChangeText={setNewPassword} secureTextEntry className="flex-1 dark:text-white font-medium ml-3" placeholder="Enter new password" placeholderTextColor="#64748b" />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          {isEditing ? (
            <View className="flex-row gap-x-4 mb-8">
              <TouchableOpacity onPress={handleCancel} className="flex-1 bg-gray-200 dark:bg-gray-800 py-4 rounded-2xl items-center">
                <Text className="text-gray-500 dark:text-gray-400 font-black uppercase">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleSave} disabled={loading} className="flex-1 bg-green-500 py-4 rounded-2xl items-center shadow-lg shadow-green-500/40">
                {loading ? <ActivityIndicator color="black" /> : <Text className="text-black font-black uppercase">Save</Text>}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)} className="w-full bg-green-500 py-4 rounded-2xl items-center flex-row justify-center shadow-lg shadow-green-500/30 mb-8">
              <Ionicons name="pencil" size={20} color="black" className="mr-2" />
              <Text className="text-black font-black uppercase ml-2">Edit Profile</Text>
            </TouchableOpacity>
          )}

          {/* Delete Account */}
          <View className="mt-2 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Text className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4 text-center">Danger Zone</Text>
            <TouchableOpacity onPress={() => setShowDeleteModal(true)} className="bg-red-500/10 p-4 rounded-2xl flex-row justify-center items-center border border-red-500/20">
              <Ionicons name="warning" size={20} color="#ef4444" />
              <Text className="text-red-500 font-black uppercase ml-2">Delete My Account</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* 🟢/🔴 CUSTOM FEEDBACK MODAL (Replaces Alert.alert) */}
      <Modal animationType="fade" transparent={true} visible={feedback.visible} onRequestClose={closeFeedback}>
        <View className="flex-1 bg-black/60 dark:bg-black/80 justify-center items-center px-6">
          <View className="bg-white dark:bg-gray-900 w-full p-8 rounded-[30px] border border-gray-200 dark:border-gray-800 shadow-2xl items-center">
            
            <View className={`p-4 rounded-full mb-4 ${feedback.type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <Ionicons 
                name={feedback.type === 'success' ? "checkmark-circle" : "alert-circle"} 
                size={50} 
                color={feedback.type === 'success' ? "#22c55e" : "#ef4444"} 
              />
            </View>

            <Text className="text-2xl font-black dark:text-white uppercase italic text-center mb-2">
              {feedback.title}
            </Text>
            
            <Text className="text-gray-500 dark:text-gray-400 text-center mb-8 font-medium">
              {feedback.message}
            </Text>

            <TouchableOpacity 
              onPress={closeFeedback} 
              className={`w-full py-4 rounded-2xl items-center shadow-lg ${feedback.type === 'success' ? 'bg-green-500 shadow-green-500/30' : 'bg-red-500 shadow-red-500/30'}`}
            >
              <Text className={feedback.type === 'success' ? "text-black font-black uppercase" : "text-white font-black uppercase"}>
                Okay
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* 🗑️ DELETE CONFIRMATION MODAL */}
      <Modal animationType="fade" transparent={true} visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)}>
        <View className="flex-1 bg-black/60 dark:bg-black/80 justify-center items-center px-6">
          <View className="bg-white dark:bg-gray-900 w-full p-8 rounded-[30px] border border-gray-200 dark:border-gray-800 shadow-2xl items-center">
            <View className="bg-red-500/10 p-4 rounded-full mb-4">
              <Ionicons name="warning" size={40} color="#ef4444" />
            </View>
            <Text className="text-2xl font-black dark:text-white uppercase italic text-center mb-2">Are you sure?</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mb-6">This action cannot be undone. All your memberships, stats, and data will be permanently erased. Enter your password to confirm.</Text>
            <View className="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 mb-6 flex-row items-center">
              <Ionicons name="lock-closed" size={20} color="#64748b" />
              <TextInput value={deletePassword} onChangeText={setDeletePassword} secureTextEntry placeholder="Enter password" placeholderTextColor="#64748b" className="flex-1 ml-3 dark:text-white font-medium" />
            </View>
            <TouchableOpacity onPress={executeDelete} disabled={deleteLoading} className="w-full bg-red-500 py-4 rounded-2xl items-center mb-3 shadow-lg shadow-red-500/30">
              {deleteLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-black uppercase">Delete Everything</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDeleteModal(false)} className="w-full py-4 items-center">
              <Text className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}