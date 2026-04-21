import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axios';

export default function ManagePlansScreen() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ planName: '', price: '', duration: '' });

  const fetchPlans = async () => {
    try {
      const response = await api.get('/memberships');
      setPlans(response.data);
    } catch (error) {
      console.error("Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  // 📝 Open Modal for New Plan
  const handleAddNew = () => {
    setForm({ planName: '', price: '', duration: '' });
    setEditingId(null);
    setModalVisible(true);
  };

  // 📝 Open Modal for Editing
  const handleEdit = (plan) => {
    setForm({ 
      planName: plan.planName, 
      price: plan.price.toString(), 
      duration: plan.duration 
    });
    setEditingId(plan._id);
    setModalVisible(true);
  };

  // 💾 Save (Create or Update)
  const handleSave = async () => {
    if (!form.planName || !form.price || !form.duration) return alert("Please fill all fields");
    
    setIsSubmitting(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      
      if (editingId) {
        // Update existing plan
        await api.put(`/memberships/${editingId}`, payload);
      } else {
        // Create new plan
        await api.post('/memberships', payload);
      }
      
      setModalVisible(false);
      fetchPlans();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🗑️ Delete Plan
  const handleDelete = async (id) => {
    // Note: In a real app, you'd want a confirmation dialog here!
    try {
      await api.delete(`/memberships/${id}`);
      fetchPlans();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete plan");
    }
  };

  const renderItem = ({ item }) => (
    <View className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[28px] mb-4 border border-slate-200 dark:border-slate-800 shadow-sm flex-row justify-between items-center">
      <View className="flex-1">
        <Text className="text-slate-900 dark:text-white font-extrabold text-xl uppercase tracking-tight mb-1">
          {item.planName}
        </Text>
        <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
          {item.duration} Access
        </Text>
        <View className="bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20 self-start mt-3">
          <Text className="text-green-600 dark:text-green-500 font-extrabold text-sm uppercase tracking-wide">
            Rs. {item.price}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-col gap-y-3">
        <TouchableOpacity 
          onPress={() => handleEdit(item)}
          className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl items-center justify-center border border-slate-300 dark:border-slate-700"
        >
          <Ionicons name="pencil" size={20} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleDelete(item._id)}
          className="w-12 h-12 bg-red-500/10 rounded-2xl items-center justify-center border border-red-500/20"
        >
          <Ionicons name="trash" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 py-4 flex-1">
        {/* HEADER */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
              Manage <Text className="text-green-500">Plans</Text>
            </Text>
            <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Configure Membership Tiers</Text>
          </View>
          <TouchableOpacity 
            onPress={handleAddNew}
            className="w-12 h-12 bg-green-500 rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="add" size={28} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* LIST */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color="#22c55e" size="large" />
          </View>
        ) : (
          <FlatList 
            data={plans}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* 📝 CREATE / EDIT MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          className="flex-1"
        >
          <View className="flex-1 bg-black/60 justify-end">
            <View className="bg-white dark:bg-slate-950 p-6 rounded-t-[40px] border-t border-slate-200 dark:border-slate-800">
              
              <View className="flex-row justify-between items-center mb-6 mt-2">
                <Text className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                  {editingId ? "Edit Plan" : "New Plan"}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-slate-100 dark:bg-slate-900 p-2 rounded-full">
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* INPUTS */}
              <View className="mb-4">
                <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest ml-2 mb-2">Plan Name (e.g., Pro, Elite)</Text>
                <TextInput 
                  value={form.planName}
                  onChangeText={(text) => setForm({...form, planName: text})}
                  className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-800"
                  placeholderTextColor="#64748b"
                  placeholder="Enter plan name"
                />
              </View>

              <View className="mb-4">
                <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest ml-2 mb-2">Price (LKR)</Text>
                <TextInput 
                  value={form.price}
                  onChangeText={(text) => setForm({...form, price: text})}
                  keyboardType="numeric"
                  className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-800"
                  placeholderTextColor="#64748b"
                  placeholder="Enter price"
                />
              </View>

              <View className="mb-8">
                <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest ml-2 mb-2">Duration (e.g., 1 Month)</Text>
                <TextInput 
                  value={form.duration}
                  onChangeText={(text) => setForm({...form, duration: text})}
                  className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-800"
                  placeholderTextColor="#64748b"
                  placeholder="Enter duration"
                />
              </View>

              {/* SAVE BUTTON */}
              <TouchableOpacity 
                onPress={handleSave}
                disabled={isSubmitting}
                className="w-full bg-green-500 py-5 rounded-2xl items-center shadow-lg mb-8"
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#0f172a" />
                ) : (
                  <Text className="text-slate-900 font-extrabold uppercase text-lg tracking-wide">
                    {editingId ? "Update Plan" : "Create Plan"}
                  </Text>
                )}
              </TouchableOpacity>

            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}