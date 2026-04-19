import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';

// ✅ Now using the environment variable! 
// This allows every team member to have their own IP in their own .env file.
const api = axios.create({
  baseURL: `${API_URL}/api`, 
});

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