import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';

// Reusable Grid Button Component
const ActionButton = ({ label, icon, onPress }) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={{ width: '48%' }} 
    className="bg-gray-100 dark:bg-gray-900 p-6 rounded-3xl items-center border border-gray-200 dark:border-gray-800 mb-4"
  >
    <Ionicons name={icon} size={28} color="#22c55e" />
    <Text className="mt-2 font-bold text-gray-900 dark:text-white">{label}</Text>
  </TouchableOpacity>
);

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🧮 Safe BMI Calculation & Visual Logic
  const userWeight = user?.weight || 0;
  const userHeight = user?.height || 0;
  const heightInMeters = userHeight > 0 ? userHeight / 100 : 1;
  const bmiRaw = (userWeight > 0 && userHeight > 0) ? (userWeight / (heightInMeters * heightInMeters)) : 0;
  const bmiDisplay = bmiRaw > 0 ? bmiRaw.toFixed(1) : '--';

  // Determine BMI Visuals
  let bmiFeedback = "Add Stats"; let bmiColor = "#64748b"; let bmiPercentage = 0;
  if (bmiRaw > 0) {
    if (bmiRaw < 18.5) { bmiFeedback = "Underweight 💪"; bmiColor = "#fbbf24"; bmiPercentage = 25; }
    else if (bmiRaw < 25) { bmiFeedback = "Healthy Zone 🔥"; bmiColor = "#22c55e"; bmiPercentage = 50; }
    else if (bmiRaw < 30) { bmiFeedback = "Overweight 🏃‍♂️"; bmiColor = "#f97316"; bmiPercentage = 75; }
    else { bmiFeedback = "Obese 🎯"; bmiColor = "#ef4444"; bmiPercentage = 90; }
  }

  const fetchMyEnrollment = async () => {
    try {
      const response = await api.get('/enrollments/my-enrollments');
      const activeOrPending = response.data.find(e => e.status === 'Active' || e.status === 'Pending');
      setEnrollment(activeOrPending || null);
    } catch (error) {
      console.log("Error fetching enrollments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEnrollment();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyEnrollment().then(() => setRefreshing(false));
  }, []);

  // Placeholder for Teammate's features
  const handleFeaturePress = (featureName) => {
    Alert.alert(
      `${featureName} Coming Soon!`, 
      `Your teammate is currently building the ${featureName} screen.`
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView 
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22c55e" />}
      >
        {/* 🏆 Header Section */}
        <View className="mb-8">
          <Text className="text-3xl font-black dark:text-white uppercase italic">
            Hello, <Text className="text-green-500">{user?.name?.split(' ')[0] || 'Athlete'}</Text>
          </Text>
          <Text className="text-gray-500 font-medium">Ready to crush your goals?</Text>
        </View>

        {/* 📊 Stats Grid (Your original implementation) */}
        <View className="flex-row justify-between mb-4">
          <View className="bg-gray-100 dark:bg-gray-900 w-[31%] p-4 rounded-3xl items-center border border-gray-200 dark:border-gray-800">
            <Ionicons name="body" size={28} color="#22c55e" />
            <Text className="text-xl font-black dark:text-white mt-2">{bmiDisplay}</Text>
            <Text className="text-[10px] text-gray-500 uppercase font-bold">BMI</Text>
          </View>
          <View className="bg-gray-100 dark:bg-gray-900 w-[31%] p-4 rounded-3xl items-center border border-gray-200 dark:border-gray-800">
            <Ionicons name="scale" size={28} color="#3b82f6" />
            <Text className="text-xl font-black dark:text-white mt-2">{userWeight > 0 ? userWeight : '--'}</Text>
            <Text className="text-[10px] text-gray-500 uppercase font-bold">KG</Text>
          </View>
          <View className="bg-gray-100 dark:bg-gray-900 w-[31%] p-4 rounded-3xl items-center border border-gray-200 dark:border-gray-800">
            <Ionicons name="resize" size={28} color="#a855f7" />
            <Text className="text-xl font-black dark:text-white mt-2">{userHeight > 0 ? userHeight : '--'}</Text>
            <Text className="text-[10px] text-gray-500 uppercase font-bold">CM</Text>
          </View>
        </View>

        {/* 📈 Dynamic BMI Motivation Bar (From Guest Screen) */}
        {bmiRaw > 0 && (
          <View className="bg-gray-100 dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 mb-8">
            <View className="h-3 bg-gray-200 dark:bg-black rounded-full overflow-hidden flex-row mb-4">
              <View style={{ width: `${bmiPercentage}%`, backgroundColor: bmiColor }} className="h-full rounded-full" />
            </View>
            <View className="flex-row justify-between items-center">
              <Text style={{ color: bmiColor }} className="font-black uppercase tracking-widest text-sm">
                {bmiFeedback}
              </Text>
              <Ionicons name="stats-chart" size={24} color={bmiColor} />
            </View>
          </View>
        )}

        {/* 💳 Membership Card Section (Your original logic) */}
        <Text className="text-xl font-black dark:text-white mb-4 uppercase italic">Current Membership</Text>
        
        {loading ? (
          <View className="bg-gray-100 dark:bg-gray-900 p-8 rounded-3xl items-center border border-gray-200 dark:border-gray-800 mb-8">
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        ) : enrollment ? (
          <View className="bg-gray-100 dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 relative overflow-hidden mb-8">
            <View className="absolute -right-10 -top-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-500 font-bold uppercase text-xs tracking-widest">Plan Details</Text>
              <View className={`px-3 py-1 rounded-full ${enrollment.status === 'Active' ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                <Text className={`font-bold text-xs uppercase ${enrollment.status === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {enrollment.status}
                </Text>
              </View>
            </View>
            <Text className="text-3xl font-black dark:text-white uppercase mb-1">{enrollment.membership?.planName || "Unknown Plan"}</Text>
            <Text className="text-gray-500 font-medium mb-6">Valid for {enrollment.membership?.duration || "N/A"}</Text>
            <View className="flex-row items-center bg-white dark:bg-black p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
              <Ionicons name="calendar-outline" size={24} color="#22c55e" />
              <View className="ml-3">
                <Text className="text-gray-500 text-xs font-bold uppercase">Enrolled On</Text>
                <Text className="dark:text-white font-black">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="bg-gray-100 dark:bg-gray-900 p-8 rounded-3xl items-center border border-gray-200 dark:border-gray-800 mb-8">
            <Ionicons name="card-outline" size={48} color="#9ca3af" className="mb-4" />
            <Text className="text-xl font-bold dark:text-white mb-2">No Active Plan</Text>
            <Text className="text-gray-500 text-center mb-6">You are not currently enrolled in any elite memberships.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Plans')} className="bg-green-500 py-4 px-8 rounded-2xl shadow-lg shadow-green-500/20">
              <Text className="text-black font-black uppercase text-base">View Plans</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 🚀 QUICK ACTIONS (From Your Original Layout) */}
        <Text className="text-xl font-black dark:text-white mb-4 uppercase italic">Manage</Text>
        <View className="flex-row justify-between mb-4">
          <ActionButton label="Manage Plans" icon="card" onPress={() => navigation.navigate('Plans')} />
          <ActionButton label="My Profile" icon="person" onPress={() => navigation.navigate('Profile')} />
        </View>

        {/* 🏋️ TEAMMATE'S FEATURE GRID */}
        <Text className="text-xl font-black dark:text-white mb-4 uppercase italic">Elite Features</Text>
        <View className="flex-row flex-wrap justify-between gap-y-4">
          <ActionButton label="Trainers" icon="people" onPress={() => handleFeaturePress('Trainers')} />
          <ActionButton label="Workouts" icon="barbell" onPress={() => handleFeaturePress('Workouts')} />
          <ActionButton label="Diet Plan" icon="fast-food" onPress={() => handleFeaturePress('Diet Plans')} />
          <ActionButton label="Progress" icon="trending-up" onPress={() => handleFeaturePress('Progress Tracking')} />
          {/* Support goes directly to the Support page as requested */}
          <View className="w-full">
            <TouchableOpacity 
              onPress={() => navigation.navigate('Support')} 
              className="bg-green-500/10 p-4 rounded-3xl flex-row justify-center items-center border border-green-500/20"
            >
              <Ionicons name="help-buoy" size={24} color="#22c55e" />
              <Text className="ml-2 font-black text-green-500 uppercase">Support Center</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}