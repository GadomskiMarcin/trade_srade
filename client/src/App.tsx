import React from 'react';
import { createRootRoute, createRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import { useLogin, useSignup, useTemporaryUser, useProfile } from './hooks/useApi';
import { AuthResponse } from './types/api';
import { config } from './config';
import './styles/base.css';

// Set axios base URL from configuration
axios.defaults.baseURL = config.apiUrl;

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

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardComponent,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfileComponent,
});

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, loginRoute, signupRoute, dashboardRoute, profileRoute]);

// Root component with authentication logic
function RootComponent(): React.JSX.Element {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Initializing..." />;
  }

  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

// Index component - redirects to dashboard (guest or logged in)
function IndexComponent(): null {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Always go to dashboard, regardless of auth status
    navigate({ to: '/dashboard' });
  }, [navigate]);

  return null;
}

// Login component with TanStack Query
function LoginComponent(): React.JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const token = localStorage.getItem('token');
  
  const loginMutation = useLogin({
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      queryClient.setQueryData(['user'], data.user);
      login(data.user, data.token);
      navigate({ to: '/dashboard' });
    },
  });
  
  const temporaryUserMutation = useTemporaryUser({
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      queryClient.setQueryData(['user'], data.user);
      login(data.user, data.token);
      navigate({ to: '/dashboard' });
    },
  });

  React.useEffect(() => {
    if (token) {
      navigate({ to: '/dashboard' });
    }
  }, [token, navigate]);

  return <Login onLogin={loginMutation} onTemporaryUser={temporaryUserMutation} />;
}

// Signup component with TanStack Query
function SignupComponent(): React.JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const token = localStorage.getItem('token');
  
  const signupMutation = useSignup({
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      queryClient.setQueryData(['user'], data.user);
      login(data.user, data.token);
      navigate({ to: '/dashboard' });
    },
  });

  React.useEffect(() => {
    if (token) {
      navigate({ to: '/dashboard' });
    }
  }, [token, navigate]);

  return <Signup onSignup={signupMutation} />;
}

// Dashboard component with TanStack Query - now accessible to guests
function DashboardComponent(): React.JSX.Element {
  const navigate = useNavigate();
  const { logout, isGuest } = useAuth();
  const token = localStorage.getItem('token');
  const { data: user, isLoading, error } = useProfile(!!token);

  // If user is logged in but profile fetch fails, clear token and stay in guest mode
  React.useEffect(() => {
    if (token && error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token, error]);

  // Show loading only if we're trying to fetch user data
  if (token && isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return <Dashboard user={user} onLogout={logout} isGuest={isGuest} />;
}

// Profile component with TanStack Query - requires authentication
function ProfileComponent(): React.JSX.Element | null {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { data: user, isLoading, error } = useProfile(!!token);

  React.useEffect(() => {
    if (!token) {
      navigate({ to: '/dashboard' });
    }
  }, [token, navigate]);

  if (!token) return null;
  if (isLoading) return <LoadingSpinner message="Loading profile..." />;
  if (error) {
    localStorage.removeItem('token');
    navigate({ to: '/dashboard' });
    return null;
  }

  return user ? <Profile user={user} /> : null;
}

// Export the route tree for the router
export default routeTree; 