import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axios';

export default function DietsScreen({ navigation }) {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [feedback, setFeedback] = useState({ visible: false, title: '', message: '', type: 'success', onClose: null });

  const showFeedback = (title, message, type = 'error', onClose = null) => {
    setFeedback({ visible: true, title, message, type, onClose });
  };

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

  const fetchData = async () => {
    try {
      const res = await api.get('/diets');
      setDiets(res.data);

      // Fetch user profile to see current selection
      const userRes = await api.get('/users/profile');
      if (userRes.data.currentDietPlan) {
        setSelectedPlanId(userRes.data.currentDietPlan._id || userRes.data.currentDietPlan);
      } else {
        setSelectedPlanId(null);
      }
    }
    catch (e) { console.error(e.message); }
    finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSelect = async (diet) => {
    setIsSelecting(true);
    try {
      await api.put('/users/profile/selections', { currentDietPlan: diet._id });
      showFeedback(
        "Diet Activated",
        `You have selected the ${diet.planName}. Keep track of your fuel!`,
        "success",
        () => navigation.navigate('MainTabs', { screen: 'Dashboard' })
      );
    } catch (e) {
      showFeedback("Error", "Failed to update selection");
    } finally {
      setIsSelecting(false);
    }
  };

  const handleRemove = async () => {
    setIsSelecting(true);
    try {
      await api.put('/users/profile/selections', { currentDietPlan: "" });
      showFeedback(
        "Plan Removed",
        "Your active diet plan has been cleared.",
        "success",
        () => navigation.navigate('MainTabs', { screen: 'Dashboard' })
      );
    } catch (e) {
      showFeedback("Error", "Failed to remove plan");
    } finally {
      setIsSelecting(false);
    }
  };

  const selectedPlan = diets.find((diet) => diet._id === selectedPlanId) || null;

  const renderItem = ({ item }) => (
    <View className="bg-slate-50 dark:bg-slate-900 rounded-[32px] mb-6 border border-slate-200 dark:border-slate-800 overflow-hidden">
      <Image
        source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1490645935967-10de6ba170a1?w=800' }}
        className="w-full h-40"
      />
      <View className="p-6">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 pr-3">
            <Text className="text-slate-900 dark:text-white font-extrabold text-xl uppercase tracking-tight">{item.planName}</Text>
            {item.description ? <Text className="text-slate-500 font-medium mt-1">{item.description}</Text> : null}
            {item.details ? (
              <View className="mt-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{item.details}</Text>
              </View>
            ) : null}
          </View>
          <View className="bg-green-500 px-3 py-1.5 rounded-xl">
            <Text className="text-white font-extrabold text-[10px] uppercase">{item.calories} kcal</Text>
          </View>
        </View>

        <View className="mt-3">
          {(item.meals || []).map((m, idx) => (
            <View key={idx} className="flex-row items-start py-2 border-t border-slate-200 dark:border-slate-800">
              <Ionicons name="restaurant" size={14} color="#22c55e" style={{ marginTop: 3, marginRight: 8 }} />
              <View className="flex-1">
                <Text className="text-slate-900 dark:text-white font-extrabold text-xs uppercase tracking-wide">{m.name}{m.kcal ? ` · ${m.kcal} kcal` : ''}</Text>
                <Text className="text-slate-500 font-medium text-sm">{m.items}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => handleSelect(item)}
          disabled={selectedPlanId === item._id || isSelecting}
          className={`mt-4 py-4 rounded-2xl items-center flex-row justify-center ${selectedPlanId === item._id ? 'bg-slate-200 dark:bg-slate-800' : 'bg-green-500 shadow-lg shadow-green-500/30'}`}
        >
          {selectedPlanId === item._id && <Ionicons name="checkmark-circle" size={18} color="#64748b" style={{ marginRight: 8 }} />}
          <Text className={`font-black uppercase tracking-widest ${selectedPlanId === item._id ? 'text-slate-500' : 'text-white'}`}>
            {selectedPlanId === item._id ? 'Current Plan' : 'Select Plan'}
          </Text>
        </TouchableOpacity>

        {selectedPlanId === item._id && (
          <TouchableOpacity
            onPress={handleRemove}
            disabled={isSelecting}
            className="mt-3 py-3 rounded-2xl items-center border border-red-500/30"
          >
            <Text className="text-red-500 font-extrabold uppercase text-xs tracking-widest">Remove Plan</Text>
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
            Our <Text className="text-green-500">Diet Plans</Text>
          </Text>
          <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Fuel the gains</Text>
        </View>

        {/* 📊 Summary Banner: Total Calories Gained */}
        {selectedPlan && (
          <View className="bg-green-500/10 border border-green-500/20 p-6 rounded-3xl mb-8 flex-row justify-between items-center">
            <View>
              <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Active Plan</Text>
              <Text className="text-slate-900 dark:text-white font-black text-lg mt-1">{selectedPlan.planName}</Text>
            </View>
            <View className="items-end">
              <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Target Gain</Text>
              <Text className="text-green-500 font-black text-2xl">+{selectedPlan.calories} kcal</Text>
            </View>
          </View>
        )}
        {loading ? <View className="flex-1 justify-center items-center"><ActivityIndicator color="#22c55e" size="large" /></View>
          : <FlatList data={diets} renderItem={renderItem} keyExtractor={i => i._id} showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#22c55e" />}
            ListEmptyComponent={<Text className="text-center text-slate-500 mt-20 font-bold uppercase tracking-widest text-xs">No diet plans yet</Text>} />}
      </View>

      {/* 🔴 CUSTOM FEEDBACK MODAL */}
      <Modal animationType="fade" transparent={true} visible={feedback.visible} onRequestClose={() => setFeedback(prev => ({ ...prev, visible: false }))}>
        <View className="flex-1 bg-black/60 dark:bg-black/80 justify-center items-center px-6">
          <View className="bg-white dark:bg-gray-900 w-full p-8 rounded-[30px] border border-gray-200 dark:border-gray-800 shadow-2xl items-center">
            <View className={`p-4 rounded-full mb-4 ${feedback.type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <Ionicons name={feedback.type === 'success' ? "checkmark-circle" : "alert-circle"} size={50} color={feedback.type === 'success' ? "#22c55e" : "#ef4444"} />
            </View>
            <Text className="text-2xl font-black dark:text-white uppercase italic text-center mb-2">{feedback.title}</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mb-8 font-medium">{feedback.message}</Text>
            <TouchableOpacity onPress={() => {
              const cb = feedback.onClose;
              setFeedback(prev => ({ ...prev, visible: false, onClose: null }));
              if (cb) cb();
            }} className={`w-full py-4 rounded-2xl items-center shadow-lg ${feedback.type === 'success' ? 'bg-green-500 shadow-green-500/30' : 'bg-red-500 shadow-red-500/30'}`}>
              <Text className={feedback.type === 'success' ? "text-black font-black uppercase" : "text-white font-black uppercase"}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
