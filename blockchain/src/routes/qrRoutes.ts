import { Router, Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import QRService from '../services/qrService';

const router = Router();

// Generate Digital ID QR Code
router.post('/digital-id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { additionalData } = req.body;
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const qrCode = await QRService.generateDigitalIDQR(
      req.user._id.toString(),
      req.user.walletAddress || '',
      additionalData
    );

    res.json({
      success: true,
      data: {
        qrCode,
        userId: req.user._id,
        walletAddress: req.user.walletAddress,
        type: 'digital_id'
      }
    });
  } catch (error: any) {
    logger.error('Digital ID QR generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate Digital ID QR code'
    });
  }
});

// Generate Wallet QR Code
router.post('/wallet', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address not found'
      });
    }

    const qrCode = await QRService.generateWalletQR(req.user.walletAddress);

    res.json({
      success: true,
      data: {
        qrCode,
        walletAddress: req.user.walletAddress,
        type: 'wallet'
      }
    });
  } catch (error: any) {
    logger.error('Wallet QR generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate Wallet QR code'
    });
  }
});

// Generate Transaction QR Code
router.post('/transaction', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { transactionHash } = req.body;
    
    if (!transactionHash) {
      return res.status(400).json({
        success: false,
        error: 'Transaction hash is required'
      });
    }

    if (!req.user || !req.user.walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address not found'
      });
    }

    const qrCode = await QRService.generateTransactionQR(
      transactionHash,
      req.user.walletAddress
    );

    res.json({
      success: true,
      data: {
        qrCode,
        transactionHash,
        walletAddress: req.user.walletAddress,
        type: 'transaction'
      }
    });
  } catch (error: any) {
    logger.error('Transaction QR generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate Transaction QR code'
    });
  }
});

// Parse QR Code
router.post('/parse', async (req: Request, res: Response) => {
  try {
    const { qrString } = req.body;
    
    if (!qrString) {
      return res.status(400).json({
        success: false,
        error: 'QR code string is required'
      });
    }

    const qrData = QRService.parseQRCode(qrString);
    
    if (!qrData) {
      return res.status(400).json({
        success: false,
        error: 'Invalid QR code format'
      });
    }

    res.json({
      success: true,
      data: qrData
    });
  } catch (error: any) {
    logger.error('QR parsing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to parse QR code'
    });
  }
});

// Generate QR Code as SVG
router.post('/svg', async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({
        success: false,
        error: 'Data is required'
      });
    }

    const qrSVG = await QRService.generateQRSVG(data);

    res.json({
      success: true,
      data: {
        svg: qrSVG,
        type: 'svg'
      }
    });
  } catch (error: any) {
    logger.error('QR SVG generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR SVG'
    });
  }
});

export default router;
