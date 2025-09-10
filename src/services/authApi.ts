import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const BLOCKCHAIN_API_BASE_URL = import.meta.env.VITE_BLOCKCHAIN_API_BASE_URL || 'http://localhost:3002/api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'police' | 'tourism' | 'tourist';
  language: string;
  nationality: string;
  walletAddress?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  walletAddress?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

class AuthApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BLOCKCHAIN_API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('raksha_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🔐 Auth API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Auth API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ Auth API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Auth API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  }

  // Register user
  async register(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await this.api.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  }

  // Get user profile
  async getProfile(): Promise<AuthResponse> {
    try {
      const response = await this.api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      console.error('Profile fetch failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Profile fetch failed'
      };
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await this.api.put('/auth/profile', updates);
      return response.data;
    } catch (error: any) {
      console.error('Profile update failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Profile update failed'
      };
    }
  }

  // Logout user
  async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.api.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      console.error('Logout failed:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Logout failed'
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('raksha_token');
    return !!token;
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('raksha_token');
  }

  // Set token
  setToken(token: string): void {
    localStorage.setItem('raksha_token', token);
  }

  // Remove token
  removeToken(): void {
    localStorage.removeItem('raksha_token');
    localStorage.removeItem('raksha_user');
  }
}

export const authApi = new AuthApiService();
export default authApi;
