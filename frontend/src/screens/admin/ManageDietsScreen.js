import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axios';

const Field = ({ label, value, onChange, placeholder, keyboardType, multiline }) => (
  <View className="mb-4">
    <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest ml-2 mb-2">{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#64748b"
      keyboardType={keyboardType || 'default'}
      multiline={multiline}
      className={`bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-800 ${multiline ? 'h-32 textAlignVertical-top' : ''}`}
    />
  </View>
);

export default function ManageDietsScreen({ navigation }) {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ planName: '', calories: '', description: '', details: '', imageUrl: '' });

  const fetchDiets = async () => {
    try {
      const response = await api.get('/diets');
      setDiets(response.data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load diets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiets();
  }, []);

  const handleSubmit = async () => {
    if (!form.planName.trim() || !form.calories) {
      Alert.alert('Missing Fields', 'Please add the plan name and calories.');
      return;
    }

    setIsSubmitting(true);
    try {
      const dietData = {
        planName: form.planName.trim(),
        calories: Number(form.calories),
        description: form.description.trim(),
        details: form.details.trim(),
        imageUrl: form.imageUrl.trim() || undefined,
        meals: [] // Initializing with empty meals for simplicity
      };

      if (editingId) {
        await api.put(`/diets/${editingId}`, dietData);
        Alert.alert('Diet Updated', 'The diet plan has been updated successfully.');
      } else {
        await api.post('/diets', dietData);
        Alert.alert('Diet Added', 'The diet plan is now available for members.');
      }

      setModalVisible(false);
      setForm({ planName: '', calories: '', description: '', details: '', imageUrl: '' });
      setEditingId(null);
      await fetchDiets();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || `Failed to ${editingId ? 'update' : 'add'} diet.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDiet = (diet) => {
    setForm({
      planName: diet.planName || '',
      calories: diet.calories ? String(diet.calories) : '',
      description: diet.description || '',
      details: diet.details || '',
      imageUrl: diet.imageUrl || ''
    });
    setEditingId(diet._id);
    setModalVisible(true);
  };

  const handleDeleteDiet = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this diet?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await api.delete(`/diets/${id}`);
            fetchDiets();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete diet.');
          }
        } 
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[28px] mb-4 border border-slate-200 dark:border-slate-800 shadow-sm">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-4">
          <Text className="text-slate-900 dark:text-white font-extrabold text-xl uppercase tracking-tight">{item.planName}</Text>
          <Text className="text-orange-500 font-bold uppercase text-[10px] tracking-widest mt-2">
            {item.calories} KCAL
          </Text>
          <Text className="text-slate-500 font-medium text-xs mt-2" numberOfLines={2}>
            {item.description || 'No description provided.'}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => handleEditDiet(item)} className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 mr-2">
            <Ionicons name="pencil-outline" size={20} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteDiet(item._id)} className="bg-red-500/10 p-3 rounded-2xl border border-red-500/20">
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 py-4 flex-1">
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
              <Ionicons name="arrow-back" size={28} color="#22c55e" />
            </TouchableOpacity>
            <View>
              <Text className="text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                Diet <Text className="text-green-500">Hub</Text>
              </Text>
              <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                Manage nutrition plans
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setForm({ planName: '', calories: '', description: '', details: '', imageUrl: '' });
              setEditingId(null);
              setModalVisible(true);
            }}
            className="w-12 h-12 bg-green-500 rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="add" size={28} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color="#22c55e" size="large" />
          </View>
        ) : (
          <FlatList
            data={diets}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text className="text-center text-slate-500 mt-20 font-bold uppercase tracking-widest text-xs">
                No diets added yet
              </Text>
            }
          />
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <View className="flex-1 bg-black/60 justify-end">
            <View className="bg-white dark:bg-slate-950 p-6 rounded-t-[40px] border-t border-slate-200 dark:border-slate-800">
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-row justify-between items-center mb-6 mt-2">
                  <Text className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                    {editingId ? 'Update Diet Plan' : 'Add Diet Plan'}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setModalVisible(false);
                    setForm({ planName: '', calories: '', description: '', details: '', imageUrl: '' });
                    setEditingId(null);
                  }} className="bg-slate-100 dark:bg-slate-900 p-2 rounded-full">
                    <Ionicons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <Field
                  label="Plan Name"
                  value={form.planName}
                  onChange={(text) => setForm({ ...form, planName: text })}
                  placeholder="e.g. Muscle Gain"
                />
                <Field
                  label="Calories"
                  value={form.calories}
                  onChange={(text) => setForm({ ...form, calories: text })}
                  placeholder="e.g. 2500"
                  keyboardType="numeric"
                />
                <Field
                  label="Summary Description"
                  value={form.description}
                  onChange={(text) => setForm({ ...form, description: text })}
                  placeholder="Short overview"
                />
                <Field
                  label="Full Details (Shown to user)"
                  value={form.details}
                  onChange={(text) => setForm({ ...form, details: text })}
                  placeholder="Explain the diet in detail..."
                  multiline
                />
                <Field
                  label="Image URL"
                  value={form.imageUrl}
                  onChange={(text) => setForm({ ...form, imageUrl: text })}
                  placeholder="https://images.com/diet.jpg"
                />

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-green-500 py-5 rounded-2xl items-center shadow-lg mt-2 mb-8"
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#0f172a" />
                  ) : (
                    <Text className="text-slate-900 font-extrabold uppercase text-lg tracking-wide">
                      {editingId ? 'Update Diet Plan' : 'Save Diet Plan'}
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
