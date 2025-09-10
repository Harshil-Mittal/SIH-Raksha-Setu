import { logger } from '../utils/logger';

// In-memory storage for when MongoDB is not available
class InMemoryStorage {
  private users: Map<string, any> = new Map();
  private digitalIDs: Map<string, any> = new Map();
  private sessions: Map<string, any> = new Map();

  // User operations
  async createUser(userData: any) {
    const userId = userData._id || userData.email;
    this.users.set(userId, { 
      ...userData, 
      _id: userId, 
      isActive: true, // Set as active by default
      createdAt: new Date() 
    });
    logger.info(`User created in memory: ${userData.email}`);
    return this.users.get(userId);
  }

  async findUserByEmail(email: string) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id: string) {
    return this.users.get(id) || null;
  }

  async updateUser(id: string, updates: any) {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates, updatedAt: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return null;
  }

  // Digital ID operations
  async createDigitalID(digitalIDData: any) {
    const id = digitalIDData._id || digitalIDData.hash;
    this.digitalIDs.set(id, { ...digitalIDData, _id: id, createdAt: new Date() });
    logger.info(`Digital ID created in memory: ${digitalIDData.userId}`);
    return this.digitalIDs.get(id);
  }

  async findDigitalIDs() {
    return Array.from(this.digitalIDs.values());
  }

  async findDigitalIDByHash(hash: string) {
    for (const digitalID of this.digitalIDs.values()) {
      if (digitalID.hash === hash) {
        return digitalID;
      }
    }
    return null;
  }

  // Session operations
  async createSession(sessionData: any) {
    const sessionId = sessionData._id || sessionData.sessionId;
    this.sessions.set(sessionId, { ...sessionData, _id: sessionId, createdAt: new Date() });
    return this.sessions.get(sessionId);
  }

  async findSession(sessionId: string) {
    return this.sessions.get(sessionId) || null;
  }

  async deleteSession(sessionId: string) {
    return this.sessions.delete(sessionId);
  }

  // Stats
  getUserCount() {
    return this.users.size;
  }

  getDigitalIDCount() {
    return this.digitalIDs.size;
  }

  getSessionCount() {
    return this.sessions.size;
  }
}

export const inMemoryStorage = new InMemoryStorage();
