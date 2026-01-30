import User from '../models/User.model.js';
import Project from '../models/Project.model.js';
import { protect, authorize } from '../middleware/auth.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const featuredProjects = await Project.countDocuments({ isFeatured: true });
        const publicProjects = await Project.countDocuments({ visibility: 'Public' });

        // Get recent activity
        const recentUsers = await User.find()
            .select('name email role createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentProjects = await Project.find()
            .select('title clientName category createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get project status distribution
        const projectStatusStats = await Project.aggregate([
            {
                $group: {
                    _id: '$projectStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get category distribution
        const categoryStats = await Project.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            }
        ]);

        // Get user role distribution
        const userRoleStats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        const stats = {
            overview: {
                totalUsers,
                totalProjects,
                featuredProjects,
                publicProjects
            },
            recentActivity: {
                recentUsers,
                recentProjects
            },
            analytics: {
                projectStatusStats,
                categoryStats,
                userRoleStats
            },
            lastUpdated: new Date()
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getSystemHealth = async (req, res) => {
    try {
        const health = {
            status: 'healthy',
            timestamp: new Date(),
            database: {
                status: 'connected',
                collections: {
                    users: await User.countDocuments(),
                    projects: await Project.countDocuments()
                }
            },
            memory: process.memoryUsage(),
            uptime: process.uptime()
        };

        res.status(200).json(health);
    } catch (error) {
        console.error('Error fetching system health:', error);
        res.status(500).json({
            status: 'unhealthy',
            message: 'Server error',
            timestamp: new Date()
        });
    }
};
