const mongoose = require('mongoose');

// MongoDB connection string
const mongoURI = 'mongodb+srv://pchelpharshil_db_user:OGrL7XbgazbbxCrU@raksha-setu-cluster.fbu2nd3.mongodb.net/raksha-setu-blockchain?retryWrites=true&w=majority&appName=raksha-setu-cluster';

async function viewDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Get database instance
    const db = mongoose.connection.db;
    
    // List all collections
    console.log('\n📊 Available Collections:');
    const collections = await db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // View data in each collection
    for (const collection of collections) {
      console.log(`\n📋 Collection: ${collection.name}`);
      console.log('=' .repeat(50));
      
      const data = await db.collection(collection.name).find({}).toArray();
      console.log(`Total documents: ${data.length}`);
      
      if (data.length > 0) {
        console.log('Sample data:');
        console.log(JSON.stringify(data[0], null, 2));
        
        if (data.length > 1) {
          console.log(`\n... and ${data.length - 1} more documents`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

viewDatabase();
