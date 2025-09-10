import axios from 'axios';

const BLOCKCHAIN_API_BASE_URL = import.meta.env.VITE_BLOCKCHAIN_API_BASE_URL || 'http://localhost:3002/api';

interface DigitalIDData {
  userId: string;
  name: string;
  email: string;
  role: string;
  walletAddress: string;
}

interface DigitalIDResponse {
  success: boolean;
  data?: {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    walletAddress: string;
    timestamp: number;
    hash: string;
    verified: boolean;
  };
  error?: string;
}

interface WalletResponse {
  success: boolean;
  data?: {
    address: string;
    mnemonic: string;
  };
  error?: string;
}

class BlockchainService {
  private api = axios.create({
    baseURL: BLOCKCHAIN_API_BASE_URL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  });

  // Generate a new wallet
  async generateWallet(): Promise<WalletResponse> {
    try {
      const response = await this.api.post('/wallet/generate');
      return response.data;
    } catch (error: any) {
      console.error('Wallet generation failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to generate wallet'
      };
    }
  }

  // Create a digital ID
  async createDigitalID(data: DigitalIDData): Promise<DigitalIDResponse> {
    try {
      const response = await this.api.post('/digital-id/create', data);
      return response.data;
    } catch (error: any) {
      console.error('Digital ID creation failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create digital ID'
      };
    }
  }

  // Get blockchain stats
  async getStats() {
    try {
      const response = await this.api.get('/stats');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get blockchain stats:', error);
      return null;
    }
  }

  // Get all digital IDs
  async getDigitalIDs() {
    try {
      const response = await this.api.get('/digital-ids');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get digital IDs:', error);
      return null;
    }
  }
}

export const blockchainService = new BlockchainService();
