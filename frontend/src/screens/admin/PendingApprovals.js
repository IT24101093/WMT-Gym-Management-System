import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axios';

// 🎨 Custom Alert component matched to the new Slate Theme
const StatusAlert = ({ visible, title, message, type, onClose }) => (
  <Modal transparent visible={visible} animationType="fade">
    <Pressable className="flex-1 bg-black/70 justify-center px-6" onPress={onClose}>
      <View className="bg-white dark:bg-slate-900 w-full p-8 rounded-[32px] items-center border border-slate-200 dark:border-slate-800 shadow-2xl">
        <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${type === 'error' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
          <Ionicons name={type === 'error' ? 'alert-circle' : 'checkmark-circle'} size={36} color={type === 'error' ? '#ef4444' : '#22c55e'} />
        </View>
        <Text className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 uppercase text-center tracking-tight">{title}</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-center mb-8 font-bold">{message}</Text>
        <TouchableOpacity onPress={onClose} className="w-full py-4 rounded-2xl items-center bg-slate-900 dark:bg-green-500">
          <Text className="font-extrabold uppercase text-white dark:text-slate-900">Continue</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);

export default function PendingApprovals() {
  const [pendings, setPendings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Alert State
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'success' });

  const fetchPendings = async () => {
    try {
      const response = await api.get('/enrollments');
      // Ensure we only show 'Pending' status
      const filtered = response.data.filter(e => e.status === 'Pending');
      setPendings(filtered);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPendings(); }, []);

  // ✅ APPROVE: Updates status to Active
  const handleApprove = async (id) => {
    setUpdatingId(id);
    try {
      await api.put(`/enrollments/${id}`, { status: 'Active' });
      
      setAlert({
        visible: true,
        title: 'Approved!',
        message: 'Member enrollment has been activated successfully.',
        type: 'success'
      });
      fetchPendings();
    } catch (error) {
      setAlert({
        visible: true,
        title: 'Update Failed',
        message: error.response?.data?.message || 'Could not approve this enrollment.',
        type: 'error'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // 🗑️ REJECT: Deletes the enrollment entirely from the DB
  const handleReject = async (id) => {
    setUpdatingId(id);
    try {
      await api.delete(`/enrollments/${id}`);
      
      setAlert({
        visible: true,
        title: 'Request Rejected',
        message: 'The enrollment request was rejected and permanently removed.',
        type: 'success'
      });
      fetchPendings();
    } catch (error) {
      setAlert({
        visible: true,
        title: 'Action Failed',
        message: error.response?.data?.message || 'Could not delete this enrollment.',
        type: 'error'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const renderItem = ({ item }) => (
    <View className="bg-slate-50 dark:bg-slate-900 p-5 rounded-[32px] mb-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-slate-900 dark:text-white font-extrabold text-xl uppercase tracking-tight">{item.user?.name || 'Unknown'}</Text>
          <Text className="text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest mt-1">{item.membership?.planName}</Text>
        </View>
        <View className="bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
          <Text className="text-yellow-600 dark:text-yellow-500 font-extrabold text-[10px] uppercase tracking-widest">Reviewing</Text>
        </View>
      </View>

      {/* 🖼️ Premium Receipt Display */}
      {item.receiptUrl ? (
        <View className="relative">
          <Image source={{ uri: item.receiptUrl }} className="w-full h-56 rounded-3xl mb-5 bg-slate-200 dark:bg-black" resizeMode="cover" />
          <View className="absolute bottom-6 right-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10">
            <Text className="text-white text-[10px] font-bold tracking-widest uppercase">Tap to Zoom</Text>
          </View>
        </View>
      ) : (
        <View className="h-32 bg-slate-100 dark:bg-black rounded-3xl items-center justify-center mb-5 border border-dashed border-slate-300 dark:border-slate-800">
          <Ionicons name="image-outline" size={32} color="#64748b" />
          <Text className="text-slate-500 font-bold uppercase text-[10px] mt-2 tracking-widest">No Receipt Found</Text>
        </View>
      )}

      {/* ⚡ Approval Actions */}
      <View className="flex-row justify-between gap-x-3">
        <TouchableOpacity 
          onPress={() => handleReject(item._id)}
          disabled={updatingId === item._id}
          className="flex-1 bg-red-500/10 py-4 rounded-2xl border border-red-500/20 items-center justify-center"
        >
          {updatingId === item._id ? <ActivityIndicator size="small" color="#ef4444" /> : <Text className="text-red-600 dark:text-red-500 font-extrabold uppercase tracking-wide">Reject</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => handleApprove(item._id)}
          disabled={updatingId === item._id}
          className="flex-2 bg-green-500 py-4 px-10 rounded-2xl items-center justify-center shadow-sm"
        >
          {updatingId === item._id ? <ActivityIndicator size="small" color="#0f172a" /> : <Text className="text-slate-900 font-extrabold uppercase tracking-wide">Approve</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <StatusAlert 
        {...alert} 
        onClose={() => setAlert({ ...alert, visible: false })} 
      />

      <View className="px-6 py-4 flex-1">
        <Text className="text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight mb-2">
          Pending <Text className="text-green-500">Approvals</Text>
        </Text>
        <Text className="text-slate-500 font-bold mb-6">Review payments to activate memberships.</Text>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color="#22c55e" size="large" />
            <Text className="text-slate-500 mt-4 font-bold uppercase tracking-widest text-[10px]">Accessing Database...</Text>
          </View>
        ) : (
          <FlatList 
            data={pendings}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center mt-20">
                <View className="bg-green-500/10 p-6 rounded-full mb-4">
                  <Ionicons name="checkmark-done" size={64} color="#22c55e" />
                </View>
                <Text className="text-slate-900 dark:text-white text-center font-extrabold uppercase text-xl mt-2 tracking-tight">All Caught Up!</Text>
                <Text className="text-slate-500 text-center mt-2 font-bold">There are no memberships waiting for review.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}