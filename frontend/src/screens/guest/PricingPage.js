import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '@env';

export default function PricingPage({ navigation }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/memberships`)
      .then(res => res.json())
      .then(data => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
       console.log("Fetch failed. Verify API_URL in .env!");
       setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 pt-4 flex-1"> 
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
          <Ionicons name="arrow-back" size={28} color="#22c55e" />
        </TouchableOpacity>
        
        <Text className="text-4xl font-black dark:text-white mb-6 uppercase italic">
          Elite <Text className="text-green-500">Plans</Text>
        </Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#22c55e" className="mt-20" />
        ) : (
          <FlatList 
            data={plans}
            keyExtractor={(item) => item._id} 
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="bg-gray-100 dark:bg-gray-900 p-8 rounded-[40px] mb-6 border border-gray-200 dark:border-gray-800">
                <Text className="text-green-500 font-black uppercase tracking-widest text-xs">
                  {item.planName}
                </Text>
                
                <Text className="text-5xl font-black dark:text-white my-3">
                  LKR {item.price}
                  <Text className="text-lg text-gray-500 font-medium">/{item.duration}</Text>
                </Text>
                
                <Text className="text-gray-500 dark:text-gray-400 leading-6 mb-6">
                  {item.description || "Full access to all gym facilities and trainers."}
                </Text>
                
                {/* ✅ UPDATED BUTTON TO NAVIGATE TO REGISTER */}
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Register')}
                  className="bg-green-500 py-5 rounded-2xl items-center shadow-lg shadow-green-500/20"
                >
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