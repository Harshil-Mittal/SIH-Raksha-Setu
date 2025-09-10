import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { authenticate } from './middleware/auth';
import connectDB from './config/database';
import blockchainRoutes from './routes/blockchainRoutes';
import simpleBlockchainRoutes from './routes/simpleBlockchainRoutes';
import authRoutes from './routes/authRoutes';
import healthRoutes from './routes/healthRoutes';
import qrRoutes from './routes/qrRoutes';
import portalRoutes from './routes/portalRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.BLOCKCHAIN_PORT || 3002;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '50'), // Lower limit for blockchain operations
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware (simplified for SQLite)
app.use(session({
  secret: process.env.SESSION_SECRET || 'raksha-setu-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api', simpleBlockchainRoutes); // Using simplified routes without auth for now
// app.use('/api', authenticate, blockchainRoutes); // Full blockchain routes with auth

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RakshaSetu Blockchain API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      health: '/api/health',
      wallet: '/api/blockchain/wallet',
      identity: '/api/blockchain/identity',
      stats: '/api/blockchain/stats',
      verification: '/api/blockchain/verification-queue'
    },
    features: [
      'Digital Identity Management',
      'Wallet Generation & Management',
      'Smart Contract Integration',
      'Identity Verification',
      'Role Management',
      'QR Code Generation',
      'Blockchain Statistics'
    ]
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize MongoDB database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    const mongoConnected = await connectDB();
    
    if (mongoConnected) {
      logger.info('✅ MongoDB connection established - Full functionality available');
    } else {
      logger.warn('⚠️  MongoDB connection failed - Using in-memory storage only');
    }
    
    // Start the server
    app.listen(PORT, () => {
      logger.info(`🚀 RakshaSetu Blockchain API server running on port ${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
      logger.info(`⛓️  Blockchain RPC: ${process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545'}`);
      logger.info(`📄 Contract Address: ${process.env.CONTRACT_ADDRESS || 'Not deployed'}`);
      logger.info(`🗄️  Database: ${mongoConnected ? 'MongoDB Atlas Connected' : 'In-Memory Only'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
