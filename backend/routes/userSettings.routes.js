// backend/routes/userSettings.routes.js
import express from 'express';
import path from 'path';
import { protect } from '../middleware/auth.js';
import {
    getUserProfile,
    updateProfile,
    updatePassword,
    updatePreferences,
    updatePrivacySettings,
    uploadAvatar,
    deleteAccount,
    exportUserData,
    enableTwoFactor,
    disableTwoFactor
} from '../controllers/userSettings.controller.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for avatar uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/avatars/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Apply authentication middleware to all routes
router.use(protect);

// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

// Preferences routes
router.put('/preferences', updatePreferences);
router.put('/privacy', updatePrivacySettings);

// Avatar upload
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// Two-factor authentication
router.post('/2fa/enable', enableTwoFactor);
router.post('/2fa/disable', disableTwoFactor);

// Data management
router.get('/export-data', exportUserData);
router.delete('/account', deleteAccount);

export default router;
