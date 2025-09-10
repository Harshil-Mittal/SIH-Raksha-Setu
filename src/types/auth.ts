export type UserRole = 'tourist' | 'police' | 'tourism' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  language: string;
  nationality?: string;
  digitalId?: string;
  emergencyContacts?: string; // encrypted
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  language: string;
  nationality?: string;
}

// Mock demo accounts
export const DEMO_ACCOUNTS: Record<UserRole, LoginCredentials> = {
  tourist: { email: 'tourist@demo.com', password: 'demo123' },
  police: { email: 'police@demo.com', password: 'demo123' },
  tourism: { email: 'tourism@demo.com', password: 'demo123' },
  admin: { email: 'admin@demo.com', password: 'demo123' },
};