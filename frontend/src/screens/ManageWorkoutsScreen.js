import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axios';

const emptyForm = {
  title: '',
  duration: '',
  caloriesBurned: '',
  description: '',
  details: '',
  imageUrl: '',
  difficulty: 'Beginner'
};

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

export default function ManageWorkoutsScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchWorkouts = async () => {
    try {
      const response = await api.get('/workouts');
      setWorkouts(response.data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load workouts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingWorkout(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setEditingWorkout(item);
    setForm({
      title: item.title || '',
      duration: String(item.duration || ''),
      caloriesBurned: String(item.caloriesBurned || ''),
      description: item.description || '',
      details: item.details || '',
      imageUrl: item.imageUrl || '',
      difficulty: item.difficulty || 'Beginner'
    });
    setModalVisible(true);
  };

  const handleCreateWorkout = async () => {
    if (!form.title.trim() || !form.duration || !form.caloriesBurned) {
      Alert.alert('Missing Fields', 'Please add the title, duration and calories burned.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/workouts', {
        title: form.title.trim(),
        duration: Number(form.duration),
        caloriesBurned: Number(form.caloriesBurned),
        difficulty: form.difficulty,
        description: form.description.trim(),
        details: form.details.trim(),
        imageUrl: form.imageUrl.trim() || undefined
      });

      setModalVisible(false);
      resetForm();
      await fetchWorkouts();
      Alert.alert('Workout Added', 'The workout is now available for members.');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add workout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateWorkout = async () => {
    if (!editingWorkout) return;

    if (!form.title.trim() || !form.duration || !form.caloriesBurned) {
      Alert.alert('Missing Fields', 'Please add the title, duration and calories burned.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/workouts/${editingWorkout._id}`, {
        title: form.title.trim(),
        duration: Number(form.duration),
        caloriesBurned: Number(form.caloriesBurned),
        difficulty: form.difficulty,
        description: form.description.trim(),
        details: form.details.trim(),
        imageUrl: form.imageUrl.trim() || undefined
      });

      setModalVisible(false);
      resetForm();
      await fetchWorkouts();
      Alert.alert('Workout Updated', 'Workout updated successfully.');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update workout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWorkout = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this workout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/workouts/${id}`);
            fetchWorkouts();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete workout.');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[28px] mb-4 border border-slate-200 dark:border-slate-800 shadow-sm">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-4">
          <Text className="text-slate-900 dark:text-white font-extrabold text-xl uppercase tracking-tight">{item.title}</Text>
          <View className="flex-row items-center mt-2 gap-x-3">
            <Text className="text-green-600 dark:text-green-400 font-bold uppercase text-[10px] tracking-widest">
              {item.duration} MIN
            </Text>
            <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">•</Text>
            <Text className="text-pink-500 font-bold uppercase text-[10px] tracking-widest">
              {item.difficulty}
            </Text>
          </View>
          <Text className="text-slate-500 font-medium text-xs mt-2" numberOfLines={2}>
            {item.description || 'No description provided.'}
          </Text>
        </View>

        <View className="flex-row">
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 mr-2"
          >
            <Ionicons name="create-outline" size={20} color="#3b82f6" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteWorkout(item._id)}
            className="bg-red-500/10 p-3 rounded-2xl border border-red-500/20"
          >
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
                Workout <Text className="text-green-500">DB</Text>
              </Text>
              <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                Manage exercise routines
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={openAddModal}
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
            data={workouts}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text className="text-center text-slate-500 mt-20 font-bold uppercase tracking-widest text-xs">
                No workouts added yet
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
                    {editingWorkout ? 'Edit Workout' : 'Add Workout'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      resetForm();
                    }}
                    className="bg-slate-100 dark:bg-slate-900 p-2 rounded-full"
                  >
                    <Ionicons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <Field
                  label="Workout Title"
                  value={form.title}
                  onChange={(text) => setForm({ ...form, title: text })}
                  placeholder="e.g. Full Body HIIT"
                />

                <View className="flex-row gap-x-4">
                  <View className="flex-1">
                    <Field
                      label="Duration (Min)"
                      value={form.duration}
                      onChange={(text) => setForm({ ...form, duration: text })}
                      placeholder="45"
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Field
                      label="Calories"
                      value={form.caloriesBurned}
                      onChange={(text) => setForm({ ...form, caloriesBurned: text })}
                      placeholder="300"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <Field
                  label="Difficulty"
                  value={form.difficulty}
                  onChange={(text) => setForm({ ...form, difficulty: text })}
                  placeholder="Beginner / Intermediate / Advanced"
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
                  placeholder="Step by step instructions..."
                  multiline
                />

                <Field
                  label="Image URL"
                  value={form.imageUrl}
                  onChange={(text) => setForm({ ...form, imageUrl: text })}
                  placeholder="https://images.com/workout.jpg"
                />

                <TouchableOpacity
                  onPress={editingWorkout ? handleUpdateWorkout : handleCreateWorkout}
                  disabled={isSubmitting}
                  className="w-full bg-green-500 py-5 rounded-2xl items-center shadow-lg mt-2 mb-8"
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#0f172a" />
                  ) : (
                    <Text className="text-slate-900 font-extrabold uppercase text-lg tracking-wide">
                      {editingWorkout ? 'Update Workout' : 'Save Workout'}
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