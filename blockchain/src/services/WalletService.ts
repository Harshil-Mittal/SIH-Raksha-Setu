import { ethers } from 'ethers';
import { logger } from '../utils/logger';
import { WalletInfo } from '../types/blockchain';
import * as crypto from 'crypto';

export class WalletService {
  private provider: ethers.Provider;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Generate a new wallet
   */
  generateWallet(): { address: string; privateKey: string; mnemonic: string } {
    try {
      const wallet = ethers.Wallet.createRandom();
      const mnemonic = wallet.mnemonic?.phrase || '';
      
      logger.info('New wallet generated', {
        address: wallet.address
      });

      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic
      };
    } catch (error: any) {
      logger.error('Failed to generate wallet', { error: error.message });
      throw new Error(`Failed to generate wallet: ${error.message}`);
    }
  }

  /**
   * Create wallet from private key
   */
  createWalletFromPrivateKey(privateKey: string): ethers.Wallet {
    try {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      
      logger.info('Wallet created from private key', {
        address: wallet.address
      });

      return wallet;
    } catch (error: any) {
      logger.error('Failed to create wallet from private key', { error: error.message });
      throw new Error(`Invalid private key: ${error.message}`);
    }
  }

  /**
   * Create wallet from mnemonic
   */
  createWalletFromMnemonic(mnemonic: string, index: number = 0): ethers.Wallet {
    try {
      const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
      const wallet = hdNode.deriveChild(index);
      
      logger.info('Wallet created from mnemonic', {
        address: wallet.address,
        index
      });

      return wallet;
    } catch (error: any) {
      logger.error('Failed to create wallet from mnemonic', { error: error.message });
      throw new Error(`Invalid mnemonic: ${error.message}`);
    }
  }

  /**
   * Get wallet information
   */
  async getWalletInfo(address: string): Promise<WalletInfo> {
    try {
      const balance = await this.provider.getBalance(address);
      const nonce = await this.provider.getTransactionCount(address);
      
      return {
        address,
        balance: ethers.formatEther(balance),
        nonce
      };
    } catch (error: any) {
      logger.error('Failed to get wallet info', {
        error: error.message,
        address
      });
      throw new Error(`Failed to get wallet info: ${error.message}`);
    }
  }

  /**
   * Check if address is valid
   */
  isValidAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  }

  /**
   * Sign a message with wallet
   */
  async signMessage(wallet: ethers.Wallet, message: string): Promise<string> {
    try {
      const signature = await wallet.signMessage(message);
      
      logger.info('Message signed', {
        address: wallet.address,
        messageLength: message.length
      });

      return signature;
    } catch (error: any) {
      logger.error('Failed to sign message', {
        error: error.message,
        address: wallet.address
      });
      throw new Error(`Failed to sign message: ${error.message}`);
    }
  }

  /**
   * Verify message signature
   */
  verifyMessage(message: string, signature: string): string | null {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress;
    } catch (error: any) {
      logger.error('Failed to verify message', { error: error.message });
      return null;
    }
  }

  /**
   * Encrypt private key with password
   */
  encryptPrivateKey(privateKey: string, password: string): string {
    try {
      const cipher = crypto.createCipher('aes-256-cbc', password);
      let encrypted = cipher.update(privateKey, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (error: any) {
      logger.error('Failed to encrypt private key', { error: error.message });
      throw new Error(`Failed to encrypt private key: ${error.message}`);
    }
  }

  /**
   * Decrypt private key with password
   */
  decryptPrivateKey(encryptedPrivateKey: string, password: string): string {
    try {
      const decipher = crypto.createDecipher('aes-256-cbc', password);
      let decrypted = decipher.update(encryptedPrivateKey, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error: any) {
      logger.error('Failed to decrypt private key', { error: error.message });
      throw new Error(`Failed to decrypt private key: ${error.message}`);
    }
  }

  /**
   * Generate a secure random password
   */
  generateSecurePassword(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
  }

  /**
   * Get current gas price
   */
  async getGasPrice(): Promise<string> {
    try {
      const feeData = await this.provider.getFeeData();
      return ethers.formatUnits(feeData.gasPrice || 0, 'gwei');
    } catch (error: any) {
      logger.error('Failed to get gas price', { error: error.message });
      return '20'; // Default gas price in gwei
    }
  }

  /**
   * Estimate gas for transaction
   */
  async estimateGas(transaction: any): Promise<bigint> {
    try {
      return await this.provider.estimateGas(transaction);
    } catch (error: any) {
      logger.error('Failed to estimate gas', { error: error.message });
      throw new Error(`Failed to estimate gas: ${error.message}`);
    }
  }

  /**
   * Get network information
   */
  async getNetworkInfo(): Promise<{ chainId: number; name: string }> {
    try {
      const network = await this.provider.getNetwork();
      return {
        chainId: Number(network.chainId),
        name: network.name
      };
    } catch (error: any) {
      logger.error('Failed to get network info', { error: error.message });
      throw new Error(`Failed to get network info: ${error.message}`);
    }
  }
}
