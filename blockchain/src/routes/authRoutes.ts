import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import Joi from 'joi';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  role: Joi.string().valid('admin', 'police', 'tourism', 'tourist').required(),
  language: Joi.string().optional().default('en'),
  nationality: Joi.string().optional(),
  walletAddress: Joi.string().optional().pattern(/^0x[a-fA-F0-9]{40}$/)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: value.email },
        { walletAddress: value.walletAddress }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or wallet address already exists'
      });
    }

    // Create new user
    const user = await User.create(value);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'raksha-setu-secret',
      { expiresIn: '7d' }
    );

    // Store token in session
    req.session = req.session || {};
    req.session.token = token;

    logger.info('User registered successfully', { userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          walletAddress: user.walletAddress,
          isActive: user.isActive,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error: any) {
    logger.error('Registration error:', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Find user and check password
    const isPasswordValid = await sqliteUser.comparePassword(value.email, value.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Get user details
    const user = await sqliteUser.findByEmail(value.email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Update last login
    await sqliteUser.updateLastLogin(user.id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'raksha-setu-secret',
      { expiresIn: '7d' }
    );

    // Store token in session
    req.session = req.session || {};
    req.session.token = token;

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          walletAddress: user.walletAddress,
          isActive: user.isActive,
          lastLogin: user.lastLogin
        },
        token
      }
    });
  } catch (error: any) {
    logger.error('Login error:', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Get current user profile
router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          walletAddress: req.user.walletAddress,
          isActive: req.user.isActive,
          lastLogin: req.user.lastLogin,
          createdAt: req.user.createdAt
        }
      }
    });
  } catch (error: any) {
    logger.error('Profile fetch error:', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, walletAddress } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (walletAddress) {
      if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid wallet address format'
        });
      }
      updateData.walletAddress = walletAddress;
    }

    const user = await sqliteUser.update(req.user.id, updateData);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          walletAddress: user.walletAddress,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error: any) {
    logger.error('Profile update error:', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Logout user
router.post('/logout', (req: Request, res: Response) => {
  try {
    // Clear session
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          logger.error('Session destroy error:', { error: err.message });
        }
      });
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    logger.error('Logout error:', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

export default router;
