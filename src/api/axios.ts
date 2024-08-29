import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'http://13.233.110.164:8090/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to set the Authorization header with the bearer token
api.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('token'); // Get token from Async Storage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from AsyncStorage:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
