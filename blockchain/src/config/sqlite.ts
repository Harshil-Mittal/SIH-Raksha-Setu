import Database from 'better-sqlite3';
import { logger } from '../utils/logger';
import path from 'path';

let db: Database.Database | null = null;

export const getDatabase = (): Database.Database => {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'raksha-setu.db');
    
    // Ensure data directory exists
    const fs = require('fs');
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    db = new Database(dbPath);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Create tables
    createTables();
    
    logger.info(`🗄️  SQLite Database Connected: ${dbPath}`);
  }
  
  return db;
};

const createTables = () => {
  if (!db) return;

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'police', 'tourism', 'tourist')),
      walletAddress TEXT UNIQUE,
      isActive BOOLEAN DEFAULT 1,
      lastLogin DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Digital Identities table
  db.exec(`
    CREATE TABLE IF NOT EXISTS digital_identities (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      walletAddress TEXT UNIQUE NOT NULL,
      identityId INTEGER UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      nationality TEXT NOT NULL,
      aadhaarHash TEXT,
      passportHash TEXT,
      emergencyContact TEXT NOT NULL,
      roles TEXT NOT NULL, -- JSON array
      isVerified BOOLEAN DEFAULT 0,
      isActive BOOLEAN DEFAULT 1,
      verificationDate DATETIME,
      verifierAddress TEXT,
      txHash TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(walletAddress);
    CREATE INDEX IF NOT EXISTS idx_identities_wallet ON digital_identities(walletAddress);
    CREATE INDEX IF NOT EXISTS idx_identities_user ON digital_identities(userId);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(userId);
  `);

  logger.info('📊 Database tables created successfully');
};

export const closeDatabase = () => {
  if (db) {
    db.close();
    db = null;
    logger.info('🗄️  Database connection closed');
  }
};

export default getDatabase;
