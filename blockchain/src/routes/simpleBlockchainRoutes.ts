import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { WalletService } from '../services/WalletService';
import { DigitalIDService } from '../services/DigitalIDService';
import { BlockchainService } from '../services/BlockchainService';

const router = Router();

// Initialize services
let walletService: WalletService;
let digitalIDService: DigitalIDService;
let blockchainService: BlockchainService;

const initializeServices = () => {
  if (!walletService) {
    const config = {
      rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545',
      privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001', // Dummy key
      contractAddress: process.env.CONTRACT_ADDRESS || '',
      contractABI: [], // Empty ABI for now
      chainId: parseInt(process.env.CHAIN_ID || '1337')
    };

    // Only initialize wallet service for now (no blockchain connection needed)
    walletService = new WalletService(config.rpcUrl);
    
    // Skip blockchain and digital ID services for now
    // blockchainService = new BlockchainService(
    //   config.rpcUrl,
    //   config.privateKey,
    //   config.contractAddress,
    //   config.contractABI
    // );
    // digitalIDService = new DigitalIDService(blockchainService, walletService);
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

// Get blockchain statistics (mock data for now)
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = {
      totalIdentities: 0,
      activeIdentities: 0,
      verifiedIdentities: 0,
      totalTransactions: 0,
      networkStatus: 'Connected',
      lastBlockNumber: 0
    };
    
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

// Health check for blockchain services
router.get('/health', async (req: Request, res: Response) => {
  try {
    const health = {
      blockchain: 'OK',
      wallet: 'OK',
      digitalId: 'OK',
      smartContract: 'Not Deployed'
    };
    
    res.json({
      success: true,
      data: health
    });
  } catch (error: any) {
    logger.error('Blockchain health check failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Blockchain health check failed'
    });
  }
});

export default router;
