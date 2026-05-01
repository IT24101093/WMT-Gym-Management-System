import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';

// ✅ Now using the environment variable! 
// This allows every team member to have their own IP in their own .env file.
// ✅ Now using the environment variable with a fallback for Android Emulators
// 💡 HARDCODED FALLBACK: If .env fails to load, it will use the host IP I found via ipconfig
const BASE_URL = API_URL || 'http://192.168.1.9:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`, 
});

console.log("🌐 API Base URL configured as:", `${BASE_URL}/api`);

// 🛡️ The Interceptor: Automatically attaches the JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token from SecureStore", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;