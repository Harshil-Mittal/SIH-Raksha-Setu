import QRCode from 'qrcode';
import { logger } from '../utils/logger';

export interface QRCodeData {
  userId: string;
  walletAddress: string;
  timestamp: number;
  type: 'digital_id' | 'wallet' | 'transaction';
  data?: any;
}

export class QRService {
  /**
   * Generate QR code for digital ID
   */
  static async generateDigitalIDQR(userId: string, walletAddress: string, additionalData?: any): Promise<string> {
    try {
      const qrData: QRCodeData = {
        userId,
        walletAddress,
        timestamp: Date.now(),
        type: 'digital_id',
        data: additionalData
      };

      const qrString = JSON.stringify(qrData);
      const qrCode = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      logger.info('Digital ID QR code generated', { userId, walletAddress });
      return qrCode;
    } catch (error: any) {
      logger.error('Error generating Digital ID QR code:', error);
      throw new Error('Failed to generate Digital ID QR code');
    }
  }

  /**
   * Generate QR code for wallet address
   */
  static async generateWalletQR(walletAddress: string): Promise<string> {
    try {
      const qrData: QRCodeData = {
        userId: '',
        walletAddress,
        timestamp: Date.now(),
        type: 'wallet'
      };

      const qrString = JSON.stringify(qrData);
      const qrCode = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      logger.info('Wallet QR code generated', { walletAddress });
      return qrCode;
    } catch (error: any) {
      logger.error('Error generating Wallet QR code:', error);
      throw new Error('Failed to generate Wallet QR code');
    }
  }

  /**
   * Generate QR code for transaction
   */
  static async generateTransactionQR(transactionHash: string, walletAddress: string): Promise<string> {
    try {
      const qrData: QRCodeData = {
        userId: '',
        walletAddress,
        timestamp: Date.now(),
        type: 'transaction',
        data: { transactionHash }
      };

      const qrString = JSON.stringify(qrData);
      const qrCode = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      logger.info('Transaction QR code generated', { transactionHash, walletAddress });
      return qrCode;
    } catch (error: any) {
      logger.error('Error generating Transaction QR code:', error);
      throw new Error('Failed to generate Transaction QR code');
    }
  }

  /**
   * Parse QR code data
   */
  static parseQRCode(qrString: string): QRCodeData | null {
    try {
      const qrData = JSON.parse(qrString) as QRCodeData;
      
      // Validate QR code data structure
      if (!qrData.userId && !qrData.walletAddress) {
        throw new Error('Invalid QR code data');
      }

      return qrData;
    } catch (error: any) {
      logger.error('Error parsing QR code:', error);
      return null;
    }
  }

  /**
   * Generate QR code as SVG
   */
  static async generateQRSVG(data: string): Promise<string> {
    try {
      const qrCode = await QRCode.toString(data, {
        type: 'svg',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return qrCode;
    } catch (error: any) {
      logger.error('Error generating QR SVG:', error);
      throw new Error('Failed to generate QR SVG');
    }
  }
}

export default QRService;
