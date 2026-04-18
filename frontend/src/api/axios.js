import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ⚠️ IMPORTANT: Replace this with your computer's actual Wi-Fi IP Address!
// Keep the :5000/api at the end, as that matches your Node backend.
const BASE_URL = 'http://192.168.1.5:5000/api'; 

const api = axios.create({
  baseURL: BASE_URL,
});

// 🛡️ The Interceptor: This automatically attaches the user's JWT token 
// to EVERY request so you don't have to do it manually in your screens!
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