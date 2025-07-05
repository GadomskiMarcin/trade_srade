import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '../types/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (): Promise<void> => {
    try {
      const response = await axios.get<{ user: User }>('/api/profile');
      setUser(response.data.user);
    } catch (error) {
      console.warn('Failed to fetch profile:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User, token: string): void => {
    setUser(userData);
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    queryClient.clear();
  };

  return {
    user,
    loading,
    login,
    logout,
    fetchProfile
  };
}; 