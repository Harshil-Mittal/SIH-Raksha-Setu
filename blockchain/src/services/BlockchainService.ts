import { ethers } from 'ethers';
import { logger } from '../utils/logger';
import { DigitalIDContract } from '../contracts/DigitalIDContract';
import { IdentityData, CreateIdentityRequest, UpdateIdentityRequest } from '../types/blockchain';

export class BlockchainService {
  private provider: ethers.Provider;
  private wallet: ethers.Wallet;
  private contract: DigitalIDContract;
  private contractAddress: string;

  constructor(
    rpcUrl: string,
    privateKey: string,
    contractAddress: string,
    contractABI: any
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contractAddress = contractAddress;
    this.contract = new ethers.Contract(
      contractAddress,
      contractABI,
      this.wallet
    ) as DigitalIDContract;
  }

  /**
   * Create a new digital identity on the blockchain
   */
  async createIdentity(request: CreateIdentityRequest): Promise<string> {
    try {
      logger.info('Creating digital identity on blockchain', {
        email: request.email,
        name: request.name
      });

      const tx = await this.contract.createIdentity(
        request.name,
        request.email,
        request.nationality,
        request.aadhaarHash || '',
        request.passportHash || '',
        request.emergencyContact,
        request.roles
      );

      const receipt = await tx.wait();
      
      logger.info('Digital identity created successfully', {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      });

      return receipt.hash;
    } catch (error: any) {
      logger.error('Failed to create digital identity', {
        error: error.message,
        email: request.email
      });
      throw new Error(`Blockchain transaction failed: ${error.message}`);
    }
  }

  /**
   * Update an existing digital identity
   */
  async updateIdentity(id: number, request: UpdateIdentityRequest): Promise<string> {
    try {
      logger.info('Updating digital identity on blockchain', { id });

      const tx = await this.contract.updateIdentity(
        id,
        request.name,
        request.email,
        request.nationality,
        request.emergencyContact
      );

      const receipt = await tx.wait();
      
      logger.info('Digital identity updated successfully', {
        id,
        txHash: receipt.hash
      });

      return receipt.hash;
    } catch (error: any) {
      logger.error('Failed to update digital identity', {
        error: error.message,
        id
      });
      throw new Error(`Blockchain transaction failed: ${error.message}`);
    }
  }

  /**
   * Get digital identity by wallet address
   */
  async getIdentityByWallet(walletAddress: string): Promise<IdentityData | null> {
    try {
      const identity = await this.contract.getIdentityByWallet(walletAddress);
      return this.mapContractIdentityToData(identity);
    } catch (error: any) {
      if (error.message.includes('Identity not found')) {
        return null;
      }
      logger.error('Failed to get identity by wallet', {
        error: error.message,
        walletAddress
      });
      throw new Error(`Failed to fetch identity: ${error.message}`);
    }
  }

  /**
   * Get digital identity by ID
   */
  async getIdentityById(id: number): Promise<IdentityData | null> {
    try {
      const identity = await this.contract.getIdentityById(id);
      return this.mapContractIdentityToData(identity);
    } catch (error: any) {
      if (error.message.includes('Identity does not exist')) {
        return null;
      }
      logger.error('Failed to get identity by ID', {
        error: error.message,
        id
      });
      throw new Error(`Failed to fetch identity: ${error.message}`);
    }
  }

  /**
   * Check if wallet has an identity
   */
  async hasIdentity(walletAddress: string): Promise<boolean> {
    try {
      return await this.contract.hasIdentity(walletAddress);
    } catch (error: any) {
      logger.error('Failed to check identity existence', {
        error: error.message,
        walletAddress
      });
      return false;
    }
  }

  /**
   * Verify an identity (admin only)
   */
  async verifyIdentity(id: number): Promise<string> {
    try {
      const tx = await this.contract.verifyIdentity(id);
      const receipt = await tx.wait();
      
      logger.info('Identity verified successfully', {
        id,
        txHash: receipt.hash
      });

      return receipt.hash;
    } catch (error: any) {
      logger.error('Failed to verify identity', {
        error: error.message,
        id
      });
      throw new Error(`Failed to verify identity: ${error.message}`);
    }
  }

  /**
   * Deactivate an identity
   */
  async deactivateIdentity(id: number): Promise<string> {
    try {
      const tx = await this.contract.deactivateIdentity(id);
      const receipt = await tx.wait();
      
      logger.info('Identity deactivated successfully', {
        id,
        txHash: receipt.hash
      });

      return receipt.hash;
    } catch (error: any) {
      logger.error('Failed to deactivate identity', {
        error: error.message,
        id
      });
      throw new Error(`Failed to deactivate identity: ${error.message}`);
    }
  }

  /**
   * Add role to identity
   */
  async addRole(id: number, role: string): Promise<string> {
    try {
      const tx = await this.contract.addRole(id, role);
      const receipt = await tx.wait();
      
      logger.info('Role added successfully', {
        id,
        role,
        txHash: receipt.hash
      });

      return receipt.hash;
    } catch (error: any) {
      logger.error('Failed to add role', {
        error: error.message,
        id,
        role
      });
      throw new Error(`Failed to add role: ${error.message}`);
    }
  }

  /**
   * Remove role from identity
   */
  async removeRole(id: number, roleIndex: number): Promise<string> {
    try {
      const tx = await this.contract.removeRole(id, roleIndex);
      const receipt = await tx.wait();
      
      logger.info('Role removed successfully', {
        id,
        roleIndex,
        txHash: receipt.hash
      });

      return receipt.hash;
    } catch (error: any) {
      logger.error('Failed to remove role', {
        error: error.message,
        id,
        roleIndex
      });
      throw new Error(`Failed to remove role: ${error.message}`);
    }
  }

  /**
   * Get total number of identities
   */
  async getTotalIdentities(): Promise<number> {
    try {
      const total = await this.contract.getTotalIdentities();
      return Number(total);
    } catch (error: any) {
      logger.error('Failed to get total identities', { error: error.message });
      return 0;
    }
  }

  /**
   * Get identity roles
   */
  async getIdentityRoles(id: number): Promise<string[]> {
    try {
      return await this.contract.getIdentityRoles(id);
    } catch (error: any) {
      logger.error('Failed to get identity roles', {
        error: error.message,
        id
      });
      return [];
    }
  }

  /**
   * Check if identity has specific role
   */
  async hasRole(id: number, role: string): Promise<boolean> {
    try {
      return await this.contract.hasRole(id, role);
    } catch (error: any) {
      logger.error('Failed to check role', {
        error: error.message,
        id,
        role
      });
      return false;
    }
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return this.contractAddress;
  }

  /**
   * Get current block number
   */
  async getCurrentBlockNumber(): Promise<number> {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      return blockNumber;
    } catch (error: any) {
      logger.error('Failed to get current block number', { error: error.message });
      return 0;
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash: string): Promise<any> {
    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error: any) {
      logger.error('Failed to get transaction receipt', {
        error: error.message,
        txHash
      });
      throw new Error(`Failed to get transaction receipt: ${error.message}`);
    }
  }

  /**
   * Map contract identity to data structure
   */
  private mapContractIdentityToData(contractIdentity: any): IdentityData {
    return {
      id: Number(contractIdentity.id),
      name: contractIdentity.name,
      email: contractIdentity.email,
      nationality: contractIdentity.nationality,
      aadhaarHash: contractIdentity.aadhaarHash,
      passportHash: contractIdentity.passportHash,
      emergencyContact: contractIdentity.emergencyContact,
      createdAt: new Date(Number(contractIdentity.createdAt) * 1000),
      updatedAt: new Date(Number(contractIdentity.updatedAt) * 1000),
      isActive: contractIdentity.isActive,
      isVerified: contractIdentity.isVerified,
      walletAddress: contractIdentity.walletAddress,
      roles: contractIdentity.roles
    };
  }
}
