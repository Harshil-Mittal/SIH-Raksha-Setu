import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const connectDB = async (): Promise<boolean> => {
  try {
    // Use MongoDB Atlas connection string
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://pchelpharshil_db_user:OGrL7XbgazbbxCrU@raksha-setu-cluster.fbu2nd3.mongodb.net/raksha-setu-blockchain?retryWrites=true&w=majority&appName=raksha-setu-cluster';
    
    logger.info('🔌 Connecting to MongoDB Atlas...');
    
    // Try to connect with a shorter timeout first
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000, // Shorter timeout
      socketTimeoutMS: 30000,
      bufferCommands: true,
      connectTimeoutMS: 10000,
    });

    logger.info(`🗄️  MongoDB Atlas Connected: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);
    logger.info(`🌐 Cluster: raksha-setu-cluster`);
    
    // Test the connection with a simple operation
    const testModel = mongoose.model('ConnectionTest', new mongoose.Schema({ test: String }));
    await testModel.create({ test: 'connection-test' });
    await testModel.deleteOne({ test: 'connection-test' });
    
    logger.info('✅ MongoDB connection is ready for operations');
    return true;
  } catch (error: any) {
    logger.error('MongoDB Atlas connection failed:', error.message);
    logger.warn('Falling back to in-memory storage');
    
    // Disconnect if partially connected
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      // Ignore disconnect errors
    }
    
    return false;
  }
};

export default connectDB;
