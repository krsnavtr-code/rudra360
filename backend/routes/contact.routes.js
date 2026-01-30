// backend/routes/contact.routes.js
import express from 'express';
import {
    submitContactForm,
    getContactInquiries,
    getInquiryById,
    updateInquiryStatus,
    addInquiryNote,
    deleteInquiry
} from '../controllers/contact.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public contact form submission
router.post('/submit', submitContactForm);

// Admin only routes
router.get('/inquiries', protect, authorize('admin'), getContactInquiries);
router.get('/inquiries/:id', protect, authorize('admin'), getInquiryById);
router.put('/inquiries/:id/status', protect, authorize('admin'), updateInquiryStatus);
router.post('/inquiries/:id/notes', protect, authorize('admin'), addInquiryNote);
router.delete('/inquiries/:id', protect, authorize('admin'), deleteInquiry);

export default router;
