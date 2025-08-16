import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      AsyncStorage.removeItem('access_token');
      // Redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Videos API (now includes AI content generation)
export const videosAPI = {
  // Basic video endpoints
  getVideos: (params?: any) => api.get('/videos/', { params }),
  getVideo: (id: number) => api.get(`/videos/${id}`),
  getVideosByCategory: (category: string, params?: any) => 
    api.get(`/videos/category/${category}/`, { params }),
  searchVideos: (query: string, params?: any) => 
    api.get('/videos/search/', { params: { ...params, q: query } }),
  
  // AI Content Generation endpoints
  generateScript: (data: {
    topic: string;
    category: string;
    difficulty: string;
    target_audience?: string;
    duration_minutes?: number;
    style?: string;
  }) => api.post('/videos/ai/generate-script', data),
  
  createVideoFromScript: (data: {
    script: string;
    title: string;
    category: string;
    difficulty: string;
    voice_settings?: any;
    visual_style?: string;
  }) => api.post('/videos/ai/create-video', data),
  
  generateBatchVideos: (data: {
    topics: string[];
    category: string;
    difficulty: string;
  }) => api.post('/videos/ai/generate-batch', data),
  
  getGenerationStatus: (videoId: number) => 
    api.get(`/videos/ai/generation-status/${videoId}`),
  
  getAIGeneratedVideos: (params?: {
    skip?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
  }) => api.get('/videos/ai/generated', { params }),
  
  getGenerationStats: () => api.get('/videos/ai/stats'),
};

// Users API
export const usersAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateUser: (data: any) => api.put('/users/me', data),
  deleteUser: () => api.delete('/users/me'),
};

export default api; 