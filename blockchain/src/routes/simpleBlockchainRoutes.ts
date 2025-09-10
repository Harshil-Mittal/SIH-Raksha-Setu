import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';
import blockchain from '../services/simpleBlockchain';
import { WalletService } from '../services/WalletService';

const router = Router();

// Initialize wallet service
let walletService: WalletService;

const initializeWalletService = () => {
  if (!walletService) {
    const config = {
      rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545',
      privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001',
      contractAddress: process.env.CONTRACT_ADDRESS || '',
      contractABI: [],
      chainId: parseInt(process.env.CHAIN_ID || '1337')
    };

    walletService = new WalletService(config.rpcUrl);
  }
};

// Middleware to initialize services
router.use((req, res, next) => {
  initializeWalletService();
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

// Create Digital ID
router.post('/digital-id/create', async (req: Request, res: Response) => {
  try {
    const { userId, name, email, role, walletAddress, additionalData } = req.body;
    
    if (!userId || !name || !email || !role || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const digitalID = await blockchain.createDigitalID({
      userId,
      name,
      email,
      role,
      walletAddress,
      additionalData
    });
    
    res.json({
      success: true,
      data: digitalID
    });
  } catch (error: any) {
    logger.error('Failed to create digital ID', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to create digital ID'
    });
  }
});

// Verify Digital ID
router.post('/digital-id/verify', async (req: Request, res: Response) => {
  try {
    const { hash } = req.body;
    
    if (!hash) {
      return res.status(400).json({
        success: false,
        error: 'Digital ID hash is required'
      });
    }

    const digitalID = blockchain.verifyDigitalID(hash);
    
    if (!digitalID) {
      return res.status(404).json({
        success: false,
        error: 'Digital ID not found'
      });
    }
    
    res.json({
      success: true,
      data: digitalID
    });
  } catch (error: any) {
    logger.error('Failed to verify digital ID', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to verify digital ID'
    });
  }
});

// Get Digital ID by hash
router.get('/digital-id/:hash', async (req: Request, res: Response) => {
  try {
    const { hash } = req.params;
    
    const digitalID = blockchain.getDigitalIDByHash(hash);
    
    if (!digitalID) {
      return res.status(404).json({
        success: false,
        error: 'Digital ID not found'
      });
    }
    
    res.json({
      success: true,
      data: digitalID
    });
  } catch (error: any) {
    logger.error('Failed to get digital ID', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get digital ID'
    });
  }
});

// Get all Digital IDs
router.get('/digital-ids', async (req: Request, res: Response) => {
  try {
    const digitalIDs = blockchain.getDigitalIDs();
    
    res.json({
      success: true,
      data: {
        digitalIDs,
        total: digitalIDs.length,
        verified: digitalIDs.filter(id => id.verified).length
      }
    });
  } catch (error: any) {
    logger.error('Failed to get digital IDs', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get digital IDs'
    });
  }
});

// Add transaction
router.post('/transaction', async (req: Request, res: Response) => {
  try {
    const { from, to, amount } = req.body;
    
    if (!from || !to || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: from, to, amount'
      });
    }

    const transaction = blockchain.addTransaction({
      from,
      to,
      amount: parseFloat(amount)
    });
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error: any) {
    logger.error('Failed to add transaction', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to add transaction'
    });
  }
});

// Get transaction by ID
router.get('/transaction/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const transaction = blockchain.getTransactionById(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error: any) {
    logger.error('Failed to get transaction', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get transaction'
    });
  }
});

// Get all transactions
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const transactions = blockchain.getTransactions();
    
    res.json({
      success: true,
      data: {
        transactions,
        total: transactions.length
      }
    });
  } catch (error: any) {
    logger.error('Failed to get transactions', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get transactions'
    });
  }
});

// Get blockchain info
router.get('/info', async (req: Request, res: Response) => {
  try {
    const chain = blockchain.getChain();
    const stats = blockchain.getStats();
    const isValid = blockchain.validateChain();
    
    res.json({
      success: true,
      data: {
        chainLength: chain.length,
        lastBlock: blockchain.getLastBlock(),
        stats,
        isValid,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    logger.error('Failed to get blockchain info', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get blockchain info'
    });
  }
});

// Get blockchain statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = blockchain.getStats();
    
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
      smartContract: 'Not Deployed',
      chainValid: blockchain.validateChain()
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