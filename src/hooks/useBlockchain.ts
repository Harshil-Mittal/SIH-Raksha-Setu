import { useState, useCallback, useEffect } from 'react';
import { 
  blockchainApi,
  WalletInfo,
  DigitalIdentity,
  CreateIdentityRequest,
  UpdateIdentityRequest,
  BlockchainStats
} from '@/services/blockchainApi';

interface UseBlockchainReturn {
  // State
  wallet: WalletInfo | null;
  identity: DigitalIdentity | null;
  stats: BlockchainStats | null;
  isLoading: boolean;
  error: string | null;

  // Wallet functions
  generateWallet: () => Promise<{ address: string; mnemonic: string }>;
  loadWallet: (address: string) => Promise<void>;
  isValidAddress: (address: string) => boolean;
  formatAddress: (address: string) => string;
  formatBalance: (balance: string) => string;

  // Identity functions
  createIdentity: (request: CreateIdentityRequest) => Promise<{ identity: DigitalIdentity; txHash: string }>;
  updateIdentity: (id: number, request: UpdateIdentityRequest) => Promise<{ identity: DigitalIdentity; txHash: string }>;
  loadIdentity: (address: string) => Promise<void>;
  verifyIdentity: (id: number, verifierAddress: string) => Promise<{ txHash: string }>;
  deactivateIdentity: (id: number, walletAddress: string) => Promise<{ txHash: string }>;

  // Role functions
  addRole: (id: number, role: string, walletAddress: string) => Promise<{ txHash: string }>;
  getRoles: (id: number) => Promise<string[]>;

  // QR Code functions
  generateQRCode: (id: number) => Promise<{ qrData: string }>;
  validateQRCode: (qrData: string) => Promise<{ valid: boolean; identity?: DigitalIdentity }>;

  // Stats functions
  loadStats: () => Promise<void>;

  // Utility functions
  clearError: () => void;
  hasIdentity: boolean;
}

export const useBlockchain = (): UseBlockchainReturn => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [identity, setIdentity] = useState<DigitalIdentity | null>(null);
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Wallet functions
  const generateWallet = useCallback(async (): Promise<{ address: string; mnemonic: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await blockchainApi.generateWallet();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadWallet = useCallback(async (address: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const walletInfo = await blockchainApi.getWalletInfo(address);
      setWallet(walletInfo);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isValidAddress = useCallback((address: string): boolean => {
    return blockchainApi.isValidAddress(address);
  }, []);

  const formatAddress = useCallback((address: string): string => {
    return blockchainApi.formatAddress(address);
  }, []);

  const formatBalance = useCallback((balance: string): string => {
    return blockchainApi.formatBalance(balance);
  }, []);

  // Identity functions
  const createIdentity = useCallback(async (request: CreateIdentityRequest): Promise<{ identity: DigitalIdentity; txHash: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await blockchainApi.createIdentity(request);
      setIdentity(result.identity);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateIdentity = useCallback(async (id: number, request: UpdateIdentityRequest): Promise<{ identity: DigitalIdentity; txHash: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await blockchainApi.updateIdentity(id, request);
      setIdentity(result.identity);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadIdentity = useCallback(async (address: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const identityData = await blockchainApi.getIdentityByWallet(address);
      setIdentity(identityData);
    } catch (err: any) {
      if (err.message.includes('not found')) {
        setIdentity(null);
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyIdentity = useCallback(async (id: number, verifierAddress: string): Promise<{ txHash: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await blockchainApi.verifyIdentity(id, verifierAddress);
      // Reload identity to get updated verification status
      if (identity) {
        await loadIdentity(identity.walletAddress);
      }
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [identity, loadIdentity]);

  const deactivateIdentity = useCallback(async (id: number, walletAddress: string): Promise<{ txHash: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await blockchainApi.deactivateIdentity(id, walletAddress);
      setIdentity(null);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Role functions
  const addRole = useCallback(async (id: number, role: string, walletAddress: string): Promise<{ txHash: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await blockchainApi.addRole(id, role, walletAddress);
      // Reload identity to get updated roles
      if (identity) {
        await loadIdentity(identity.walletAddress);
      }
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [identity, loadIdentity]);

  const getRoles = useCallback(async (id: number): Promise<string[]> => {
    try {
      const result = await blockchainApi.getRoles(id);
      return result.roles;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  // QR Code functions
  const generateQRCode = useCallback(async (id: number): Promise<{ qrData: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await blockchainApi.generateQRCode(id);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateQRCode = useCallback(async (qrData: string): Promise<{ valid: boolean; identity?: DigitalIdentity }> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await blockchainApi.validateQRCode(qrData);
      return result;
    } catch (err: any) {
      setError(err.message);
      return { valid: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stats functions
  const loadStats = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const statsData = await blockchainApi.getStats();
      setStats(statsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    // State
    wallet,
    identity,
    stats,
    isLoading,
    error,

    // Wallet functions
    generateWallet,
    loadWallet,
    isValidAddress,
    formatAddress,
    formatBalance,

    // Identity functions
    createIdentity,
    updateIdentity,
    loadIdentity,
    verifyIdentity,
    deactivateIdentity,

    // Role functions
    addRole,
    getRoles,

    // QR Code functions
    generateQRCode,
    validateQRCode,

    // Stats functions
    loadStats,

    // Utility functions
    clearError,
    hasIdentity: !!identity
  };
};

// Hook for wallet management only
export const useWallet = () => {
  const { 
    wallet, 
    isLoading, 
    error, 
    generateWallet, 
    loadWallet, 
    isValidAddress, 
    formatAddress, 
    formatBalance,
    clearError 
  } = useBlockchain();

  return {
    wallet,
    isLoading,
    error,
    generateWallet,
    loadWallet,
    isValidAddress,
    formatAddress,
    formatBalance,
    clearError
  };
};

// Hook for digital identity management only
export const useDigitalIdentity = () => {
  const { 
    identity, 
    isLoading, 
    error, 
    createIdentity, 
    updateIdentity, 
    loadIdentity, 
    verifyIdentity, 
    deactivateIdentity,
    addRole,
    getRoles,
    generateQRCode,
    validateQRCode,
    hasIdentity,
    clearError 
  } = useBlockchain();

  return {
    identity,
    isLoading,
    error,
    createIdentity,
    updateIdentity,
    loadIdentity,
    verifyIdentity,
    deactivateIdentity,
    addRole,
    getRoles,
    generateQRCode,
    validateQRCode,
    hasIdentity,
    clearError
  };
};
