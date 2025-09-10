import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const BLOCKCHAIN_API_BASE_URL = import.meta.env.VITE_BLOCKCHAIN_API_BASE_URL || 'http://localhost:3002/api';

// Types
export interface WalletInfo {
  address: string;
  balance: string;
  nonce: number;
}

export interface DigitalIdentity {
  id: number;
  name: string;
  email: string;
  nationality: string;
  aadhaarHash: string;
  passportHash: string;
  emergencyContact: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isVerified: boolean;
  walletAddress: string;
  roles: string[];
}

export interface CreateIdentityRequest {
  name: string;
  email: string;
  nationality: string;
  aadhaarNumber?: string;
  passportNumber?: string;
  emergencyContact: string;
  roles: string[];
  walletAddress: string;
}

export interface UpdateIdentityRequest {
  name: string;
  email: string;
  nationality: string;
  emergencyContact: string;
  walletAddress: string;
}

export interface BlockchainStats {
  totalIdentities: number;
  activeIdentities: number;
  verifiedIdentities: number;
  totalTransactions: number;
  lastBlockNumber: number;
  contractAddress: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class BlockchainApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BLOCKCHAIN_API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('raksha_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`⛓️ Blockchain API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Blockchain API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ Blockchain API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Blockchain API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Wallet Management
  async generateWallet(): Promise<{ address: string; mnemonic: string }> {
    try {
      const response = await this.api.post('/wallet/generate');
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to generate wallet: ${error.response?.data?.error || error.message}`);
    }
  }

  async getWalletInfo(address: string): Promise<WalletInfo> {
    try {
      const response = await this.api.get(`/wallet/${address}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to get wallet info: ${error.response?.data?.error || error.message}`);
    }
  }

  // Digital Identity Management
  async createIdentity(request: CreateIdentityRequest): Promise<{ identity: DigitalIdentity; txHash: string }> {
    try {
      const response = await this.api.post('/identity/create', request);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to create identity: ${error.response?.data?.error || error.message}`);
    }
  }

  async getIdentityByWallet(address: string): Promise<DigitalIdentity> {
    try {
      const response = await this.api.get(`/identity/wallet/${address}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to get identity: ${error.response?.data?.error || error.message}`);
    }
  }

  async getIdentityById(id: number): Promise<DigitalIdentity> {
    try {
      const response = await this.api.get(`/identity/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to get identity: ${error.response?.data?.error || error.message}`);
    }
  }

  async updateIdentity(id: number, request: UpdateIdentityRequest): Promise<{ identity: DigitalIdentity; txHash: string }> {
    try {
      const response = await this.api.put(`/identity/${id}`, request);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to update identity: ${error.response?.data?.error || error.message}`);
    }
  }

  async verifyIdentity(id: number, verifierAddress: string): Promise<{ txHash: string }> {
    try {
      const response = await this.api.post(`/identity/${id}/verify`, { verifierAddress });
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to verify identity: ${error.response?.data?.error || error.message}`);
    }
  }

  async deactivateIdentity(id: number, walletAddress: string): Promise<{ txHash: string }> {
    try {
      const response = await this.api.post(`/identity/${id}/deactivate`, { walletAddress });
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to deactivate identity: ${error.response?.data?.error || error.message}`);
    }
  }

  // Role Management
  async addRole(id: number, role: string, walletAddress: string): Promise<{ txHash: string }> {
    try {
      const response = await this.api.post(`/identity/${id}/roles`, { role, walletAddress });
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to add role: ${error.response?.data?.error || error.message}`);
    }
  }

  async getRoles(id: number): Promise<{ roles: string[] }> {
    try {
      const response = await this.api.get(`/identity/${id}/roles`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to get roles: ${error.response?.data?.error || error.message}`);
    }
  }

  // QR Code Management
  async generateQRCode(id: number): Promise<{ qrData: string }> {
    try {
      const response = await this.api.post(`/identity/${id}/qr`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to generate QR code: ${error.response?.data?.error || error.message}`);
    }
  }

  async validateQRCode(qrData: string): Promise<{ valid: boolean; identity?: DigitalIdentity }> {
    try {
      const response = await this.api.post('/qr/validate', { qrData });
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to validate QR code: ${error.response?.data?.error || error.message}`);
    }
  }

  // Statistics
  async getStats(): Promise<BlockchainStats> {
    try {
      const response = await this.api.get('/stats');
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to get stats: ${error.response?.data?.error || error.message}`);
    }
  }

  async getVerificationQueue(): Promise<{ queue: any[] }> {
    try {
      const response = await this.api.get('/verification-queue');
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to get verification queue: ${error.response?.data?.error || error.message}`);
    }
  }

  // Utility methods
  isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  formatAddress(address: string): string {
    if (!this.isValidAddress(address)) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  formatBalance(balance: string): string {
    const num = parseFloat(balance);
    if (num < 0.001) return '< 0.001 ETH';
    return `${num.toFixed(4)} ETH`;
  }
}

// Create singleton instance
export const blockchainApi = new BlockchainApiService();

// Export types
export type {
  WalletInfo,
  DigitalIdentity,
  CreateIdentityRequest,
  UpdateIdentityRequest,
  BlockchainStats,
  ApiResponse
};
