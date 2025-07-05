import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthResponse, LoginFormData, SignupFormData, User } from '../types/api';

// API functions
const api = {
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },
  
  signup: async (userData: Omit<SignupFormData, 'confirmPassword'>): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/api/auth/signup', userData);
    return response.data;
  },
  
  getProfile: async (): Promise<User> => {
    const response = await axios.get<{ user: User }>('/api/profile');
    return response.data.user;
  }
};

// Custom hooks
export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginFormData>({
    mutationFn: api.login,
  });
};

export const useSignup = () => {
  return useMutation<AuthResponse, Error, Omit<SignupFormData, 'confirmPassword'>>({
    mutationFn: api.signup,
  });
};

export const useProfile = (enabled: boolean = true) => {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: api.getProfile,
    enabled,
  });
}; 