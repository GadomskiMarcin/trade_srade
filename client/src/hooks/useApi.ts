import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthResponse, LoginFormData, SignupFormData, TemporaryUserFormData, User, Furniture } from '../types/api';

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
  },
  
  getFurniture: async (tags?: string[]): Promise<{ furniture: Furniture[]; total: number }> => {
    const params = new URLSearchParams();
    if (tags && tags.length > 0) {
      tags.forEach(tag => params.append('tags', tag));
    }
    const response = await axios.get(`/api/furniture?${params.toString()}`);
    return response.data;
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

export const useFurniture = (tags?: string[]) => {
  return useQuery<{ furniture: Furniture[]; total: number }>({
    queryKey: ['furniture', tags],
    queryFn: () => api.getFurniture(tags),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 