// backend/controllers/userSettings.controller.js
import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -twoFactorSecret');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, location, bio } = req.body;
        
        // Check if email is already taken by another user
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, phone, location, bio },
            { new: true, runValidators: true }
        ).select('-password -twoFactorSecret');

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update password
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user preferences
export const updatePreferences = async (req, res) => {
    try {
        const { theme, language, timezone, notifications } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 
                'preferences.theme': theme,
                'preferences.language': language,
                'preferences.timezone': timezone,
                'preferences.notifications': notifications
            },
            { new: true, runValidators: true }
        ).select('-password -twoFactorSecret');

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update privacy settings
export const updatePrivacySettings = async (req, res) => {
    try {
        const { profileVisibility, showEmail, showPhone, allowMessages } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 
                'preferences.privacy.profileVisibility': profileVisibility,
                'preferences.privacy.showEmail': showEmail,
                'preferences.privacy.showPhone': showPhone,
                'preferences.privacy.allowMessages': allowMessages
            },
            { new: true, runValidators: true }
        ).select('-password -twoFactorSecret');

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating privacy settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const avatarUrl = req.file.path; // Assuming you're using a file upload middleware like multer

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: avatarUrl },
            { new: true }
        ).select('-password -twoFactorSecret');

        res.json(updatedUser);
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user account
export const deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Export user data
export const exportUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -twoFactorSecret');
        
        const userData = {
            profile: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                bio: user.bio,
                avatar: user.avatar
            },
            preferences: user.preferences,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="user-data.json"');
        res.json(userData);
    } catch (error) {
        console.error('Error exporting user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Enable two-factor authentication
export const enableTwoFactor = async (req, res) => {
    try {
        // This is a placeholder - you would integrate with a 2FA service like Speakeasy
        const secret = 'generated-secret'; // Generate actual secret
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { twoFactorEnabled: true, twoFactorSecret: secret },
            { new: true }
        ).select('-password -twoFactorSecret');

        res.json({ 
            message: 'Two-factor authentication enabled',
            secret: secret // In production, show QR code instead
        });
    } catch (error) {
        console.error('Error enabling 2FA:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Disable two-factor authentication
export const disableTwoFactor = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { twoFactorEnabled: false, twoFactorSecret: null },
            { new: true }
        ).select('-password -twoFactorSecret');

        res.json({ message: 'Two-factor authentication disabled' });
    } catch (error) {
        console.error('Error disabling 2FA:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
