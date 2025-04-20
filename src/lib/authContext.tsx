
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User type for our authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Auth state interface
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

// Auth context interface
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
};

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthState>(initialState);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // In a real app, you would validate the token with your backend
          // For now, we'll just parse the stored user data
          const userData = localStorage.getItem('user_data');
          if (userData) {
            const user = JSON.parse(userData) as User;
            setAuth({
              isAuthenticated: true,
              user,
              token,
              loading: false,
            });
          } else {
            // Invalid state - token exists but no user data
            handleLogout();
          }
        } catch (error) {
          console.error('Auth error:', error);
          handleLogout();
        }
      } else {
        setAuth(prev => ({ ...prev, loading: false }));
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would make an API request to authenticate
      // For demo purposes, we'll simulate a successful response with a fake token
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email.includes('@') && password.length >= 6) {
        const fakeToken = 'jwt_' + Math.random().toString(36).substring(2);
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          role: 'teacher',
        };
        
        // Save auth data
        localStorage.setItem('auth_token', fakeToken);
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        
        // Update state
        setAuth({
          isAuthenticated: true,
          user: mockUser,
          token: fakeToken,
          loading: false,
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
    });
  };

  // Combine state and functions for context value
  const value = {
    ...auth,
    login,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
