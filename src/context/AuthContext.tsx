import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials, SignupData, UserRole, DEMO_ACCOUNTS } from '@/types/auth';
import { authApi } from '@/services/authApi';

interface AuthContextType {
  auth: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, isAuthenticated: false, user: null, token: null };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null, token: null };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
};

// Mock user data for demo accounts
const mockUsers: Record<string, User> = {
  'tourist@demo.com': {
    id: '1',
    name: 'Tourist Demo',
    email: 'tourist@demo.com',
    role: 'tourist',
    language: 'en',
    nationality: 'Indian',
    digitalId: 'TRS-2024-001',
    isActive: true,
    createdAt: new Date(),
  },
  'police@demo.com': {
    id: '2',
    name: 'Officer Demo',
    email: 'police@demo.com',
    role: 'police',
    language: 'en',
    isActive: true,
    createdAt: new Date(),
  },
  'tourism@demo.com': {
    id: '3',
    name: 'Tourism Officer',
    email: 'tourism@demo.com',
    role: 'tourism',
    language: 'en',
    isActive: true,
    createdAt: new Date(),
  },
  'admin@demo.com': {
    id: '4',
    name: 'System Admin',
    email: 'admin@demo.com',
    role: 'admin',
    language: 'en',
    isActive: true,
    createdAt: new Date(),
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, dispatch] = useReducer(authReducer, initialState);

  // Load auth state from localStorage on mount with token validation
  useEffect(() => {
    const token = localStorage.getItem('raksha_token');
    const userData = localStorage.getItem('raksha_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        
        // Validate token format (basic check)
        if (token.startsWith('eyJ') || token.startsWith('mock_jwt_token_')) {
          // Check if token is expired (for JWT tokens)
          if (token.startsWith('eyJ')) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const currentTime = Math.floor(Date.now() / 1000);
              
              if (payload.exp && payload.exp < currentTime) {
                // Token expired
                localStorage.removeItem('raksha_token');
                localStorage.removeItem('raksha_user');
                return;
              }
            } catch (error) {
              // Invalid JWT format
              localStorage.removeItem('raksha_token');
              localStorage.removeItem('raksha_user');
              return;
            }
          }
          
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        } else {
          // Invalid token format
          localStorage.removeItem('raksha_token');
          localStorage.removeItem('raksha_user');
        }
      } catch (error) {
        localStorage.removeItem('raksha_token');
        localStorage.removeItem('raksha_user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Try real API first
      const response = await authApi.login(credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        localStorage.setItem('raksha_token', token);
        localStorage.setItem('raksha_user', JSON.stringify(user));
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        return true;
      } else {
        // No fallback to demo accounts - require real authentication
        console.log('API login failed, no fallback allowed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }

    dispatch({ type: 'LOGIN_FAILURE' });
    return false;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Try real API first
      const response = await authApi.register(data);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        localStorage.setItem('raksha_token', token);
        localStorage.setItem('raksha_user', JSON.stringify(user));
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        return true;
      } else {
        // No fallback to mock - require real API registration
        console.log('API registration failed, no fallback allowed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      
      // Show specific error message
      if (error.response?.data?.error) {
        console.error('Registration failed:', error.response.data.error);
      }
      
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('raksha_token');
      localStorage.removeItem('raksha_user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (auth.user) {
      const updatedUser = { ...auth.user, ...updates };
      localStorage.setItem('raksha_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_PROFILE', payload: updates });
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};