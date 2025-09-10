const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://pchelpharshil_db_user:OGrL7XbgazbbxCrU@raksha-setu-cluster.fbu2nd3.mongodb.net/raksha-setu-blockchain?retryWrites=true&w=majority&appName=raksha-setu-cluster';

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB Atlas connection...');
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Atlas Connected:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    console.log('🌐 Cluster: raksha-setu-cluster');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ name: 'MongoDB Atlas Test' });
    await testDoc.save();
    
    console.log('✅ Test document created successfully');
    
    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('🧹 Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();
