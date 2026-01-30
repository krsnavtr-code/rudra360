// backend/controllers/contact.controller.js
import nodemailer from 'nodemailer';
import ContactInquiry from '../models/ContactInquiry.model.js';

// Contact form submission
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, company, eventType, eventDate, message } = req.body;

        // Validate required fields
        if (!name || !email || !eventType) {
            return res.status(400).json({
                message: 'Name, email, and event type are required'
            });
        }

        // Save inquiry to database
        const inquiryData = {
            name,
            email,
            phone: phone || null,
            company: company || null,
            eventType,
            eventDate: eventDate ? new Date(eventDate) : null,
            message: message || null,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        };

        const savedInquiry = await new ContactInquiry(inquiryData).save();

        // Create email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        // Email to admin
        const adminEmailContent = `
            <h2>New Contact Inquiry - Rudra360</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                <p><strong>Inquiry ID:</strong> ${savedInquiry._id}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p><strong>Event Type:</strong> ${eventType}</p>
                <p><strong>Event Date:</strong> ${eventDate || 'Not specified'}</p>
                <p><strong>Priority:</strong> ${savedInquiry.priority}</p>
                <p><strong>Message:</strong></p>
                <p style="background: white; padding: 10px; border-left: 4px solid #f59e0b;">${message || 'No message provided'}</p>
            </div>
            <p style="margin-top: 20px; color: #666;">
                This inquiry was submitted on ${new Date().toLocaleString()}
            </p>
            <div style="margin-top: 20px;">
                <a href="${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/inquiries/${savedInquiry._id}" 
                   style="background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    View Inquiry in Admin Panel
                </a>
            </div>
        `;

        // Confirmation email to client
        const clientEmailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #f59e0b, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-size: 28px;">Thank You for Contacting Rudra360!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your inquiry and will be in touch soon.</p>
                </div>
                
                <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #1f2937; margin-top: 0;">Your Inquiry Details:</h2>
                    <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 8px 0;"><strong>Reference ID:</strong> ${savedInquiry._id}</p>
                        <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 8px 0;"><strong>Event Type:</strong> ${eventType}</p>
                        ${eventDate ? `<p style="margin: 8px 0;"><strong>Preferred Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>` : ''}
                    </div>
                    
                    <h3 style="color: #1f2937;">What Happens Next?</h3>
                    <ul style="color: #4b5563; line-height: 1.6;">
                        <li>Our event specialist will review your inquiry within 24 hours</li>
                        <li>You'll receive a personalized response with initial ideas and pricing</li>
                        <li>We'll schedule a consultation call to discuss your vision in detail</li>
                    </ul>
                    
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; color: #92400e;"><strong>Need immediate assistance?</strong></p>
                        <p style="margin: 5px 0 0 0; color: #92400e;">Call us at +91 98765 43210 or email events@rudra360.com</p>
                        <p style="margin: 5px 0 0 0; color: #92400e;"><strong>Reference ID:</strong> ${savedInquiry._id}</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #6b7280; font-size: 14px;">
                            Warm regards,<br>
                            <strong>The Rudra360 Team</strong><br>
                            <span style="color: #f59e0b;">Award Function Originates</span>
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Send emails (only if SMTP is configured)
        if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
            await Promise.all([
                // Email to admin
                transporter.sendMail({
                    from: process.env.SMTP_EMAIL,
                    to: process.env.ADMIN_EMAIL || 'events@rudra360.com',
                    subject: `New Inquiry: ${name} - ${eventType} (ID: ${savedInquiry._id})`,
                    html: adminEmailContent
                }),

                // Confirmation email to client
                transporter.sendMail({
                    from: process.env.SMTP_EMAIL,
                    to: email,
                    subject: 'Thank You for Your Inquiry - Rudra360',
                    html: clientEmailContent
                })
            ]);
        } else {
            console.log('SMTP not configured - skipping email notifications');
        }

        res.status(200).json({
            success: true,
            inquiryId: savedInquiry._id,
            message: 'Your inquiry has been submitted successfully! We will contact you within 24 hours.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            message: 'Failed to submit inquiry. Please try again or contact us directly.'
        });
    }
};

// Get all contact inquiries (admin only)
export const getContactInquiries = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, eventType, search } = req.query;

        // Build query
        const query = {};
        if (status) query.status = status;
        if (eventType) query.eventType = eventType;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }

        const inquiries = await ContactInquiry.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('assignedTo', 'name email');

        const total = await ContactInquiry.countDocuments(query);
        const stats = await ContactInquiry.getStats();

        res.json({
            inquiries,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            stats
        });
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ message: 'Failed to fetch inquiries' });
    }
};

// Get single inquiry by ID (admin only)
export const getInquiryById = async (req, res) => {
    try {
        const inquiry = await ContactInquiry.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('notes.createdBy', 'name email');

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.json(inquiry);
    } catch (error) {
        console.error('Error fetching inquiry:', error);
        res.status(500).json({ message: 'Failed to fetch inquiry' });
    }
};

// Update inquiry status (admin only)
export const updateInquiryStatus = async (req, res) => {
    try {
        const { status, priority, assignedTo } = req.body;

        const inquiry = await ContactInquiry.findByIdAndUpdate(
            req.params.id,
            {
                status,
                priority,
                assignedTo,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'name email');

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.json(inquiry);
    } catch (error) {
        console.error('Error updating inquiry:', error);
        res.status(500).json({ message: 'Failed to update inquiry' });
    }
};

// Add note to inquiry (admin only)
export const addInquiryNote = async (req, res) => {
    try {
        const { content } = req.body;

        const inquiry = await ContactInquiry.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    notes: {
                        content,
                        createdBy: req.user.id,
                        createdAt: new Date()
                    }
                }
            },
            { new: true }
        ).populate('notes.createdBy', 'name email');

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.json(inquiry);
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ message: 'Failed to add note' });
    }
};

// Delete inquiry (admin only)
export const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await ContactInquiry.findByIdAndDelete(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        res.status(500).json({ message: 'Failed to delete inquiry' });
    }
};
