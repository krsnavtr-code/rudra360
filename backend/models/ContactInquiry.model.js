// backend/models/ContactInquiry.model.js
import mongoose from 'mongoose';

const contactInquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 255
    },
    phone: {
        type: String,
        trim: true,
        maxlength: 20
    },
    company: {
        type: String,
        trim: true,
        maxlength: 100
    },
    eventType: {
        type: String,
        required: true,
        enum: [
            'corporate-awards',
            'gala-dinner',
            'product-launch',
            'conference',
            'wedding',
            'other'
        ]
    },
    eventDate: {
        type: Date,
        default: null
    },
    message: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'in-progress', 'converted', 'closed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    notes: [{
        content: {
            type: String,
            required: true,
            maxlength: 500
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    source: {
        type: String,
        enum: ['website', 'email', 'phone', 'referral', 'social-media'],
        default: 'website'
    },
    ipAddress: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for formatted event date
contactInquirySchema.virtual('formattedEventDate').get(function () {
    if (!this.eventDate) return null;
    return this.eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Virtual for days since creation
contactInquirySchema.virtual('daysSinceCreation').get(function () {
    const now = new Date();
    const diffTime = Math.abs(now - this.createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Index for better query performance
contactInquirySchema.index({ email: 1 });
contactInquirySchema.index({ status: 1 });
contactInquirySchema.index({ createdAt: -1 });
contactInquirySchema.index({ eventType: 1 });

// Static method to get inquiry statistics
contactInquirySchema.statics.getStats = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const totalInquiries = await this.countDocuments();
    const thisMonth = await this.countDocuments({
        createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
    });

    return {
        total: totalInquiries,
        thisMonth,
        byStatus: stats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {})
    };
};

// Pre-save middleware to set priority based on event type and date
contactInquirySchema.pre('save', function () {
    // Auto-set high priority for urgent events
    if (this.eventDate) {
        const daysUntilEvent = Math.ceil((this.eventDate - new Date()) / (1000 * 60 * 60 * 24));
        if (daysUntilEvent <= 30 && daysUntilEvent > 0) {
            this.priority = 'high';
        }
    }

    // Auto-set high priority for corporate events
    if (['corporate-awards', 'product-launch'].includes(this.eventType)) {
        if (this.priority !== 'high') {
            this.priority = 'medium';
        }
    }
});

const ContactInquiry = mongoose.model('ContactInquiry', contactInquirySchema);

export default ContactInquiry;
