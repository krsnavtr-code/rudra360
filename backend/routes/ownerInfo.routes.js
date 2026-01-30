import express from 'express';
import {
    getOwnerInfo,
    createOrUpdateOwnerInfo,
    getAllOwnerInfo,
    toggleStatus,
    deleteOwner
} from '../controllers/ownerInfo.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/', getOwnerInfo);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

// CRUD operations for owner info documents
router.route('/')
    .post(createOrUpdateOwnerInfo);

// Get all owner info records
router.get('/all', getAllOwnerInfo);

// Toggle active status of an owner info document
router.patch('/:id/status', toggleStatus);

// Delete a specific owner from an owner info document
router.delete('/owner/:ownerId', deleteOwner);

export default router;