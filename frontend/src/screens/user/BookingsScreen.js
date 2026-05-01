import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axios';

const STATUS_STYLES = {
  Pending:   { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-600' },
  Confirmed: { bg: 'bg-green-500/10 border-green-500/20',   text: 'text-green-600' },
  Cancelled: { bg: 'bg-red-500/10 border-red-500/20',       text: 'text-red-600' },
  Completed: { bg: 'bg-blue-500/10 border-blue-500/20',     text: 'text-blue-600' },
};

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try { const res = await api.get('/bookings'); setBookings(res.data); }
    catch (e) { console.error(e.message); }
    finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const cancel = (id) => {
    Alert.alert('Cancel booking?', 'This cannot be undone.', [
      { text: 'Keep', style: 'cancel' },
      { text: 'Cancel booking', style: 'destructive', onPress: async () => {
          try { await api.delete(`/bookings/${id}`); fetchData(); }
          catch (e) { alert(e.response?.data?.message || 'Failed'); }
      }},
    ]);
  };

  const renderItem = ({ item }) => {
    const s = STATUS_STYLES[item.status] || STATUS_STYLES.Pending;
    return (
      <View className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[28px] mb-4 border border-slate-200 dark:border-slate-800">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 pr-3">
            <Text className="text-slate-900 dark:text-white font-extrabold text-lg uppercase tracking-tight">{item.className}</Text>
            <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
              {new Date(item.date).toLocaleString()}
            </Text>
            <Text className="text-slate-700 dark:text-slate-300 font-bold mt-2">Trainer: {item.trainer?.name || '—'}</Text>
            {item.notes ? <Text className="text-slate-500 font-medium text-sm mt-1">{item.notes}</Text> : null}
          </View>
          <View className={`px-3 py-1.5 rounded-xl border ${s.bg}`}>
            <Text className={`font-extrabold uppercase text-[10px] ${s.text}`}>{item.status}</Text>
          </View>
        </View>
        {item.status !== 'Completed' && (
          <TouchableOpacity onPress={() => cancel(item._id)} className="self-start mt-2 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl flex-row items-center gap-x-1">
            <Ionicons name="close-circle" size={14} color="#ef4444" />
            <Text className="text-red-600 font-extrabold uppercase text-[10px] tracking-wide">Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 py-4 flex-1">
        <View className="mb-6">
          <Text className="text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            My <Text className="text-green-500">Bookings</Text>
          </Text>
          <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Upcoming sessions</Text>
        </View>
        {loading ? <View className="flex-1 justify-center items-center"><ActivityIndicator color="#22c55e" size="large" /></View>
          : <FlatList data={bookings} renderItem={renderItem} keyExtractor={i => i._id} showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#22c55e" />}
              ListEmptyComponent={<Text className="text-center text-slate-500 mt-20 font-bold uppercase tracking-widest text-xs">No bookings — book a trainer!</Text>} />}
      </View>
    </SafeAreaView>
  );
}