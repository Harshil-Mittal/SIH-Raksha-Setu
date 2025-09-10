import { Router, Request, Response } from 'express';
import User from '../models/User';
import { logger } from '../utils/logger';

const router = Router();

// Blockchain Portal - View all registered users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        users,
        total: users.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    logger.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// Blockchain Portal - View user details
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    logger.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// Blockchain Portal - Get blockchain statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const recentUsers = await User.find({}, '-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        usersByRole,
        recentUsers,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    logger.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// Blockchain Portal - Search users
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, role, active } = req.query;
    
    let query: any = {};
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { walletAddress: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const users = await User.find(query, '-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        users,
        total: users.length,
        query: { q, role, active },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    logger.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search users'
    });
  }
});

export default router;
