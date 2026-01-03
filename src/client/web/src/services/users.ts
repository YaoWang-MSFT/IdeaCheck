import api from './auth';
import { User, UserUpdate, ChangePasswordRequest, MessageResponse } from '../types/auth';

// User profile API functions
export const getUserProfile = async (): Promise<User> => {
  const response = await api.get<User>('/api/v1/users/profile');
  return response.data;
};

export const updateUserProfile = async (userData: UserUpdate): Promise<User> => {
  const response = await api.put<User>('/api/v1/users/profile', userData);
  return response.data;
};

export const changePassword = async (passwordData: ChangePasswordRequest): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>('/api/v1/users/change-password', passwordData);
  return response.data;
};

export const deleteAccount = async (): Promise<MessageResponse> => {
  const response = await api.delete<MessageResponse>('/api/v1/users/profile');
  return response.data;
};