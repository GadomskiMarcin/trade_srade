// API Types
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ProfileResponse {
  user: User;
}

export interface ErrorResponse {
  error: string;
}

// API Response Types
export type ApiResponse<T> = T | ErrorResponse;

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Component Props Types
export interface LoginProps {
  onLogin: {
    mutateAsync: (data: LoginFormData) => Promise<AuthResponse>;
    isPending: boolean;
    error: Error | null;
  };
}

export interface SignupProps {
  onSignup: {
    mutateAsync: (data: Omit<SignupFormData, 'confirmPassword'>) => Promise<AuthResponse>;
    isPending: boolean;
    error: Error | null;
  };
}

export interface ProfileProps {
  user: User;
}

export interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

// Router Types
export interface RouterContext {
  queryClient: any; // TanStack Query client type
} 