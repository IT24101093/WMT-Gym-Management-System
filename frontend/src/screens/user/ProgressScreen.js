import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axios';

export default function ProgressScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ weight: '', workoutDone: '', date: '', notes: '' });

  const fetchData = async () => {
    try { const res = await api.get('/progress'); setEntries(res.data); }
    catch (e) { console.error(e.message); }
    finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const todayISO = () => new Date().toISOString().slice(0, 10);

  const handleAddNew = () => {
    setForm({ weight: '', workoutDone: '', date: todayISO(), notes: '' });
    setEditingId(null);
    setModalVisible(true);
  };

  const handleEdit = (e) => {
    setForm({
      weight: String(e.weight),
      workoutDone: e.workoutDone || '',
      date: new Date(e.date).toISOString().slice(0, 10),
      notes: e.notes || '',
    });
    setEditingId(e._id);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.weight || Number(form.weight) <= 0) return alert('Weight must be a positive number');
    if (!form.date) return alert('Date is required');
    setIsSubmitting(true);
    try {
      const payload = { ...form, weight: Number(form.weight) };
      if (editingId) await api.put(`/progress/${editingId}`, payload);
      else await api.post('/progress', payload);
      setModalVisible(false);
      fetchData();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save');
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete entry?', '', [
      { text: 'Keep', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          try { await api.delete(`/progress/${id}`); fetchData(); }
          catch (e) { alert(e.response?.data?.message || 'Failed'); }
      }},
    ]);
  };

  // Quick stats
  const latest = entries[0];
  const oldest = entries[entries.length - 1];
  const delta = latest && oldest ? (latest.weight - oldest.weight).toFixed(1) : null;

  const renderItem = ({ item }) => (
    <View className="bg-slate-50 dark:bg-slate-900 p-5 rounded-[28px] mb-3 border border-slate-200 dark:border-slate-800 flex-row justify-between items-center">
      <View className="flex-1">
        <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{new Date(item.date).toDateString()}</Text>
        <Text className="text-slate-900 dark:text-white font-extrabold text-2xl mt-1">{item.weight} kg</Text>
        {item.workoutDone ? <Text className="text-slate-700 dark:text-slate-300 font-bold mt-1">{item.workoutDone}</Text> : null}
        {item.notes ? <Text className="text-slate-500 font-medium text-sm mt-1">{item.notes}</Text> : null}
      </View>
      <View className="flex-col gap-y-2">
        <TouchableOpacity onPress={() => handleEdit(item)} className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl items-center justify-center">
          <Ionicons name="pencil" size={16} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)} className="w-10 h-10 bg-red-500/10 rounded-xl items-center justify-center border border-red-500/20">
          <Ionicons name="trash" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 py-4 flex-1">
        <View className="mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
            <Ionicons name="arrow-back" size={28} color="#22c55e" />
          </TouchableOpacity>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                My <Text className="text-green-500">Progress</Text>
              </Text>
              <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Track every session</Text>
            </View>
            <TouchableOpacity onPress={handleAddNew} className="w-12 h-12 bg-green-500 rounded-full items-center justify-center shadow-sm">
              <Ionicons name="add" size={28} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>

        {latest && (
          <View className="bg-green-500/10 border border-green-500/20 p-5 rounded-[28px] mb-5 flex-row justify-between items-center">
            <View>
              <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Latest</Text>
              <Text className="text-slate-900 dark:text-white font-extrabold text-3xl mt-1">{latest.weight} kg</Text>
            </View>
            {delta !== null && (
              <View className="items-end">
                <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Change</Text>
                <Text className={`font-extrabold text-2xl mt-1 ${Number(delta) >= 0 ? 'text-green-500' : 'text-blue-500'}`}>
                  {Number(delta) > 0 ? '+' : ''}{delta} kg
                </Text>
              </View>
            )}
          </View>
        )}

        {loading ? <View className="flex-1 justify-center items-center"><ActivityIndicator color="#22c55e" size="large" /></View>
          : <FlatList data={entries} renderItem={renderItem} keyExtractor={i => i._id} showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#22c55e" />}
              ListEmptyComponent={<Text className="text-center text-slate-500 mt-20 font-bold uppercase tracking-widest text-xs">No entries yet — log your first!</Text>} />}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <View className="flex-1 bg-black/60 justify-end">
            <View className="bg-white dark:bg-slate-950 p-6 rounded-t-[40px] border-t border-slate-200 dark:border-slate-800">
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                <View className="flex-row justify-between items-center mb-6 mt-2">
                  <Text className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                    {editingId ? 'Edit Entry' : 'Log Progress'}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-slate-100 dark:bg-slate-900 p-2 rounded-full">
                    <Ionicons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <Field label="Weight (kg)" value={form.weight} onChange={t => setForm({ ...form, weight: t })} placeholder="e.g., 72.5" keyboardType="numeric" />
                <Field label="Workout Done" value={form.workoutDone} onChange={t => setForm({ ...form, workoutDone: t })} placeholder="e.g., Push day" />
                <Field label="Date" value={form.date} onChange={t => setForm({ ...form, date: t })} placeholder="YYYY-MM-DD" />
                <Field label="Notes (optional)" value={form.notes} onChange={t => setForm({ ...form, notes: t })} placeholder="Anything to remember" multiline />

                <TouchableOpacity onPress={handleSave} disabled={isSubmitting} className="w-full bg-green-500 py-5 rounded-2xl items-center shadow-lg mt-2 mb-8">
                  {isSubmitting ? <ActivityIndicator color="#0f172a" /> :
                    <Text className="text-slate-900 font-extrabold uppercase text-lg tracking-wide">{editingId ? 'Update Entry' : 'Save Entry'}</Text>}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const Field = ({ label, value, onChange, placeholder, keyboardType, multiline }) => (
  <View className="mb-4">
    <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest ml-2 mb-2">{label}</Text>
    <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#64748b"
      keyboardType={keyboardType} multiline={multiline}
      className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-800" />
  </View>
);