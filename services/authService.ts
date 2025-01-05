import api from './api';
import { User } from '../types';

export const authService = {
  login: async (credentials: {
    username: string;
    password: string;
  }): Promise<{ token: string; user: User }> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
    localStorage.removeItem('token');
  },

  refreshToken: async (): Promise<string> => {
    const response = await api.post('/api/auth/refresh');
    return response.data.token;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/api/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/api/auth/reset-password', {
      token,
      new_password: newPassword,
    });
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await api.post('/api/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const response = await api.patch('/api/auth/profile', updates);
    return response.data;
  },
};

export default authService;
