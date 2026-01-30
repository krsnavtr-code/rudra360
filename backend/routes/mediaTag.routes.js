import express from 'express';
import {
  createMediaTag,
  getAllMediaTags,
  getMediaTag,
  updateMediaTag,
  deleteMediaTag,
  getMediaByTag
} from '../controller/mediaTag.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Routes for media tags
router
  .route('/')
  .get(getAllMediaTags)
  .post(authorize('admin'), createMediaTag);

router
  .route('/:id')
  .get(getMediaTag)
  .patch(authorize('admin'), updateMediaTag)
  .delete(authorize('admin'), deleteMediaTag);

// Get media items by tag
router.get('/:id/media', getMediaByTag);

export default router;
