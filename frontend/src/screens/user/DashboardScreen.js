import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

const ActionButton = ({ label, icon, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ width: "48%" }}
    className="bg-gray-100 dark:bg-gray-900 p-6 rounded-3xl items-center border border-gray-200 dark:border-gray-800 mb-4"
  >
    <Ionicons name={icon} size={28} color="#22c55e" />
    <Text className="mt-2 font-bold text-gray-900 dark:text-white">
      {label}
    </Text>
  </TouchableOpacity>
);

export default function DashboardScreen({ navigation }) {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState(authUser);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // BMI & Stats Calculations
  const userWeight = user?.weight || 0;
  const userHeight = user?.height || 0;
  const heightInMeters = userHeight > 0 ? userHeight / 100 : 1;
  const bmiRaw =
    userWeight > 0 && userHeight > 0
      ? userWeight / (heightInMeters * heightInMeters)
      : 0;
  const bmiDisplay = bmiRaw > 0 ? bmiRaw.toFixed(1) : "--";

  const caloriesIn = user?.currentDietPlan?.calories || 0;
  const caloriesOut = user?.currentWorkoutPlan?.caloriesBurned || 0;
  const netCalories = caloriesIn - caloriesOut;

  let bmiFeedback = "Add Stats";
  let bmiColor = "#64748b";
  let bmiPercentage = 0;
  if (bmiRaw > 0) {
    if (bmiRaw < 18.5) {
      bmiFeedback = "Underweight 💪";
      bmiColor = "#fbbf24";
      bmiPercentage = 25;
    } else if (bmiRaw < 25) {
      bmiFeedback = "Healthy Zone 🔥";
      bmiColor = "#22c55e";
      bmiPercentage = 50;
    } else if (bmiRaw < 30) {
      bmiFeedback = "Overweight 🏃‍♂️";
      bmiColor = "#f97316";
      bmiPercentage = 75;
    } else {
      bmiFeedback = "Obese 🎯";
      bmiColor = "#ef4444";
      bmiPercentage = 90;
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRes = await api.get("/users/profile");
      setUser(userRes.data);

      const enrollRes = await api.get("/enrollments/my-enrollments");
      const activeOrPending = enrollRes.data.find(
        (e) => e.status === "Active" || e.status === "Pending",
      );
      setEnrollment(activeOrPending || null);
    } catch (error) {
      console.log("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔄 Refresh enrollment data whenever screen is focused (e.g., after user enrolls from PlansScreen)
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // ✅ IMPROVED WhatsApp Contact Logic (Fixes IMG_3985.jpg issue)
  const contactTrainer = () => {
    const phone = user?.selectedTrainer?.contact;
    if (!phone) {
      return Alert.alert(
        "Contact Info Missing",
        "Trainer phone number is not available.",
      );
    }

    // අංකයේ ඇති අනවශ්‍ය සංකේත ඉවත් කර පිරිසිදු අංකය ලබා ගැනීම
    const cleanedPhone = phone.replace(/[^\d]/g, "");
    const message = `Hi Coach, I'm ${user.name}.`;
    const url = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "WhatsApp is not installed on your device.");
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
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
        <View className="mb-8 flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-black dark:text-white uppercase italic">
              Hello,{" "}
              <Text className="text-green-500">
                {user?.name?.split(" ")[0] || "Athlete"}
              </Text>
            </Text>
            <Text className="text-gray-500 font-medium">
              Ready to crush your goals?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowQR(!showQR)}
            className="bg-green-500/10 p-3 rounded-2xl border border-green-500/20"
          >
            <Ionicons
              name={showQR ? "close" : "qr-code"}
              size={24}
              color="#22c55e"
            />
          </TouchableOpacity>
        </View>

        {/* 📱 ATTENDANCE QR SECTION */}
        {showQR && (
          <View className="bg-slate-900 p-6 rounded-[32px] mb-8 items-center border border-green-500/30 shadow-xl shadow-green-500/10">
            <Text className="text-green-500 font-black uppercase text-[10px] tracking-widest mb-4">
              Daily Attendance QR
            </Text>
            <View className="bg-white p-4 rounded-3xl">
              <QRCode
                value={user?._id}
                size={160}
                color="black"
                backgroundColor="white"
              />
            </View>
            <Text className="text-gray-400 text-xs font-bold mt-4 text-center">
              Show this to your trainer to mark your session today.
            </Text>
          </View>
        )}

        {/* 🤝 MY ASSIGNED COACH */}
        {user?.selectedTrainer && (
          <View className="bg-gray-100 dark:bg-gray-900 p-6 rounded-[32px] border border-gray-200 dark:border-gray-800 mb-8 relative overflow-hidden shadow-sm">
            <View className="absolute -right-6 -bottom-6 w-24 h-24 bg-green-500/5 rounded-full" />
            <Text className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-4">
              Your Active Coach
            </Text>
            <View className="flex-row items-center">
              <Image
                source={{
                  uri:
                    user.selectedTrainer.image ||
                    "https://via.placeholder.com/150",
                }}
                className="w-14 h-14 rounded-2xl border border-gray-300 dark:border-gray-700 bg-slate-200"
              />
              <View className="ml-4 flex-1">
                <Text className="text-xl font-black dark:text-white uppercase">
                  {user.selectedTrainer.name}
                </Text>
                <Text className="text-green-500 font-bold text-xs uppercase">
                  {user.selectedTrainer.specialization}
                </Text>
              </View>
              <TouchableOpacity
                onPress={contactTrainer}
                className="bg-green-500 p-3 rounded-2xl shadow-sm"
              >
                <Ionicons name="logo-whatsapp" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STATS GRID */}
        <View className="flex-row flex-wrap justify-between mb-4">
          <View className="bg-gray-100 dark:bg-gray-900 w-[48%] p-4 rounded-3xl items-center border border-gray-200 dark:border-gray-800 mb-4">
            <Ionicons name="body" size={28} color="#22c55e" />
            <Text className="text-xl font-black dark:text-white mt-2">
              {bmiDisplay}
            </Text>
            <Text className="text-[10px] text-gray-500 uppercase font-bold">
              BMI Index
            </Text>
          </View>
          <View className="bg-gray-100 dark:bg-gray-900 w-[48%] p-4 rounded-3xl items-center border border-gray-200 dark:border-gray-800 mb-4">
            <Ionicons name="flame" size={28} color="#f97316" />
            <Text className="text-xl font-black dark:text-white mt-2">
              {netCalories > 0 ? `+${netCalories}` : netCalories}
            </Text>
            <Text className="text-[10px] text-gray-500 uppercase font-bold">
              Net Kcal
            </Text>
          </View>
        </View>

        {/* BMI MOTIVATION */}
        {bmiRaw > 0 && (
          <View className="bg-gray-100 dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 mb-8">
            <View className="h-3 bg-gray-200 dark:bg-black rounded-full overflow-hidden flex-row mb-4">
              <View
                style={{
                  width: `${bmiPercentage}%`,
                  backgroundColor: bmiColor,
                }}
                className="h-full rounded-full"
              />
            </View>
            <View className="flex-row justify-between items-center">
              <Text
                style={{ color: bmiColor }}
                className="font-black uppercase tracking-widest text-sm"
              >
                {bmiFeedback}
              </Text>
              <Ionicons name="stats-chart" size={24} color={bmiColor} />
            </View>
          </View>
        )}

        {/* MEMBERSHIP SECTION */}
        <Text className="text-xl font-black dark:text-white mb-4 uppercase italic">
          Membership
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#22c55e" />
        ) : enrollment ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("Plans")}
            activeOpacity={0.7}
            className="bg-gray-100 dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 mb-8 flex-row justify-between items-start"
          >
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                  Plan Details
                </Text>
                <View
                  className={`px-3 py-1 rounded-full ${enrollment.status === "Active" ? "bg-green-500/20" : "bg-yellow-500/20"}`}
                >
                  <Text
                    className={`font-bold text-xs uppercase ${enrollment.status === "Active" ? "text-green-500" : "text-yellow-500"}`}
                  >
                    {enrollment.status}
                  </Text>
                </View>
              </View>
              <Text className="text-3xl font-black dark:text-white uppercase mb-1">
                {enrollment.membership?.planName}
              </Text>
              <Text className="text-gray-500 font-medium">
                Valid for {enrollment.membership?.duration}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={28} color="#22c55e" className="ml-4 mt-1" />
          </TouchableOpacity>
        ) : (
          <View className="bg-gray-100 dark:bg-gray-900 p-8 rounded-3xl items-center mb-8 border border-gray-200 dark:border-gray-800">
            <TouchableOpacity
              onPress={() => navigation.navigate("Plans")}
              className="bg-green-500 py-4 px-8 rounded-2xl"
            >
              <Text className="text-black font-black uppercase">
                Get Elite Plan
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FEATURES */}
        <Text className="text-xl font-black dark:text-white mb-4 uppercase italic">
          Features
        </Text>
        <View className="flex-row flex-wrap justify-between">
          <ActionButton
            label="Trainers"
            icon="people"
            onPress={() => navigation.navigate("Trainers")}
          />
          <ActionButton
            label="Workouts"
            icon="barbell"
            onPress={() => navigation.navigate("Workouts")}
          />
          <ActionButton
            label="Diet Plan"
            icon="fast-food"
            onPress={() => navigation.navigate("Diets")}
          />
          <ActionButton
            label="Progress"
            icon="trending-up"
            onPress={() => navigation.navigate("Progress")}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Support")}
          className="bg-green-500/10 p-4 rounded-3xl flex-row justify-center items-center border border-green-500/20 mt-4"
        >
          <Ionicons name="help-buoy" size={24} color="#22c55e" />
          <Text className="ml-2 font-black text-green-500 uppercase tracking-widest">
            Support Center
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
