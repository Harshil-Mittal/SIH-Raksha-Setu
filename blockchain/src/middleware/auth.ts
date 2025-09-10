import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sqliteUser, IUser } from '../models/SqliteUser';
import { logger } from '../utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export interface AuthRequest extends Request {
  user: IUser;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.session?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'raksha-setu-secret') as any;
    const user = await sqliteUser.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error: any) {
    logger.error('Authentication error:', { error: error.message });
    res.status(401).json({
      success: false,
      error: 'Invalid token.'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. User not authenticated.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.session?.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'raksha-setu-secret') as any;
      const user = await sqliteUser.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error: any) {
    // Continue without authentication for optional auth
    next();
  }
};
