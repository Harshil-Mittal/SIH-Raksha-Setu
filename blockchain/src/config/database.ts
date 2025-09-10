import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/raksha-setu-blockchain';
    
    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options and use modern ones
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
    });

    logger.info(`🗄️  MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.warn('MongoDB connection failed, continuing without database:', error.message);
    // Don't exit, continue without database for now
  }
};

export default connectDB;
