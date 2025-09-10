import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

// Health check endpoint
router.get('/', (req: Request, res: Response) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      blockchain: 'OK',
      wallet: 'OK',
      digitalId: 'OK',
      smartContract: process.env.CONTRACT_ADDRESS ? 'Deployed' : 'Not Deployed'
    }
  };

  logger.info('Blockchain health check requested', { ip: req.ip });
  res.status(200).json(healthCheck);
});

// Detailed health check
router.get('/detailed', (req: Request, res: Response) => {
  const detailedHealth = {
    uptime: process.uptime(),
    message: 'Detailed Blockchain Health Check',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100
    },
    cpu: {
      usage: process.cpuUsage()
    },
    platform: {
      os: process.platform,
      arch: process.arch,
      nodeVersion: process.version
    },
    blockchain: {
      rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'Not configured',
      contractAddress: process.env.CONTRACT_ADDRESS || 'Not deployed',
      chainId: process.env.CHAIN_ID || 'Not configured'
    }
  };

  logger.info('Detailed blockchain health check requested', { ip: req.ip });
  res.status(200).json(detailedHealth);
});

// Database test endpoint
router.get('/db-test', async (req: Request, res: Response) => {
  try {
    const mongoose = require('mongoose');
    const connectionState = mongoose.connection.readyState;
    
    let dbStatus = 'Disconnected';
    if (connectionState === 1) dbStatus = 'Connected';
    else if (connectionState === 2) dbStatus = 'Connecting';
    else if (connectionState === 3) dbStatus = 'Disconnecting';
    
    res.json({
      success: true,
      data: {
        connectionState,
        status: dbStatus,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        readyState: connectionState
      }
    });
  } catch (error: any) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

export default router;
