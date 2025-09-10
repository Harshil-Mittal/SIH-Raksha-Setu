import { getDatabase } from '../config/sqlite';
import bcrypt from 'bcryptjs';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'police' | 'tourism' | 'tourist';
  walletAddress?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export class SqliteUser {
  private db = getDatabase();

  async create(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const stmt = this.db.prepare(`
      INSERT INTO users (id, name, email, password, role, walletAddress, isActive, lastLogin, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      userData.name,
      userData.email,
      hashedPassword,
      userData.role,
      userData.walletAddress || null,
      1, // Always create as active
      userData.lastLogin || null,
      now,
      now
    );
    
    return this.findById(id)!;
  }

  async findById(id: string): Promise<IUser | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id) as any;
    
    if (!user) return null;
    
    return {
      ...user,
      isActive: Boolean(user.isActive),
      password: '[HIDDEN]' // Never return password
    };
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as any;
    
    if (!user) return null;
    
    return {
      ...user,
      isActive: Boolean(user.isActive),
      password: '[HIDDEN]'
    };
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as any;
    
    if (!user) return null;
    
    return {
      ...user,
      isActive: Boolean(user.isActive)
    };
  }

  async findByWalletAddress(walletAddress: string): Promise<IUser | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE walletAddress = ?');
    const user = stmt.get(walletAddress) as any;
    
    if (!user) return null;
    
    return {
      ...user,
      isActive: Boolean(user.isActive),
      password: '[HIDDEN]'
    };
  }

  async update(id: string, updates: Partial<Omit<IUser, 'id' | 'createdAt'>>): Promise<IUser | null> {
    const now = new Date().toISOString();
    const fields = [];
    const values = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return this.findById(id);
    
    fields.push('updatedAt = ?');
    values.push(now, id);
    
    const stmt = this.db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.findById(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    const now = new Date().toISOString();
    const stmt = this.db.prepare('UPDATE users SET lastLogin = ?, updatedAt = ? WHERE id = ?');
    stmt.run(now, now, id);
  }

  async comparePassword(email: string, candidatePassword: string): Promise<boolean> {
    const user = await this.findByEmailWithPassword(email);
    if (!user) return false;
    
    return bcrypt.compare(candidatePassword, user.password);
  }

  async exists(email: string, walletAddress?: string): Promise<boolean> {
    let stmt;
    let params;
    
    if (walletAddress) {
      stmt = this.db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ? OR walletAddress = ?');
      params = [email, walletAddress];
    } else {
      stmt = this.db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?');
      params = [email];
    }
    
    const result = stmt.get(...params) as { count: number };
    return result.count > 0;
  }

  async getAll(): Promise<IUser[]> {
    const stmt = this.db.prepare('SELECT * FROM users ORDER BY createdAt DESC');
    const users = stmt.all() as any[];
    
    return users.map(user => ({
      ...user,
      isActive: Boolean(user.isActive),
      password: '[HIDDEN]'
    }));
  }

  async delete(id: string): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export const sqliteUser = new SqliteUser();
