import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axios';

// 🎨 1. Premium Status Alert (For Success & Errors)
const StatusAlert = ({ visible, title, message, type, onClose }) => (
  <Modal transparent visible={visible} animationType="fade">
    <Pressable className="flex-1 bg-black/70 justify-center px-6" onPress={onClose}>
      <View className="bg-white dark:bg-slate-900 w-full p-8 rounded-[32px] items-center border border-slate-200 dark:border-slate-800 shadow-2xl">
        <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${type === 'error' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
          <Ionicons name={type === 'error' ? 'alert-circle' : 'checkmark-circle'} size={36} color={type === 'error' ? '#ef4444' : '#22c55e'} />
        </View>
        <Text className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 uppercase text-center tracking-tight">{title}</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-center mb-8 font-bold">{message}</Text>
        <TouchableOpacity onPress={onClose} className={`w-full py-4 rounded-2xl items-center ${type === 'error' ? 'bg-slate-900 dark:bg-slate-100' : 'bg-slate-900 dark:bg-green-500'}`}>
          <Text className={`font-extrabold uppercase ${type === 'error' ? 'text-white dark:text-slate-900' : 'text-white dark:text-slate-900'}`}>Continue</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);

// 🗑️ 2. Premium Confirmation Alert (For Deleting)
const ConfirmAlert = ({ visible, userName, onCancel, onConfirm, isDeleting }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View className="flex-1 bg-black/70 justify-center px-6">
      <View className="bg-white dark:bg-slate-900 w-full p-8 rounded-[32px] items-center border border-slate-200 dark:border-slate-800 shadow-2xl">
        <View className="w-16 h-16 rounded-full items-center justify-center mb-4 bg-red-500/10">
          <Ionicons name="warning" size={36} color="#ef4444" />
        </View>
        <Text className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 uppercase text-center tracking-tight">Remove Member?</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-center mb-8 font-bold">
          Are you sure you want to permanently delete <Text className="text-slate-900 dark:text-white font-extrabold">{userName}</Text> from the system?
        </Text>
        
        <View className="flex-row justify-between w-full gap-x-3">
          <TouchableOpacity onPress={onCancel} disabled={isDeleting} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl items-center">
            <Text className="font-extrabold text-slate-500 dark:text-slate-400 uppercase">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm} disabled={isDeleting} className="flex-1 bg-red-500 py-4 rounded-2xl items-center justify-center flex-row">
            {isDeleting ? <ActivityIndicator size="small" color="#ffffff" /> : <Text className="font-extrabold text-white uppercase tracking-wide">Remove</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default function ManageUsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal States
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ visible: false, userId: null, userName: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      setAlert({ visible: true, title: 'Network Error', message: 'Could not load the members list.', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  // Triggered when trash can is pressed
  const openConfirmModal = (userId, userName) => {
    setConfirmModal({ visible: true, userId, userName });
  };

  // Triggered when "Remove" is clicked in the modal
  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/users/${confirmModal.userId}`);
      
      // Remove from list
      setUsers(users.filter(user => user._id !== confirmModal.userId));
      
      // Close confirm modal and open success modal
      setConfirmModal({ visible: false, userId: null, userName: '' });
      setTimeout(() => {
        setAlert({ visible: true, title: 'Member Removed', message: `${confirmModal.userName} has been successfully deleted from the database.`, type: 'success' });
      }, 500); // Small delay for smooth animation transition
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setConfirmModal({ visible: false, userId: null, userName: '' });
      setTimeout(() => {
        setAlert({ visible: true, title: 'Deletion Failed', message: errorMsg, type: 'error' });
      }, 500);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderUser = ({ item }) => (
    <View className="bg-slate-50 dark:bg-slate-900 p-5 rounded-[28px] mb-4 border border-slate-200 dark:border-slate-800 flex-row justify-between items-center shadow-sm">
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            {item.name}
          </Text>
          {item.role === 'admin' && (
            <View className="bg-green-500/10 px-2 py-0.5 rounded-md ml-2 border border-green-500/20">
              <Text className="text-green-600 dark:text-green-500 font-extrabold text-[8px] uppercase tracking-widest">Admin</Text>
            </View>
          )}
        </View>
        <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs">{item.email}</Text>
        <Text className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">
          NIC: {item.nic}  •  Phone: {item.phone}
        </Text>
      </View>

      {item.role !== 'admin' && (
        <TouchableOpacity 
          onPress={() => openConfirmModal(item._id, item.name)}
          className="w-12 h-12 bg-red-500/10 rounded-2xl items-center justify-center border border-red-500/20 ml-2"
        >
          <Ionicons name="trash" size={20} color="#ef4444" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* 🔮 MODALS */}
      <StatusAlert {...alert} onClose={() => setAlert({ ...alert, visible: false })} />
      <ConfirmAlert 
        {...confirmModal} 
        isDeleting={isDeleting}
        onCancel={() => setConfirmModal({ visible: false, userId: null, userName: '' })}
        onConfirm={executeDelete}
      />

      {/* 🚀 HEADER */}
      <View className="px-6 py-4 flex-row items-center border-b border-slate-100 dark:border-slate-900 mb-2">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 bg-slate-50 dark:bg-slate-900 p-2 rounded-full">
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
          Manage <Text className="text-blue-500">Members</Text>
        </Text>
      </View>

      {/* 📜 LIST */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
          ListEmptyComponent={
            <View className="items-center mt-20 bg-slate-50 dark:bg-slate-900 p-8 rounded-[32px] mx-4 border border-slate-200 dark:border-slate-800">
              <View className="bg-slate-200 dark:bg-black p-4 rounded-full mb-4">
                <Ionicons name="people" size={48} color="#64748b" />
              </View>
              <Text className="text-slate-900 dark:text-white text-lg font-extrabold uppercase tracking-tight">No Members Found</Text>
              <Text className="text-slate-500 font-bold mt-2 text-center text-xs">When users register for your gym, they will appear here.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}