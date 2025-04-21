
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
  hasRole: (role: string) => boolean;
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

// Secure cookie options
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

// Helper functions for secure cookies
const setCookie = (name: string, value: string, maxAge: number = COOKIE_MAX_AGE) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; samesite=strict; secure`;
};

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; max-age=0; path=/; samesite=strict; secure`;
};

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthState>(initialState);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Get token from HTTPOnly cookie instead of localStorage
      const token = getCookie('auth_token');
      
      if (token) {
        try {
          // In a real app, you would validate the token with your backend
          // For now, we'll just parse the stored user data safely
          const userData = getCookie('user_data');
          if (userData) {
            try {
              const user = JSON.parse(userData) as User;
              setAuth({
                isAuthenticated: true,
                user,
                token,
                loading: false,
              });
            } catch (error) {
              console.error('Error parsing user data:', error);
              handleLogout();
            }
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

  // Login function with improved security
  const login = async (email: string, password: string) => {
    try {
      // Validate inputs to prevent injection attacks
      if (!validateEmail(email) || !validatePassword(password)) {
        throw new Error('Invalid credentials format');
      }

      // In a real app, you would make an API request to authenticate
      // For demo purposes, we'll simulate a successful response with a fake token
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email.includes('@') && password.length >= 6) {
        // Generate token with expiration (JWT would include exp claim)
        const fakeToken = 'jwt_' + Math.random().toString(36).substring(2);
        const mockUser: User = {
          id: '1',
          email: sanitizeInput(email),
          name: sanitizeInput(email.split('@')[0]),
          role: 'teacher',
        };
        
        // Save auth data in HttpOnly cookies instead of localStorage
        setCookie('auth_token', fakeToken);
        setCookie('user_data', JSON.stringify(mockUser));
        
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
    // Remove cookies instead of localStorage items
    deleteCookie('auth_token');
    deleteCookie('user_data');
    
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
    });
  };

  // Role check function
  const hasRole = (role: string): boolean => {
    return auth.user?.role === role;
  };

  // Input validation helpers
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return typeof password === 'string' && password.length >= 6;
  };

  // Sanitize user inputs
  const sanitizeInput = (input: string): string => {
    // Basic XSS prevention
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Combine state and functions for context value
  const value = {
    ...auth,
    login,
    logout: handleLogout,
    hasRole,
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
