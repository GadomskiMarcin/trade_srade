import React from 'react';
import { createRootRoute, createRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import { useLogin, useSignup, useProfile } from './hooks/useApi';
import { AuthResponse } from './types/api';
import './App.css';

// Set default axios base URL
axios.defaults.baseURL = 'http://localhost:8080';

// Create routes
const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginComponent,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupComponent,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfileComponent,
});

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, loginRoute, signupRoute, profileRoute]);

// Root component with authentication logic
function RootComponent(): React.JSX.Element {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Initializing..." />;
  }

  return (
    <div className="App">
      <Navbar user={user} onLogout={logout} />
      <Outlet />
    </div>
  );
}

// Index component - redirects based on auth status
function IndexComponent(): null {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    if (token) {
      navigate({ to: '/profile' });
    } else {
      navigate({ to: '/login' });
    }
  }, [token, navigate]);

  return null;
}

// Login component with TanStack Query
function LoginComponent(): React.JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const loginMutation = useLogin();

  React.useEffect(() => {
    if (token) {
      navigate({ to: '/profile' });
    }
  }, [token, navigate]);

  // Login success handler - currently not used but kept for future use
  const _handleLoginSuccess = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    queryClient.setQueryData(['user'], data.user);
    navigate({ to: '/profile' });
  };

  return <Login onLogin={loginMutation} />;
}

// Signup component with TanStack Query
function SignupComponent(): React.JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const signupMutation = useSignup();

  React.useEffect(() => {
    if (token) {
      navigate({ to: '/profile' });
    }
  }, [token, navigate]);

  // Signup success handler - currently not used but kept for future use
  const _handleSignupSuccess = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    queryClient.setQueryData(['user'], data.user);
    navigate({ to: '/profile' });
  };

  return <Signup onSignup={signupMutation} />;
}

// Profile component with TanStack Query
function ProfileComponent(): React.JSX.Element | null {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { data: user, isLoading, error } = useProfile(!!token);

  React.useEffect(() => {
    if (!token) {
      navigate({ to: '/login' });
    }
  }, [token, navigate]);

  if (!token) return null;
  if (isLoading) return <LoadingSpinner message="Loading profile..." />;
  if (error) {
    localStorage.removeItem('token');
    navigate({ to: '/login' });
    return null;
  }

  return user ? <Profile user={user} /> : null;
}

// Export the route tree for the router
export default routeTree; 