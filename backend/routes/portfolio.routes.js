import express from 'express';
import {
  getAllPortfolioItems,
  getPortfolioItemById,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  toggleFeatured,
  getPortfolioStats
} from '../controllers/portfolio.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes (for frontend display)
router.get('/public', getAllPortfolioItems);
router.get('/public/stats', getPortfolioStats);
router.get('/public/:id', getPortfolioItemById);

// Admin routes (protected)
router.use(protect, authorize('admin'));

// Portfolio CRUD operations
router.get('/', getAllPortfolioItems);
router.get('/stats', getPortfolioStats);
router.get('/:id', getPortfolioItemById);
router.post('/', createPortfolioItem);
router.put('/:id', updatePortfolioItem);
router.delete('/:id', deletePortfolioItem);

// Toggle featured status
router.patch('/:id/toggle-featured', toggleFeatured);

export default router;
