import { BlockchainService } from './BlockchainService';
import { WalletService } from './WalletService';
import { logger } from '../utils/logger';
import { 
  IdentityData, 
  CreateIdentityRequest, 
  UpdateIdentityRequest,
  BlockchainStats,
  IdentityVerification
} from '../types/blockchain';
import * as crypto from 'crypto';

export class DigitalIDService {
  private blockchainService: BlockchainService;
  private walletService: WalletService;
  private verificationQueue: Map<number, IdentityVerification> = new Map();

  constructor(
    blockchainService: BlockchainService,
    walletService: WalletService
  ) {
    this.blockchainService = blockchainService;
    this.walletService = walletService;
  }

  /**
   * Create a new digital identity
   */
  async createDigitalIdentity(
    request: CreateIdentityRequest,
    walletAddress: string
  ): Promise<{ identity: IdentityData; txHash: string }> {
    try {
      logger.info('Creating digital identity', {
        email: request.email,
        walletAddress
      });

      // Hash sensitive data for privacy
      const hashedRequest = {
        ...request,
        aadhaarHash: request.aadhaarHash ? this.hashData(request.aadhaarHash) : '',
        passportHash: request.passportHash ? this.hashData(request.passportHash) : ''
      };

      // Create identity on blockchain
      const txHash = await this.blockchainService.createIdentity(hashedRequest);

      // Get the created identity
      const identity = await this.blockchainService.getIdentityByWallet(walletAddress);
      
      if (!identity) {
        throw new Error('Failed to retrieve created identity');
      }

      // Add to verification queue
      this.verificationQueue.set(identity.id, {
        identityId: identity.id,
        verifierAddress: '',
        verificationDate: new Date(),
        status: 'pending'
      });

      logger.info('Digital identity created successfully', {
        id: identity.id,
        txHash,
        walletAddress
      });

      return { identity, txHash };
    } catch (error: any) {
      logger.error('Failed to create digital identity', {
        error: error.message,
        email: request.email,
        walletAddress
      });
      throw new Error(`Failed to create digital identity: ${error.message}`);
    }
  }

  /**
   * Update digital identity
   */
  async updateDigitalIdentity(
    id: number,
    request: UpdateIdentityRequest,
    walletAddress: string
  ): Promise<{ identity: IdentityData; txHash: string }> {
    try {
      logger.info('Updating digital identity', { id, walletAddress });

      // Verify ownership
      const existingIdentity = await this.blockchainService.getIdentityById(id);
      if (!existingIdentity || existingIdentity.walletAddress !== walletAddress) {
        throw new Error('Unauthorized: Not the identity owner');
      }

      // Update identity on blockchain
      const txHash = await this.blockchainService.updateIdentity(id, request);

      // Get updated identity
      const identity = await this.blockchainService.getIdentityById(id);
      
      if (!identity) {
        throw new Error('Failed to retrieve updated identity');
      }

      logger.info('Digital identity updated successfully', {
        id,
        txHash,
        walletAddress
      });

      return { identity, txHash };
    } catch (error: any) {
      logger.error('Failed to update digital identity', {
        error: error.message,
        id,
        walletAddress
      });
      throw new Error(`Failed to update digital identity: ${error.message}`);
    }
  }

  /**
   * Get digital identity by wallet address
   */
  async getDigitalIdentity(walletAddress: string): Promise<IdentityData | null> {
    try {
      return await this.blockchainService.getIdentityByWallet(walletAddress);
    } catch (error: any) {
      logger.error('Failed to get digital identity', {
        error: error.message,
        walletAddress
      });
      return null;
    }
  }

  /**
   * Get digital identity by ID
   */
  async getDigitalIdentityById(id: number): Promise<IdentityData | null> {
    try {
      return await this.blockchainService.getIdentityById(id);
    } catch (error: any) {
      logger.error('Failed to get digital identity by ID', {
        error: error.message,
        id
      });
      return null;
    }
  }

  /**
   * Verify digital identity
   */
  async verifyDigitalIdentity(id: number, verifierAddress: string): Promise<string> {
    try {
      logger.info('Verifying digital identity', { id, verifierAddress });

      const txHash = await this.blockchainService.verifyIdentity(id);

      // Update verification queue
      const verification = this.verificationQueue.get(id);
      if (verification) {
        verification.status = 'approved';
        verification.verifierAddress = verifierAddress;
        verification.verificationDate = new Date();
      }

      logger.info('Digital identity verified successfully', {
        id,
        txHash,
        verifierAddress
      });

      return txHash;
    } catch (error: any) {
      logger.error('Failed to verify digital identity', {
        error: error.message,
        id,
        verifierAddress
      });
      throw new Error(`Failed to verify digital identity: ${error.message}`);
    }
  }

  /**
   * Deactivate digital identity
   */
  async deactivateDigitalIdentity(id: number, walletAddress: string): Promise<string> {
    try {
      logger.info('Deactivating digital identity', { id, walletAddress });

      // Verify ownership
      const existingIdentity = await this.blockchainService.getIdentityById(id);
      if (!existingIdentity || existingIdentity.walletAddress !== walletAddress) {
        throw new Error('Unauthorized: Not the identity owner');
      }

      const txHash = await this.blockchainService.deactivateIdentity(id);

      logger.info('Digital identity deactivated successfully', {
        id,
        txHash,
        walletAddress
      });

      return txHash;
    } catch (error: any) {
      logger.error('Failed to deactivate digital identity', {
        error: error.message,
        id,
        walletAddress
      });
      throw new Error(`Failed to deactivate digital identity: ${error.message}`);
    }
  }

  /**
   * Add role to digital identity
   */
  async addRoleToIdentity(id: number, role: string, walletAddress: string): Promise<string> {
    try {
      logger.info('Adding role to digital identity', { id, role, walletAddress });

      // Verify ownership
      const existingIdentity = await this.blockchainService.getIdentityById(id);
      if (!existingIdentity || existingIdentity.walletAddress !== walletAddress) {
        throw new Error('Unauthorized: Not the identity owner');
      }

      const txHash = await this.blockchainService.addRole(id, role);

      logger.info('Role added to digital identity successfully', {
        id,
        role,
        txHash,
        walletAddress
      });

      return txHash;
    } catch (error: any) {
      logger.error('Failed to add role to digital identity', {
        error: error.message,
        id,
        role,
        walletAddress
      });
      throw new Error(`Failed to add role: ${error.message}`);
    }
  }

  /**
   * Remove role from digital identity
   */
  async removeRoleFromIdentity(
    id: number, 
    roleIndex: number, 
    walletAddress: string
  ): Promise<string> {
    try {
      logger.info('Removing role from digital identity', { id, roleIndex, walletAddress });

      // Verify ownership
      const existingIdentity = await this.blockchainService.getIdentityById(id);
      if (!existingIdentity || existingIdentity.walletAddress !== walletAddress) {
        throw new Error('Unauthorized: Not the identity owner');
      }

      const txHash = await this.blockchainService.removeRole(id, roleIndex);

      logger.info('Role removed from digital identity successfully', {
        id,
        roleIndex,
        txHash,
        walletAddress
      });

      return txHash;
    } catch (error: any) {
      logger.error('Failed to remove role from digital identity', {
        error: error.message,
        id,
        roleIndex,
        walletAddress
      });
      throw new Error(`Failed to remove role: ${error.message}`);
    }
  }

  /**
   * Check if wallet has digital identity
   */
  async hasDigitalIdentity(walletAddress: string): Promise<boolean> {
    try {
      return await this.blockchainService.hasIdentity(walletAddress);
    } catch (error: any) {
      logger.error('Failed to check digital identity existence', {
        error: error.message,
        walletAddress
      });
      return false;
    }
  }

  /**
   * Get digital identity roles
   */
  async getDigitalIdentityRoles(id: number): Promise<string[]> {
    try {
      return await this.blockchainService.getIdentityRoles(id);
    } catch (error: any) {
      logger.error('Failed to get digital identity roles', {
        error: error.message,
        id
      });
      return [];
    }
  }

  /**
   * Check if digital identity has specific role
   */
  async hasDigitalIdentityRole(id: number, role: string): Promise<boolean> {
    try {
      return await this.blockchainService.hasRole(id, role);
    } catch (error: any) {
      logger.error('Failed to check digital identity role', {
        error: error.message,
        id,
        role
      });
      return false;
    }
  }

  /**
   * Get blockchain statistics
   */
  async getBlockchainStats(): Promise<BlockchainStats> {
    try {
      const totalIdentities = await this.blockchainService.getTotalIdentities();
      const lastBlockNumber = await this.blockchainService.getCurrentBlockNumber();
      const contractAddress = this.blockchainService.getContractAddress();

      // Get active and verified identities (this would require additional contract methods)
      const activeIdentities = totalIdentities; // Placeholder
      const verifiedIdentities = totalIdentities; // Placeholder

      return {
        totalIdentities,
        activeIdentities,
        verifiedIdentities,
        totalTransactions: 0, // Would need to track this
        lastBlockNumber,
        contractAddress
      };
    } catch (error: any) {
      logger.error('Failed to get blockchain stats', { error: error.message });
      throw new Error(`Failed to get blockchain stats: ${error.message}`);
    }
  }

  /**
   * Get verification queue
   */
  getVerificationQueue(): IdentityVerification[] {
    return Array.from(this.verificationQueue.values());
  }

  /**
   * Hash sensitive data for privacy
   */
  private hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate digital ID QR code data
   */
  generateQRCodeData(identity: IdentityData): string {
    const qrData = {
      id: identity.id,
      name: identity.name,
      email: identity.email,
      walletAddress: identity.walletAddress,
      isVerified: identity.isVerified,
      roles: identity.roles,
      contractAddress: this.blockchainService.getContractAddress(),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(qrData);
  }

  /**
   * Validate digital ID QR code data
   */
  async validateQRCodeData(qrData: string): Promise<{ valid: boolean; identity?: IdentityData }> {
    try {
      const data = JSON.parse(qrData);
      
      if (!data.id || !data.walletAddress) {
        return { valid: false };
      }

      const identity = await this.blockchainService.getIdentityById(data.id);
      
      if (!identity || identity.walletAddress !== data.walletAddress) {
        return { valid: false };
      }

      return { valid: true, identity };
    } catch (error: any) {
      logger.error('Failed to validate QR code data', { error: error.message });
      return { valid: false };
    }
  }
}
