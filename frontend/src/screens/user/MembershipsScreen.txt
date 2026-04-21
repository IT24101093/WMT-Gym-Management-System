import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';

export default function MembershipsScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [myEnrollment, setMyEnrollment] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // stores ID of plan being clicked

  // Custom Modal State
  const [feedback, setFeedback] = useState({ visible: false, title: '', message: '', type: 'success' });

  const showFeedback = (title, message, type = 'error') => {
    setFeedback({ visible: true, title, message, type });
  };

  // 🚀 Fetch Data (My Plan + Available Plans)
  const fetchData = async () => {
    try {
      // 1. Fetch user's current enrollment
      const enrollmentRes = await api.get('/enrollments/my-enrollments');
      
      // If they have enrollments, grab the most recent one (or active/pending one)
      if (enrollmentRes.data && enrollmentRes.data.length > 0) {
        // Find the one that isn't expired
        const current = enrollmentRes.data.find(e => e.status === 'Active' || e.status === 'Pending');
        setMyEnrollment(current || null);
      } else {
        setMyEnrollment(null);
      }

      // 2. Fetch all available membership plans 
      // (Assumes you have a GET /api/memberships route)
      const plansRes = await api.get('/memberships');
      setAvailablePlans(plansRes.data);

    } catch (error) {
      console.log("Error fetching data:", error.response?.data || error.message);
      showFeedback("Fetch Error", "Could not load memberships. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // 📝 Enroll in a Plan
  const handleEnroll = async (planId) => {
    setActionLoading(planId);
    try {
      await api.post('/enrollments', { membershipId: planId });
      showFeedback("Request Sent", "You have successfully requested to join! Waiting for Admin approval.", "success");
      fetchData(); // Refresh to show the new "Pending" plan
    } catch (error) {
      showFeedback("Enrollment Failed", error.response?.data?.message || "Something went wrong.");
    } finally {
      setActionLoading(null);
    }
  };

  // 🗑️ Cancel Pending/Active Plan
  const handleCancelPlan = async () => {
    if (!myEnrollment) return;
    setActionLoading('cancel');
    try {
      await api.delete(`/enrollments/${myEnrollment._id}`);
      showFeedback("Cancelled", "Your membership has been successfully cancelled.", "success");
      setMyEnrollment(null);
      fetchData();
    } catch (error) {
      showFeedback("Cancellation Failed", error.response?.data?.message || "Could not cancel plan.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#22c55e" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView 
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22c55e" />}
      >
        
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-black dark:text-white uppercase italic">Memberships</Text>
          <Text className="text-gray-500 font-bold mt-1">Unlock your elite potential.</Text>
        </View>

        {/* 🏆 SECTION 1: MY CURRENT PLAN */}
        <Text className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4">My Status</Text>
        
        {myEnrollment ? (
          <View className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 mb-8 shadow-xl">
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-2xl font-black dark:text-white uppercase italic">
                  {myEnrollment.membership?.planName || "Unknown Plan"}
                </Text>
                <Text className="text-gray-500 font-bold mt-1">
                  Duration: {myEnrollment.membership?.duration} Months
                </Text>
              </View>
              
              {/* Status Badge */}
              <View className={`px-3 py-1 rounded-full ${myEnrollment.status === 'Active' ? 'bg-green-500/20 border-green-500' : 'bg-orange-500/20 border-orange-500'} border`}>
                <Text className={`font-bold text-xs uppercase ${myEnrollment.status === 'Active' ? 'text-green-500' : 'text-orange-500'}`}>
                  {myEnrollment.status}
                </Text>
              </View>
            </View>

            {myEnrollment.status === 'Pending' && (
              <Text className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-medium italic">
                * Your enrollment is awaiting Admin approval. You will have full access once approved.
              </Text>
            )}

            <TouchableOpacity 
              onPress={handleCancelPlan} 
              disabled={actionLoading === 'cancel'}
              className="bg-red-500/10 py-3 rounded-xl border border-red-500/30 items-center"
            >
              {actionLoading === 'cancel' ? (
                <ActivityIndicator color="#ef4444" />
              ) : (
                <Text className="text-red-500 font-bold uppercase">Cancel Enrollment</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-green-500/10 rounded-3xl p-6 border border-green-500/30 mb-8 items-center border-dashed">
            <Ionicons name="card-outline" size={40} color="#22c55e" className="mb-2" />
            <Text className="dark:text-white font-bold text-lg text-center mt-2">No Active Membership</Text>
            <Text className="text-gray-500 text-center mt-1">Choose a plan below to get started.</Text>
          </View>
        )}

        {/* 📋 SECTION 2: AVAILABLE PLANS */}
        <Text className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4">Available Plans</Text>
        
        {availablePlans.length === 0 ? (
          <Text className="text-gray-500 text-center italic mt-4">No membership plans available right now.</Text>
        ) : (
          availablePlans.map((plan) => (
            <View key={plan._id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 mb-4 shadow-sm flex-row items-center justify-between">
              
              <View className="flex-1">
                <Text className="text-xl font-black dark:text-white uppercase italic">{plan.planName}</Text>
                <Text className="text-green-500 font-black text-lg mt-1">Rs. {plan.price}</Text>
                <Text className="text-gray-500 text-sm font-bold mt-1">{plan.duration} Month Access</Text>
              </View>

              <TouchableOpacity 
                onPress={() => handleEnroll(plan._id)}
                disabled={myEnrollment !== null || actionLoading === plan._id} // Disable if they already have a plan
                className={`px-6 py-4 rounded-2xl items-center justify-center shadow-lg ${
                  myEnrollment !== null 
                    ? 'bg-gray-300 dark:bg-gray-800 shadow-none' 
                    : 'bg-green-500 shadow-green-500/30'
                }`}
              >
                {actionLoading === plan._id ? (
                  <ActivityIndicator color="black" />
                ) : (
                  <Text className={myEnrollment !== null ? "text-gray-500 font-black uppercase" : "text-black font-black uppercase"}>
                    {myEnrollment !== null ? 'Locked' : 'Enroll'}
                  </Text>
                )}
              </TouchableOpacity>
              
            </View>
          ))
        )}

      </ScrollView>

      {/* 🟢/🔴 CUSTOM FEEDBACK MODAL */}
      <Modal animationType="fade" transparent={true} visible={feedback.visible} onRequestClose={() => setFeedback(prev => ({ ...prev, visible: false }))}>
        <View className="flex-1 bg-black/60 dark:bg-black/80 justify-center items-center px-6">
          <View className="bg-white dark:bg-gray-900 w-full p-8 rounded-[30px] border border-gray-200 dark:border-gray-800 shadow-2xl items-center">
            
            <View className={`p-4 rounded-full mb-4 ${feedback.type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <Ionicons 
                name={feedback.type === 'success' ? "checkmark-circle" : "alert-circle"} 
                size={50} 
                color={feedback.type === 'success' ? "#22c55e" : "#ef4444"} 
              />
            </View>

            <Text className="text-2xl font-black dark:text-white uppercase italic text-center mb-2">
              {feedback.title}
            </Text>
            
            <Text className="text-gray-500 dark:text-gray-400 text-center mb-8 font-medium">
              {feedback.message}
            </Text>

            <TouchableOpacity 
              onPress={() => setFeedback(prev => ({ ...prev, visible: false }))} 
              className={`w-full py-4 rounded-2xl items-center shadow-lg ${feedback.type === 'success' ? 'bg-green-500 shadow-green-500/30' : 'bg-red-500 shadow-red-500/30'}`}
            >
              <Text className={feedback.type === 'success' ? "text-black font-black uppercase" : "text-white font-black uppercase"}>
                Okay
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}