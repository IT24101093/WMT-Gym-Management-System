import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axios';

export default function WorkoutsScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleBack = () => {
    if (!navigation) {
      return;
    }

    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('MainTabs', { screen: 'Dashboard' });
  };

  const fetchWorkouts = async () => {
    try {
      const response = await api.get('/workouts');
      setWorkouts(response.data);

      // Fetch current selection
      const userRes = await api.get('/users/profile');
      if (userRes.data.currentWorkoutPlan) {
        setSelectedWorkoutId(userRes.data.currentWorkoutPlan._id || userRes.data.currentWorkoutPlan);
      } else {
        setSelectedWorkoutId(null);
      }
    } catch (error) {
      console.error('Failed to load workouts', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSelect = async (workout) => {
    setIsSelecting(true);
    try {
      await api.put('/users/profile/selections', { currentWorkoutPlan: workout._id });
      await fetchWorkouts();
      Alert.alert("Workout Selection", `Status updated: You are now tracking ${workout.title}.`);
    } catch (e) {
      Alert.alert("Error", "Failed to update selection");
    } finally {
      setIsSelecting(false);
    }
  };

  const handleRemove = async () => {
    setIsSelecting(true);
    try {
      await api.put('/users/profile/selections', { currentWorkoutPlan: null });
      await fetchWorkouts();
      Alert.alert("Routine Removed", "Your active workout routine has been cleared.");
    } catch (e) {
      Alert.alert("Error", "Failed to remove routine");
    } finally {
      setIsSelecting(false);
    }
  };

  const selectedWorkout = workouts.find((workout) => workout._id === selectedWorkoutId) || null;

  const renderItem = ({ item }) => (
    <View className="bg-slate-50 dark:bg-slate-900 rounded-[32px] mb-6 border border-slate-200 dark:border-slate-800 overflow-hidden">
      <Image
        source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1517836357463-d25dfeac00ad?w=800' }}
        className="w-full h-40"
      />
      <View className="p-6">
        <Text className="text-slate-900 dark:text-white font-extrabold text-2xl uppercase tracking-tight mb-1">
          {item.title}
        </Text>
        {item.description ? (
          <Text className="text-slate-500 font-medium mb-1">
            {item.description}
          </Text>
        ) : null}
        {item.details ? (
          <View className="mb-4 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
            <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{item.details}</Text>
          </View>
        ) : null}
        <View className="flex-row gap-x-2 mb-4">
          <View className="bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20 flex-row items-center gap-x-1">
            <Ionicons name="time" size={12} color="#22c55e" />
            <Text className="text-green-600 font-extrabold text-[10px] uppercase tracking-wide">
              {item.duration} min
            </Text>
          </View>
          <View className="bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
            <Text className="text-blue-600 font-extrabold text-[10px] uppercase tracking-wide">
              {item.difficulty}
            </Text>
          </View>
          <View className="bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20">
            <Text className="text-orange-600 font-extrabold text-[10px] uppercase tracking-wide">
              {item.caloriesBurned} kcal
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleSelect(item)}
          disabled={selectedWorkoutId === item._id || isSelecting}
          className={`py-4 rounded-2xl items-center flex-row justify-center ${selectedWorkoutId === item._id ? 'bg-slate-200 dark:bg-slate-800' : 'bg-green-500 shadow-lg shadow-green-500/30'}`}
        >
          {selectedWorkoutId === item._id && <Ionicons name="checkmark-circle" size={18} color="#64748b" style={{ marginRight: 8 }} />}
          <Text className={`font-black uppercase tracking-widest ${selectedWorkoutId === item._id ? 'text-slate-500' : 'text-white'}`}>
            {selectedWorkoutId === item._id ? 'Current Routine' : 'Start Workout'}
          </Text>
        </TouchableOpacity>

        {selectedWorkoutId === item._id && (
          <TouchableOpacity
            onPress={handleRemove}
            disabled={isSelecting}
            className="mt-3 py-3 rounded-2xl items-center border border-red-500/30"
          >
            <Text className="text-red-500 font-extrabold uppercase text-xs tracking-widest">Remove Routine</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 py-4 flex-1">
        <View className="mb-6">
          <TouchableOpacity onPress={handleBack} className="mb-4">
            <Ionicons name="arrow-back" size={28} color="#22c55e" />
          </TouchableOpacity>
          <Text className="text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            Elite <Text className="text-green-500">Workouts</Text>
          </Text>
          <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            Pick a session and lift
          </Text>
        </View>

        {/* 🔥 Summary Banner: Total Calories Burned */}
        {selectedWorkout && (
          <View className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-3xl mb-8 flex-row justify-between items-center">
            <View>
              <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Active Plan</Text>
              <Text className="text-slate-900 dark:text-white font-black text-lg mt-1">{selectedWorkout.title}</Text>
            </View>
            <View className="items-end">
              <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Target Burn</Text>
              <Text className="text-orange-500 font-black text-2xl">-{selectedWorkout.caloriesBurned} kcal</Text>
            </View>
          </View>
        )}
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchWorkouts();
                }}
                tintColor="#22c55e"
              />
            }
            ListEmptyComponent={
              <Text className="text-center text-slate-500 mt-20 font-bold uppercase tracking-widest text-xs">
                No workouts available
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
