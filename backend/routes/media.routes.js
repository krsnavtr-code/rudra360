import express from 'express';
import { checkImageUsage } from '../controller/media.controller.js';
import mediaTagRouter from './mediaTag.routes.js';
import { protect, authorize } from '../middleware/auth.js';
import { updateMediaTags } from '../controller/mediaTag.controller.js';

const router = express.Router();

/**
 * @route   GET /api/media/check-usage
 * @desc    Check if an image is being used in the system
 * @access  Private/Admin
 * @query   {string} url - The URL of the image to check
 */
router.route('/check-usage')
    .get(protect, authorize('admin'), checkImageUsage);

// Define specific routes before mounting the router
router.patch('/tags/update-media', updateMediaTags);

// Mount media tag routes at /api/media/tags
router.use('/tags', mediaTagRouter);

export default router;
