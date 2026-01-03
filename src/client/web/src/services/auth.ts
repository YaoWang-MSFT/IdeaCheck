import axios from 'axios';
import { LoginRequest, SignupRequest, AuthResponse, User, MessageResponse } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'ideacheck_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  delete api.defaults.headers.common['Authorization'];
};

// Initialize auth header if token exists
const existingToken = getToken();
if (existingToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}

// Authentication API functions
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/v1/auth/login', credentials);
  return response.data;
};

export const signup = async (userData: SignupRequest): Promise<User> => {
  const response = await api.post<User>('/api/v1/auth/register', userData);
  return response.data;
};

export const logout = async (): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>('/api/v1/auth/logout');
  return response.data;
};

// User API functions  
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/api/v1/users/profile');
  return response.data;
};

// Auth utilities
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

export const handleAuthError = (error: any): string => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default api;