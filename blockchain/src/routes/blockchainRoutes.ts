import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { DigitalIDService } from '../services/DigitalIDService';
import { WalletService } from '../services/WalletService';
import { BlockchainService } from '../services/BlockchainService';
import { CreateIdentityRequest, UpdateIdentityRequest } from '../types/blockchain';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createIdentitySchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  email: Joi.string().email().required(),
  nationality: Joi.string().required().min(1).max(50),
  aadhaarNumber: Joi.string().optional().min(12).max(12),
  passportNumber: Joi.string().optional().min(6).max(20),
  emergencyContact: Joi.string().required().min(10).max(20),
  roles: Joi.array().items(Joi.string()).required().min(1)
});

const updateIdentitySchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  email: Joi.string().email().required(),
  nationality: Joi.string().required().min(1).max(50),
  emergencyContact: Joi.string().required().min(10).max(20)
});

// Initialize services (these would be injected in a real app)
let digitalIDService: DigitalIDService;
let walletService: WalletService;
let blockchainService: BlockchainService;

// Initialize services function
const initializeServices = () => {
  if (!digitalIDService) {
    // This would be properly initialized with actual config
    const config = {
      rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545',
      privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || '',
      contractAddress: process.env.CONTRACT_ADDRESS || '',
      contractABI: require('../contracts/DigitalID.json').abi,
      chainId: parseInt(process.env.CHAIN_ID || '1337')
    };

    blockchainService = new BlockchainService(
      config.rpcUrl,
      config.privateKey,
      config.contractAddress,
      config.contractABI
    );

    walletService = new WalletService(config.rpcUrl);
    digitalIDService = new DigitalIDService(blockchainService, walletService);
  }
};

// Middleware to initialize services
router.use((req, res, next) => {
  initializeServices();
  next();
});

// Generate new wallet
router.post('/wallet/generate', async (req: Request, res: Response) => {
  try {
    const wallet = walletService.generateWallet();
    
    res.json({
      success: true,
      data: {
        address: wallet.address,
        mnemonic: wallet.mnemonic
        // Never return private key in API response
      }
    });
  } catch (error: any) {
    logger.error('Failed to generate wallet', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to generate wallet'
    });
  }
});

// Get wallet info
router.get('/wallet/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    if (!walletService.isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address'
      });
    }

    const walletInfo = await walletService.getWalletInfo(address);
    
    res.json({
      success: true,
      data: walletInfo
    });
  } catch (error: any) {
    logger.error('Failed to get wallet info', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get wallet info'
    });
  }
});

// Create digital identity
router.post('/identity/create', async (req: Request, res: Response) => {
  try {
    const { error, value } = createIdentitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { walletAddress } = req.body;
    if (!walletAddress || !walletService.isValidAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Valid wallet address is required'
      });
    }

    const createRequest: CreateIdentityRequest = {
      name: value.name,
      email: value.email,
      nationality: value.nationality,
      aadhaarHash: value.aadhaarNumber,
      passportHash: value.passportNumber,
      emergencyContact: value.emergencyContact,
      roles: value.roles
    };

    const result = await digitalIDService.createDigitalIdentity(createRequest, walletAddress);
    
    res.json({
      success: true,
      data: {
        identity: result.identity,
        txHash: result.txHash
      }
    });
  } catch (error: any) {
    logger.error('Failed to create digital identity', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get digital identity by wallet
router.get('/identity/wallet/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    if (!walletService.isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address'
      });
    }

    const identity = await digitalIDService.getDigitalIdentity(address);
    
    if (!identity) {
      return res.status(404).json({
        success: false,
        error: 'Digital identity not found'
      });
    }

    res.json({
      success: true,
      data: identity
    });
  } catch (error: any) {
    logger.error('Failed to get digital identity', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get digital identity'
    });
  }
});

// Get digital identity by ID
router.get('/identity/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const identityId = parseInt(id);
    
    if (isNaN(identityId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid identity ID'
      });
    }

    const identity = await digitalIDService.getDigitalIdentityById(identityId);
    
    if (!identity) {
      return res.status(404).json({
        success: false,
        error: 'Digital identity not found'
      });
    }

    res.json({
      success: true,
      data: identity
    });
  } catch (error: any) {
    logger.error('Failed to get digital identity by ID', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get digital identity'
    });
  }
});

// Update digital identity
router.put('/identity/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const identityId = parseInt(id);
    
    if (isNaN(identityId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid identity ID'
      });
    }

    const { error, value } = updateIdentitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { walletAddress } = req.body;
    if (!walletAddress || !walletService.isValidAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Valid wallet address is required'
      });
    }

    const updateRequest: UpdateIdentityRequest = {
      name: value.name,
      email: value.email,
      nationality: value.nationality,
      emergencyContact: value.emergencyContact
    };

    const result = await digitalIDService.updateDigitalIdentity(identityId, updateRequest, walletAddress);
    
    res.json({
      success: true,
      data: {
        identity: result.identity,
        txHash: result.txHash
      }
    });
  } catch (error: any) {
    logger.error('Failed to update digital identity', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Verify digital identity
router.post('/identity/:id/verify', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const identityId = parseInt(id);
    
    if (isNaN(identityId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid identity ID'
      });
    }

    const { verifierAddress } = req.body;
    if (!verifierAddress || !walletService.isValidAddress(verifierAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Valid verifier address is required'
      });
    }

    const txHash = await digitalIDService.verifyDigitalIdentity(identityId, verifierAddress);
    
    res.json({
      success: true,
      data: { txHash }
    });
  } catch (error: any) {
    logger.error('Failed to verify digital identity', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Deactivate digital identity
router.post('/identity/:id/deactivate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const identityId = parseInt(id);
    
    if (isNaN(identityId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid identity ID'
      });
    }

    const { walletAddress } = req.body;
    if (!walletAddress || !walletService.isValidAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Valid wallet address is required'
      });
    }

    const txHash = await digitalIDService.deactivateDigitalIdentity(identityId, walletAddress);
    
    res.json({
      success: true,
      data: { txHash }
    });
  } catch (error: any) {
    logger.error('Failed to deactivate digital identity', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add role to digital identity
router.post('/identity/:id/roles', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const identityId = parseInt(id);
    
    if (isNaN(identityId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid identity ID'
      });
    }

    const { role, walletAddress } = req.body;
    if (!role || typeof role !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Valid role is required'
      });
    }

    if (!walletAddress || !walletService.isValidAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Valid wallet address is required'
      });
    }

    const txHash = await digitalIDService.addRoleToIdentity(identityId, role, walletAddress);
    
    res.json({
      success: true,
      data: { txHash }
    });
  } catch (error: any) {
    logger.error('Failed to add role to digital identity', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get digital identity roles
router.get('/identity/:id/roles', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const identityId = parseInt(id);
    
    if (isNaN(identityId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid identity ID'
      });
    }

    const roles = await digitalIDService.getDigitalIdentityRoles(identityId);
    
    res.json({
      success: true,
      data: { roles }
    });
  } catch (error: any) {
    logger.error('Failed to get digital identity roles', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get roles'
    });
  }
});

// Get blockchain statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await digitalIDService.getBlockchainStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    logger.error('Failed to get blockchain stats', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get blockchain statistics'
    });
  }
});

// Get verification queue
router.get('/verification-queue', async (req: Request, res: Response) => {
  try {
    const queue = digitalIDService.getVerificationQueue();
    
    res.json({
      success: true,
      data: { queue }
    });
  } catch (error: any) {
    logger.error('Failed to get verification queue', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get verification queue'
    });
  }
});

// Generate QR code data
router.post('/identity/:id/qr', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const identityId = parseInt(id);
    
    if (isNaN(identityId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid identity ID'
      });
    }

    const identity = await digitalIDService.getDigitalIdentityById(identityId);
    
    if (!identity) {
      return res.status(404).json({
        success: false,
        error: 'Digital identity not found'
      });
    }

    const qrData = digitalIDService.generateQRCodeData(identity);
    
    res.json({
      success: true,
      data: { qrData }
    });
  } catch (error: any) {
    logger.error('Failed to generate QR code data', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR code data'
    });
  }
});

// Validate QR code data
router.post('/qr/validate', async (req: Request, res: Response) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData || typeof qrData !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'QR code data is required'
      });
    }

    const result = await digitalIDService.validateQRCodeData(qrData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    logger.error('Failed to validate QR code data', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to validate QR code data'
    });
  }
});

export default router;
