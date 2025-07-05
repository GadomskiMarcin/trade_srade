import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthResponse, LoginFormData, SignupFormData, TemporaryUserFormData, User } from '../types/api';

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
  
  temporaryUser: async (userData: TemporaryUserFormData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/api/auth/temporary', userData);
    return response.data;
  },
  
  getProfile: async (): Promise<User> => {
    const response = await axios.get<{ user: User }>('/api/profile');
    return response.data.user;
  }
};

// Custom hooks
export const useLogin = (options?: { onSuccess?: (data: AuthResponse) => void }) => {
  return useMutation<AuthResponse, Error, LoginFormData>({
    mutationFn: api.login,
    onSuccess: options?.onSuccess,
  });
};

export const useSignup = (options?: { onSuccess?: (data: AuthResponse) => void }) => {
  return useMutation<AuthResponse, Error, Omit<SignupFormData, 'confirmPassword'>>({
    mutationFn: api.signup,
    onSuccess: options?.onSuccess,
  });
};

export const useTemporaryUser = (options?: { onSuccess?: (data: AuthResponse) => void }) => {
  return useMutation<AuthResponse, Error, TemporaryUserFormData>({
    mutationFn: api.temporaryUser,
    onSuccess: options?.onSuccess,
  });
};

export const useProfile = (enabled: boolean = true) => {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: api.getProfile,
    enabled,
  });
}; 