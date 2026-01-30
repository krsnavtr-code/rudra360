import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/admin.controller.js';

const router = express.Router();

// Protect all routes with authentication and admin authorization
router.use(protect);
router.use(authorize('admin'));

// Admin user management routes
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

export default router;
