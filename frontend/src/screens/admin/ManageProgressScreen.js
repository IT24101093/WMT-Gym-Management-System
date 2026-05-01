import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axios';

export default function ManageProgressScreen({ navigation }) {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllProgress = async () => {
    try {
      const response = await api.get('/progress/all');
      setProgressData(response.data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllProgress();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllProgress();
  };

  const renderItem = ({ item }) => (
    <View className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[28px] mb-4 border border-slate-200 dark:border-slate-800 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-blue-500/10 rounded-full items-center justify-center mr-3">
            <Ionicons name="person" size={20} color="#3b82f6" />
          </View>
          <View>
            <Text className="text-slate-900 dark:text-white font-extrabold text-base uppercase tracking-tight">
              {item.user?.name || 'Unknown Member'}
            </Text>
            <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              {item.user?.email || 'No email'}
            </Text>
          </View>
        </View>
        <View className="bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
          <Text className="text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase">
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        <View>
          <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Weight</Text>
          <Text className="text-slate-900 dark:text-white font-black text-xl">{item.weight} <Text className="text-sm font-bold text-slate-500">KG</Text></Text>
        </View>
        <View className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700" />
        <View>
          <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Status</Text>
          <View className="flex-row items-center">
             <Ionicons name={item.workoutDone ? "checkmark-circle" : "close-circle"} size={16} color={item.workoutDone ? "#22c55e" : "#ef4444"} />
             <Text className={`ml-1 font-extrabold text-[10px] uppercase ${item.workoutDone ? 'text-green-500' : 'text-red-500'}`}>
                {item.workoutDone ? 'Workout OK' : 'No Workout'}
             </Text>
          </View>
        </View>
      </View>

      {item.notes ? (
        <View className="mt-4 p-3 bg-slate-100 dark:bg-slate-800/30 rounded-xl border-l-4 border-blue-500">
           <Text className="text-slate-600 dark:text-slate-400 text-xs italic">"{item.notes}"</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 py-4 flex-1">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Ionicons name="arrow-back" size={28} color="#22c55e" />
          </TouchableOpacity>
          <View>
            <Text className="text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
              Member <Text className="text-green-500">Progress</Text>
            </Text>
            <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
              Global metrics & tracking
            </Text>
          </View>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color="#22c55e" size="large" />
          </View>
        ) : (
          <FlatList
            data={progressData}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22c55e" />
            }
            ListEmptyComponent={
              <Text className="text-center text-slate-500 mt-20 font-bold uppercase tracking-widest text-xs">
                No progress entries found
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
