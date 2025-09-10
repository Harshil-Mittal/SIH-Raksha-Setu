import crypto from 'crypto';
import { logger } from '../utils/logger';
import DigitalID from '../models/DigitalID';

export interface Block {
  index: number;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  signature?: string;
}

export interface DigitalID {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  walletAddress: string;
  timestamp: number;
  hash: string;
  verified: boolean;
}

export class SimpleBlockchain {
  private chain: Block[];
  private transactions: Transaction[];
  private digitalIDs: DigitalID[];
  private difficulty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.transactions = [];
    this.digitalIDs = [];
    this.difficulty = 2;
    
    // Load existing digital IDs from MongoDB (async, don't wait)
    this.loadDigitalIDsFromDB().catch(error => {
      logger.warn('Failed to load digital IDs on startup:', error.message);
    });
  }

  private async loadDigitalIDsFromDB() {
    try {
      // Check if MongoDB is connected
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 1) {
        const digitalIDs = await DigitalID.find({}).sort({ createdAt: -1 });
        
        this.digitalIDs = digitalIDs.map(did => ({
          id: did._id.toString(),
          userId: did.userId,
          name: did.name,
          email: did.email,
          role: did.role,
          walletAddress: did.walletAddress,
          timestamp: did.timestamp,
          hash: did.hash,
          verified: did.verified
        }));
        
        logger.info(`Loaded ${this.digitalIDs.length} digital IDs from MongoDB`);
      } else {
        logger.info('MongoDB not connected, starting with empty digital IDs array');
        this.digitalIDs = [];
      }
    } catch (error: any) {
      logger.warn('Failed to load digital IDs from MongoDB:', error.message);
      this.digitalIDs = [];
    }
  }

  private createGenesisBlock(): Block {
    return {
      index: 0,
      timestamp: Date.now(),
      data: { message: 'RakshaSetu Genesis Block' },
      previousHash: '0',
      hash: this.calculateHash(0, Date.now(), { message: 'RakshaSetu Genesis Block' }, '0', 0),
      nonce: 0
    };
  }

  private calculateHash(index: number, timestamp: number, data: any, previousHash: string, nonce: number): string {
    return crypto
      .createHash('sha256')
      .update(index + timestamp + JSON.stringify(data) + previousHash + nonce)
      .digest('hex');
  }

  private mineBlock(block: Block): Block {
    const target = '0'.repeat(this.difficulty);
    
    while (block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++;
      block.hash = this.calculateHash(block.index, block.timestamp, block.data, block.previousHash, block.nonce);
    }
    
    return block;
  }

  public addBlock(data: any): Block {
    const previousBlock = this.chain[this.chain.length - 1];
    const newBlock: Block = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      data,
      previousHash: previousBlock.hash,
      hash: '',
      nonce: 0
    };

    newBlock.hash = this.calculateHash(newBlock.index, newBlock.timestamp, newBlock.data, newBlock.previousHash, newBlock.nonce);
    const minedBlock = this.mineBlock(newBlock);
    
    this.chain.push(minedBlock);
    
    logger.info('New block mined', { 
      index: minedBlock.index, 
      hash: minedBlock.hash,
      nonce: minedBlock.nonce 
    });
    
    return minedBlock;
  }

  public addTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...transaction
    };

    this.transactions.push(newTransaction);
    
    logger.info('Transaction added', { 
      id: newTransaction.id,
      from: newTransaction.from,
      to: newTransaction.to,
      amount: newTransaction.amount
    });
    
    return newTransaction;
  }

  public async createDigitalID(userData: {
    userId: string;
    name: string;
    email: string;
    role: string;
    walletAddress: string;
    additionalData?: any;
  }): Promise<DigitalID> {
    try {
      // Create hash of the digital ID data
      const hash = crypto
        .createHash('sha256')
        .update(JSON.stringify({
          userId: userData.userId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          walletAddress: userData.walletAddress,
          timestamp: Date.now()
        }))
        .digest('hex');

      // Check if MongoDB is connected and save accordingly
      const mongoose = require('mongoose');
      let digitalID;
      
      if (mongoose.connection.readyState === 1) {
        // Save to MongoDB
        digitalID = await DigitalID.create({
          userId: userData.userId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          walletAddress: userData.walletAddress,
          timestamp: Date.now(),
          hash: hash,
          verified: false,
          additionalData: userData.additionalData || {}
        });
      } else {
        // Create in-memory digital ID
        digitalID = {
          _id: crypto.randomUUID(),
          userId: userData.userId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          walletAddress: userData.walletAddress,
          timestamp: Date.now(),
          hash: hash,
          verified: false,
          additionalData: userData.additionalData || {}
        };
      }

      // Add to in-memory array for blockchain
      this.digitalIDs.push({
        id: digitalID._id.toString(),
        userId: digitalID.userId,
        name: digitalID.name,
        email: digitalID.email,
        role: digitalID.role,
        walletAddress: digitalID.walletAddress,
        timestamp: digitalID.timestamp,
        hash: digitalID.hash,
        verified: digitalID.verified
      });
      
      // Add to blockchain
      this.addBlock({
        type: 'digital_id',
        digitalID: digitalID._id.toString(),
        hash: digitalID.hash,
        verified: digitalID.verified
      });
      
      logger.info('Digital ID created and saved to MongoDB', { 
        id: digitalID._id,
        userId: digitalID.userId,
        hash: digitalID.hash
      });
      
      return {
        id: digitalID._id.toString(),
        userId: digitalID.userId,
        name: digitalID.name,
        email: digitalID.email,
        role: digitalID.role,
        walletAddress: digitalID.walletAddress,
        timestamp: digitalID.timestamp,
        hash: digitalID.hash,
        verified: digitalID.verified
      };
    } catch (error: any) {
      logger.error('Failed to create digital ID:', error);
      throw new Error('Failed to create digital ID');
    }
  }

  public verifyDigitalID(digitalIDHash: string): DigitalID | null {
    const digitalID = this.digitalIDs.find(id => id.hash === digitalIDHash);
    
    if (digitalID) {
      digitalID.verified = true;
      logger.info('Digital ID verified', { id: digitalID.id, hash: digitalIDHash });
    }
    
    return digitalID || null;
  }

  public getChain(): Block[] {
    return this.chain;
  }

  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  public getDigitalIDs(): DigitalID[] {
    return this.digitalIDs;
  }

  public getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public getBlockByIndex(index: number): Block | null {
    return this.chain[index] || null;
  }

  public getTransactionById(id: string): Transaction | null {
    return this.transactions.find(tx => tx.id === id) || null;
  }

  public getDigitalIDById(id: string): DigitalID | null {
    return this.digitalIDs.find(did => did.id === id) || null;
  }

  public getDigitalIDByHash(hash: string): DigitalID | null {
    return this.digitalIDs.find(did => did.hash === hash) || null;
  }

  public getStats() {
    return {
      chainLength: this.chain.length,
      totalTransactions: this.transactions.length,
      totalDigitalIDs: this.digitalIDs.length,
      verifiedDigitalIDs: this.digitalIDs.filter(id => id.verified).length,
      lastBlock: this.getLastBlock(),
      difficulty: this.difficulty
    };
  }

  public validateChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if current block hash is valid
      if (currentBlock.hash !== this.calculateHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.data,
        currentBlock.previousHash,
        currentBlock.nonce
      )) {
        return false;
      }

      // Check if current block points to previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

// Singleton instance
export const blockchain = new SimpleBlockchain();
export default blockchain;
