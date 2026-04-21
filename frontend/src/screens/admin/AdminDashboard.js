import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios'; // Ensure this points to your configured Axios instance

// Matching your Onboarding font-extrabold and slate coloring
const AdminActionCard = ({ label, subtitle, icon, color, onPress }) => (
  <TouchableOpacity 
    onPress={onPress} 
    activeOpacity={0.7}
    style={{ width: '48%' }} 
    className="bg-slate-50 dark:bg-slate-900 p-5 rounded-[24px] items-start border border-slate-200 dark:border-slate-800 mb-4 shadow-sm"
  >
    <View style={{ backgroundColor: `${color}15` }} className="p-3 rounded-2xl mb-4">
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <Text className="font-extrabold text-slate-900 dark:text-white uppercase text-sm tracking-wide">
      {label}
    </Text>
    {subtitle && (
      <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-widest">
        {subtitle}
      </Text>
    )}
  </TouchableOpacity>
);

const QuickStat = ({ value, label, icon, color, loading }) => (
  <View className="bg-slate-50 dark:bg-slate-900 p-4 rounded-3xl flex-1 mx-1 items-center border border-slate-200 dark:border-slate-800 shadow-sm">
    <Ionicons name={icon} size={22} color={color} style={{ marginBottom: 4 }} />
    {loading ? (
      <ActivityIndicator size="small" color={color} style={{ marginVertical: 2 }} />
    ) : (
      <Text className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</Text>
    )}
    <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mt-1">{label}</Text>
  </View>
);

export default function AdminDashboard({ navigation }) {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ pending: 0, members: 0, plans: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // 👈 Added refreshing state

  // 🚀 Extracted fetch logic so it can be reused by the pull-to-refresh
  const fetchDashboardStats = async () => {
    try {
      // 1. Fetch Plans Count
      const plansRes = await api.get('/memberships');
      const plansCount = plansRes.data.length;

      // 2. Fetch Enrollments to calculate "Pending" status count
      const enrollmentsRes = await api.get('/enrollments');
      const pendingCount = enrollmentsRes.data.filter(e => e.status === 'Pending').length;

      // 3. Fetch Total Members 
      let membersCount = 0;
      try {
        const usersRes = await api.get('/users'); 
        membersCount = usersRes.data.length;
      } catch (err) {
        console.log("Could not fetch users count - /api/users GET route might be missing.");
      }

      setStats({ pending: pendingCount, members: membersCount, plans: plansCount });
    } catch (error) {
      console.error("Failed to sync dashboard stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); // 👈 Stop the refresh spinner
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // 👈 Triggered when user pulls down
  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        // 👇 Added RefreshControl here
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#22c55e" // Matches your Gym Green theme
          />
        }
      >
        {/* HEADER */}
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
              Admin <Text className="text-green-500">Portal</Text>
            </Text>
            <Text className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">
              Cmd: {user?.name || 'Super Admin'}
            </Text>
          </View>
          <View className="h-12 w-12 bg-green-500/20 rounded-full items-center justify-center border border-green-500/30">
            <Ionicons name="shield-checkmark" size={24} color="#22c55e" />
          </View>
        </View>

        {/* 📈 REAL-TIME STATS */}
        <View className="flex-row justify-between mb-8">
          <QuickStat loading={loading} value={stats.pending} label="Pending" icon="time" color="#fbbf24" />
          <QuickStat loading={loading} value={stats.members} label="Members" icon="people" color="#3b82f6" />
          <QuickStat loading={loading} value={stats.plans} label="Plans" icon="card" color="#22c55e" />
        </View>

        {/* 🛡️ DYNAMIC THEME BANNER (Adapts to Light/Dark Mode) */}
        <View className="bg-slate-100 dark:bg-slate-900 p-6 rounded-[32px] border border-slate-300 dark:border-slate-800 relative overflow-hidden mb-8 shadow-sm">
          <View className="absolute -right-12 -top-12 w-48 h-48 bg-green-500/10 rounded-full" />
          <View className="absolute -left-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full" />
          
          <View className="flex-row justify-between items-center mb-4 z-10">
             <View className="bg-green-500/20 px-4 py-1.5 rounded-full border border-green-500/30 flex-row items-center">
               <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
               <Text className="text-green-600 dark:text-green-400 font-extrabold text-[10px] uppercase tracking-widest">System Live</Text>
             </View>
          </View>
          <Text className="text-slate-900 dark:text-white text-3xl font-extrabold uppercase leading-none z-10 tracking-tight">
            Management <Text className="text-green-500">Hub</Text>
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mt-2 tracking-widest z-10">
            Global Operations Control
          </Text>
        </View>

        {/* ⚙️ CORE OPS */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">Core Ops</Text>
          <View className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 ml-4 rounded-full" />
        </View>
        
        <View className="flex-row flex-wrap justify-between mb-6">
          <AdminActionCard 
            label="Approvals" 
            subtitle="Verify Payments"
            icon="checkmark-circle" 
            color="#fbbf24" 
            onPress={() => navigation.navigate('Approvals')} 
          />
          <AdminActionCard 
            label="Payment Plans" 
            subtitle="Edit Pricing"
            icon="card" 
            color="#22c55e" 
            onPress={() => navigation.navigate('AdminPlans')} 
          />
          <AdminActionCard 
            label="Members" 
            subtitle="Manage Users"
            icon="people" 
            color="#3b82f6" 
            onPress={() => navigation.navigate('ManageUsers')} 
          />
          <AdminActionCard 
            label="Trainers" 
            subtitle="Staff Directory"
            icon="fitness" 
            color="#a855f7" 
            onPress={() => {}} 
          />
        </View>

        {/* 📊 CONTENT */}
        <View className="flex-row items-center justify-between mb-4 mt-2">
          <Text className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">Content</Text>
          <View className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 ml-4 rounded-full" />
        </View>

        <View className="flex-row flex-wrap justify-between">
          <AdminActionCard 
            label="Progress" 
            subtitle="User Metrics"
            icon="trending-up" 
            color="#06b6d4" 
            onPress={() => {}} 
          />
          <AdminActionCard 
            label="Workouts" 
            subtitle="Exercise DB"
            icon="barbell" 
            color="#f472b6" 
            onPress={() => {}} 
          />
          <AdminActionCard 
            label="Diet Hub" 
            subtitle="Nutrition Plans"
            icon="fast-food" 
            color="#fb923c" 
            onPress={() => {}} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}