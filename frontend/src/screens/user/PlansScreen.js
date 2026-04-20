import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // 👈 NEW IMPORT
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

export default function PlansScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [myEnrollment, setMyEnrollment] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Custom Feedback Modal State
  const [feedback, setFeedback] = useState({ visible: false, title: '', message: '', type: 'success' });

  // 📸 NEW: Image Upload States
  const [enrollModalVisible, setEnrollModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);

  const showFeedback = (title, message, type = 'error') => {
    setFeedback({ visible: true, title, message, type });
  };

  const fetchData = async () => {
    try {
      const enrollmentRes = await api.get('/enrollments/my-enrollments');
      if (enrollmentRes.data && enrollmentRes.data.length > 0) {
        const current = enrollmentRes.data.find(e => e.status === 'Active' || e.status === 'Pending');
        setMyEnrollment(current || null);
      } else {
        setMyEnrollment(null);
      }

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

  // 📸 Step 1: Open Gallery to Pick Receipt
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      showFeedback("Permission Required", "We need access to your photos to upload a receipt.", "error");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8, // Compress slightly for the 5MB backend limit
    });

    if (!result.canceled) {
      setReceiptImage(result.assets[0]);
    }
  };

 // 🚀 Step 2: Submit the Form Data to Backend (Using Native Fetch!)
  const submitEnrollment = async () => {
    if (!receiptImage) {
      showFeedback("Missing Receipt", "Please upload a screenshot of your payment receipt.", "error");
      return;
    }

    setActionLoading('enrolling');
    try {
      const formData = new FormData();
      formData.append('membershipId', selectedPlan._id);
      
      const localUri = receiptImage.uri;
      const filename = localUri.split('/').pop() || `receipt_${user._id}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('receipt', {
        uri: localUri,
        name: filename,
        type: type, 
      });

      const token = await SecureStore.getItemAsync('userToken');

      let response;
      try {
        // Attempt 1
        response = await fetch(`${API_URL}/api/enrollments`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      } catch (networkError) {
        console.log("🔥 First network attempt failed. Warming up and retrying...");
        
        // Wait 1 second to let the network and file system settle
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Attempt 2 (The "Warm" attempt that always works)
        response = await fetch(`${API_URL}/api/enrollments`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      }

      // 👈 THE NEW FIX: Smart Parsing
      const responseText = await response.text(); // 1. Read the raw text first
      let data;
      
      try {
        data = JSON.parse(responseText); // 2. Try to turn it into JSON
      } catch (parseError) {
        // 3. If it is HTML, it will fail and land here instead of crashing the app!
        console.error("🔥 Server sent HTML instead of JSON! Raw output:", responseText);
        throw new Error("Backend crashed! Check your computer's Node.js terminal for the error.");
      }

      if (!response.ok) {
        throw new Error(data.message || JSON.stringify(data));
      }

      setEnrollModalVisible(false);
      setReceiptImage(null);
      setSelectedPlan(null);
      
      showFeedback("Request Sent", "You have successfully requested to join! Waiting for Admin approval.", "success");
      fetchData(); 
    } catch (error) {
      console.log("🔥 Backend Upload Error:", error.message);
      showFeedback("Enrollment Failed", error.message);
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

        {/* 🏆 MY CURRENT PLAN */}
        <Text className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4">My Status</Text>
        
        {myEnrollment ? (
          <View className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 mb-8 shadow-xl">
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-2xl font-black dark:text-white uppercase italic">
                  {myEnrollment.membership?.name || myEnrollment.membership?.planName || "Unknown Plan"}
                </Text>
                <Text className="text-gray-500 font-bold mt-1">
                  Duration: {myEnrollment.membership?.duration} Months
                </Text>
              </View>
              
              <View className={`px-3 py-1 rounded-full border ${myEnrollment.status === 'Active' ? 'bg-green-500/20 border-green-500' : 'bg-orange-500/20 border-orange-500'}`}>
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

        {/* 📋 AVAILABLE PLANS */}
        <Text className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4">Available Plans</Text>
        
        {availablePlans.length === 0 ? (
          <Text className="text-gray-500 text-center italic mt-4">No membership plans available right now.</Text>
        ) : (
          availablePlans.map((plan) => (
            <View key={plan._id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 mb-4 shadow-sm flex-row items-center justify-between">
              
              <View className="flex-1 pr-4">
                <Text className="text-xl font-black dark:text-white uppercase italic">{plan.name || plan.planName}</Text>
                <Text className="text-green-500 font-black text-lg mt-1">Rs. {plan.price}</Text>
                <Text className="text-gray-500 text-sm font-bold mt-1">{plan.duration} Month Access</Text>
              </View>

              <TouchableOpacity 
                // 👈 INSTEAD OF ENROLLING INSTANTLY, WE OPEN THE UPLOAD MODAL
                onPress={() => {
                  setSelectedPlan(plan);
                  setEnrollModalVisible(true);
                }}
                disabled={myEnrollment !== null}
                className={`px-6 py-4 rounded-2xl items-center justify-center shadow-lg ${
                  myEnrollment !== null ? 'bg-gray-300 dark:bg-gray-800 shadow-none' : 'bg-green-500 shadow-green-500/30'
                }`}
              >
                <Text className={myEnrollment !== null ? "text-gray-500 font-black uppercase" : "text-black font-black uppercase"}>
                  {myEnrollment !== null ? 'Locked' : 'Enroll'}
                </Text>
              </TouchableOpacity>
              
            </View>
          ))
        )}
      </ScrollView>

      {/* 🧾 NEW: ENROLLMENT & RECEIPT UPLOAD MODAL */}
      <Modal animationType="slide" transparent={true} visible={enrollModalVisible} onRequestClose={() => setEnrollModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-end">
          <View className="bg-white dark:bg-gray-900 w-full p-6 rounded-t-[40px] border-t border-gray-200 dark:border-gray-800 shadow-2xl">
            
            <View className="items-center mb-6">
              <View className="w-16 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mb-4" />
              <Text className="text-2xl font-black dark:text-white uppercase italic text-center">
                Upload Receipt
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 font-medium">
                Please upload a screenshot of your bank transfer for the {selectedPlan?.name || selectedPlan?.planName} plan.
              </Text>
            </View>

            {/* Image Preview Area */}
            <TouchableOpacity 
              onPress={pickImage}
              className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6 items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden"
            >
              {receiptImage ? (
                <Image source={{ uri: receiptImage.uri }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={48} color="#22c55e" />
                  <Text className="text-gray-500 dark:text-gray-400 font-bold mt-2">Tap to select image</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={submitEnrollment}
              disabled={actionLoading === 'enrolling'}
              className="w-full bg-green-500 py-4 rounded-2xl items-center shadow-lg shadow-green-500/30 mb-3"
            >
              {actionLoading === 'enrolling' ? (
                <ActivityIndicator color="black" />
              ) : (
                <Text className="text-black font-black uppercase">Submit Enrollment</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                setEnrollModalVisible(false);
                setReceiptImage(null);
              }} 
              className="w-full py-4 items-center"
            >
              <Text className="text-red-500 font-bold uppercase">Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* 🟢/🔴 CUSTOM FEEDBACK MODAL (Unchanged) */}
      <Modal animationType="fade" transparent={true} visible={feedback.visible} onRequestClose={() => setFeedback(prev => ({ ...prev, visible: false }))}>
        {/* ... (Your existing feedback modal code remains here exactly as is) ... */}
        <View className="flex-1 bg-black/60 dark:bg-black/80 justify-center items-center px-6">
          <View className="bg-white dark:bg-gray-900 w-full p-8 rounded-[30px] border border-gray-200 dark:border-gray-800 shadow-2xl items-center">
            <View className={`p-4 rounded-full mb-4 ${feedback.type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <Ionicons name={feedback.type === 'success' ? "checkmark-circle" : "alert-circle"} size={50} color={feedback.type === 'success' ? "#22c55e" : "#ef4444"} />
            </View>
            <Text className="text-2xl font-black dark:text-white uppercase italic text-center mb-2">{feedback.title}</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mb-8 font-medium">{feedback.message}</Text>
            <TouchableOpacity onPress={() => setFeedback(prev => ({ ...prev, visible: false }))} className={`w-full py-4 rounded-2xl items-center shadow-lg ${feedback.type === 'success' ? 'bg-green-500 shadow-green-500/30' : 'bg-red-500 shadow-red-500/30'}`}>
              <Text className={feedback.type === 'success' ? "text-black font-black uppercase" : "text-white font-black uppercase"}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}