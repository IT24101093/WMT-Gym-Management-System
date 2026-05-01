import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

const AdminActionCard = ({ label, subtitle, icon, color, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{ width: "48%" }}
    className="bg-slate-50 dark:bg-slate-900 p-5 rounded-[24px] items-start border border-slate-200 dark:border-slate-800 mb-4 shadow-sm"
  >
    <View
      style={{ backgroundColor: `${color}15` }}
      className="p-3 rounded-2xl mb-4"
    >
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
      <ActivityIndicator
        size="small"
        color={color}
        style={{ marginVertical: 2 }}
      />
    ) : (
      <Text className="text-2xl font-extrabold text-slate-900 dark:text-white">
        {value}
      </Text>
    )}
    <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mt-1">
      {label}
    </Text>
  </View>
);

export default function AdminDashboard({ navigation }) {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ pending: 0, members: 0, plans: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardStats = async () => {
    try {
      const [plansRes, enrollmentsRes, usersRes] = await Promise.all([
        api.get("/memberships"),
        api.get("/enrollments"),
        api.get("/users").catch(() => ({ data: [] })),
      ]);

      const pendingCount = enrollmentsRes.data.filter(
        (e) => e.status === "Pending",
      ).length;

      setStats({
        pending: pendingCount,
        members: usersRes.data.length,
        plans: plansRes.data.length,
      });
    } catch (error) {
      console.error("Failed to sync dashboard stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#22c55e"
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
                Cmd: {user?.name || "Super Admin"}
              </Text>
            </View>
            <View className="h-12 w-12 bg-green-500/20 rounded-full items-center justify-center border border-green-500/30">
              <Ionicons name="shield-checkmark" size={24} color="#22c55e" />
            </View>
          </View>

          {/* 📈 QUICK STATS */}
          <View className="flex-row justify-between mb-8">
            <QuickStat
              loading={loading}
              value={stats.pending}
              label="Pending"
              icon="time"
              color="#fbbf24"
            />
            <QuickStat
              loading={loading}
              value={stats.members}
              label="Members"
              icon="people"
              color="#3b82f6"
            />
            <QuickStat
              loading={loading}
              value={stats.plans}
              label="Plans"
              icon="card"
              color="#22c55e"
            />
          </View>

          {/* 🛡️ MANAGEMENT HUB BANNER */}
          <View className="bg-slate-100 dark:bg-slate-900 p-6 rounded-[32px] border border-slate-300 dark:border-slate-800 relative overflow-hidden mb-8 shadow-sm">
            <View className="absolute -right-12 -top-12 w-48 h-48 bg-green-500/10 rounded-full" />
            <View className="absolute -left-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full" />

            <View className="flex-row justify-between items-center mb-4 z-10">
              <View className="bg-green-500/20 px-4 py-1.5 rounded-full border border-green-500/30 flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                <Text className="text-green-600 dark:text-green-400 font-extrabold text-[10px] uppercase tracking-widest">
                  System Live
                </Text>
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
            <Text className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
              Core Ops
            </Text>
            <View className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 ml-4 rounded-full" />
          </View>

          <View className="flex-row flex-wrap justify-between mb-6">
            <AdminActionCard
              label="Approvals"
              subtitle="Verify Payments"
              icon="checkmark-circle"
              color="#fbbf24"
              onPress={() => navigation.navigate("Approvals")}
            />
            <AdminActionCard
              label="Payment Plans"
              subtitle="Edit Pricing"
              icon="card"
              color="#22c55e"
              onPress={() => navigation.navigate("AdminPlans")}
            />
            <AdminActionCard
              label="Members"
              subtitle="Manage Users"
              icon="people"
              color="#3b82f6"
              onPress={() => navigation.navigate("ManageUsers")}
            />
            <AdminActionCard
              label="Trainers"
              subtitle="Staff Directory"
              icon="fitness"
              color="#a855f7"
              onPress={() => navigation.navigate("AdminTrainers")}
            />
          </View>

          {/* 📊 CONTENT */}
          <View className="flex-row items-center justify-between mb-4 mt-2">
            <Text className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
              Content
            </Text>
            <View className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 ml-4 rounded-full" />
          </View>

          <View className="flex-row flex-wrap justify-between">
            <AdminActionCard
              label="Progress"
              subtitle="User Metrics"
              icon="trending-up"
              color="#06b6d4"
              onPress={() => navigation.navigate("ManageProgress")}
            />
            <AdminActionCard
              label="Workouts"
              subtitle="Exercise DB"
              icon="barbell"
              color="#f472b6"
              onPress={() => navigation.navigate("ManageWorkouts")}
            />
            <AdminActionCard
              label="Diet Hub"
              subtitle="Nutrition Plans"
              icon="fast-food"
              color="#fb923c"
              onPress={() => navigation.navigate("ManageDiets")}
            />
          </View>
        </ScrollView>

        {/* 🔘 🏆 ATTENDANCE SCANNER FAB (New Professional Gym Feature) */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Scanner")}
          activeOpacity={0.8}
          className="absolute bottom-10 right-6 bg-green-500 w-16 h-16 rounded-full items-center justify-center shadow-2xl shadow-green-500/40 border-4 border-white dark:border-slate-900"
        >
          <Ionicons name="qr-code-scanner" size={30} color="#0f172a" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
