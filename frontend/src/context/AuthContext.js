import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../api/axios';

// 1. Create the Context
export const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // When the app starts, check if a token is already saved on the phone
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const userInfo = await SecureStore.getItemAsync('userInfo');
      
      if (token && userInfo) {
        setUser(JSON.parse(userInfo)); // Automatically log them in!
      }
    } catch (error) {
      console.error('Error reading from SecureStore:', error);
    } finally {
      setIsLoading(false); // Tell the app we finished checking
    }
  };

  // The Login Function
  const login = async (email, password) => {
    try {
      // Calls your backend route: POST /api/users/login
      const response = await api.post('/users/login', { email, password });
      
      // Destructure the token and the rest of the user data (name, role, bmi, etc.)
      const { token, ...userData } = response.data;
      
      // Save to phone storage
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(userData));
      
      // Update global state
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Something went wrong during login' 
      };
    }
  };

  // The Logout Function
  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};