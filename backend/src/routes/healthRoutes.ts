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
      database: 'N/A', // Add database health check if needed
      translation: 'OK',
      tts: 'OK',
      stt: 'OK'
    }
  };

  logger.info('Health check requested', { ip: req.ip });
  res.status(200).json(healthCheck);
});

// Detailed health check
router.get('/detailed', (req: Request, res: Response) => {
  const detailedHealth = {
    uptime: process.uptime(),
    message: 'Detailed Health Check',
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
    }
  };

  logger.info('Detailed health check requested', { ip: req.ip });
  res.status(200).json(detailedHealth);
});

export default router;
