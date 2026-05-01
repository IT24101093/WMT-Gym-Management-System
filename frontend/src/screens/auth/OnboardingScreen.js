import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

const { height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const { colorScheme, setColorScheme } = useColorScheme();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Trigger animation whenever the step changes
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, [step]);

  const nextStep = () => setStep(step + 1);

  return (
    <View className="flex-1 bg-white dark:bg-black px-8 pt-20 pb-12 justify-between">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* TEXT SECTION */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          {step === 1 ? "Unleash" : step === 2 ? "Choose" : "Join the"}
        </Text>
        <Text className="text-6xl font-black text-green-500 italic uppercase">
          {step === 1 ? "Potential" : step === 2 ? "Your Vibe" : "Elite"}
        </Text>
        <Text className="text-lg text-slate-500 dark:text-slate-400 mt-4 font-semibold">
          {step === 1 && "The ultimate fitness experience starts here."}
          {step === 2 && "Pick a theme that matches your energy."}
          {step === 3 && "Sign up to track workouts or explore first."}
        </Text>
      </Animated.View>

      {/* THEME SELECTOR (Step 2) */}
      <View className="h-40 justify-center">
        {step === 2 && (
          <View className="flex-row space-x-4">
            <TouchableOpacity 
              onPress={() => setColorScheme('light')}
              className={`flex-1 py-10 rounded-3xl items-center border-4 ${colorScheme === 'light' ? 'border-green-500 bg-slate-50' : 'border-transparent bg-slate-900'}`}
            >
              <Text className="text-5xl mb-2">☀️</Text>
              <Text className={`font-bold ${colorScheme === 'light' ? 'text-black' : 'text-slate-500'}`}>Light</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setColorScheme('dark')}
              className={`flex-1 py-10 rounded-3xl items-center border-4 ${colorScheme === 'dark' ? 'border-green-500 bg-slate-900' : 'border-transparent bg-slate-50'}`}
            >
              <Text className="text-5xl mb-2">🌙</Text>
              <Text className={`font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-slate-500'}`}>Dark</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* BUTTONS */}
      <View className="w-full">
        {step < 3 ? (
          <TouchableOpacity 
            onPress={nextStep}
            className="w-full bg-green-500 py-6 rounded-2xl items-center shadow-xl"
          >
            <Text className="text-black text-xl font-extrabold uppercase">Next Step</Text>
          </TouchableOpacity>
        ) : (
          <View className="space-y-4">
            <TouchableOpacity 
              onPress={() => navigation.navigate('Register')}
              className="w-full bg-green-500 py-6 rounded-2xl items-center mb-4"
            >
              <Text className="text-black text-xl font-extrabold uppercase">Sign Up</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              className="w-full border-2 border-slate-300 dark:border-slate-700 py-6 rounded-2xl items-center mb-6"
            >
              <Text className="text-slate-900 dark:text-white text-xl font-bold">Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('GuestTabs')}
              className="items-center"
            >
              <Text className="text-slate-400 font-bold underline text-lg text-center">Skip for Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}