import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PricingPage({ navigation }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace 192.168.1.XX with your COMPUTER'S local IP address
    fetch('http://192.168.1.5:5000/api/memberships') 
      .then(res => res.json())
      .then(data => {
        setPlans(data);
        setLoading(false);
      })
      .catch(async (err) => {
       console.log("Fetch failed. Make sure the server is reachable at this IP!");
       setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 pt-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
          <Ionicons name="arrow-back" size={28} color="#22c55e" />
        </TouchableOpacity>
        
        <Text className="text-4xl font-black dark:text-white mb-2 uppercase italic">Elite <Text className="text-green-500">Plans</Text></Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#22c55e" className="mt-20" />
        ) : (
          <FlatList 
  data={plans}
  keyExtractor={(item) => item._id} 
  renderItem={({ item }) => (
    <View className="bg-gray-100 dark:bg-gray-900 p-8 rounded-3xl mb-6 border-2 border-transparent">
      {/* 1. Changed item.name to item.planName */}
      <Text className="text-green-500 font-black uppercase tracking-widest">
        {item.planName}
      </Text>
      
      {/* 2. Added duration display (e.g., $50/month) */}
      <Text className="text-5xl font-black dark:text-white my-3">
        ${item.price}
        <Text className="text-lg text-gray-500 font-medium">/{item.duration}</Text>
      </Text>
      
      {/* 3. Description (Note: Ensure 'description' exists in your model, 
          otherwise it might be blank) */}
      <Text className="text-gray-500 dark:text-gray-400 leading-6 mb-6">
        {item.description || "Full access to all gym facilities and trainers."}
      </Text>
      
      <TouchableOpacity className="bg-green-500 py-4 rounded-xl items-center">
        <Text className="font-black uppercase text-black">Get Started</Text>
      </TouchableOpacity>
    </View>
  )}
/>
        )}
      </View>
    </SafeAreaView>
  );
}