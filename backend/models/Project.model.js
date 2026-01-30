import mongoose from 'mongoose';
import slugify from 'slugify';

/**
 * Project Schema
 * Use Case:
 * - Portfolio projects
 * - SEO friendly
 * - Admin controlled
 * - Scalable for future
 */

const ProjectSchema = new mongoose.Schema({

    /* ===============================
     1. Core Identification
    =============================== */
    title: {
        type: String,
        required: [true, 'Please add a project title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },

    /* ===============================
     2. Client & Industry Info
    =============================== */
    clientName: {
        type: String,
        default: 'NDA / Confidential'
    },
    industry: {
        type: String,
        required: true,
        trim: true
    },
    projectStatus: {
        type: String,
        enum: ['Live', 'In Development', 'Maintenance', 'Archived'],
        default: 'Live'
    },
    completionDate: Date,

    /* ===============================
     3. Categorization
    =============================== */
    category: {
        type: String,
        required: [true, 'Please select a main category'],
        index: true
    },
    subCategories: {
        type: [String],
        index: true,
        default: []
    },

    /* ===============================
     4. Technology Stack
    =============================== */
    techStack: [
        {
            name: { type: String },
            iconUrl: { type: String }
        }
    ],

    /* ===============================
     5. Case Study Content
    =============================== */
    shortDescription: {
        type: String,
        trim: true,
        maxlength: [200, 'Short description cannot be more than 200 characters']
    },
    fullDescription: {
        type: String,
        trim: true
    },
    overview: {
        challenge: {
            type: String,
            required: true
        },
        solution: {
            type: String,
            required: true
        },
        result: {
            type: String
        }
    },
    keyFeatures: {
        type: [String],
        default: []
    },

    /* ===============================
     6. Media Assets
    =============================== */
    thumbnail: {
        type: String,
    },
    heroImage: String,
    gallery: {
        type: [String],
        default: []
    },
    videoUrl: String,

    /* ===============================
     7. External Links
    =============================== */
    liveUrl: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
            'Please use a valid URL'
        ]
    },
    gitRepoUrlOne: String,
    gitRepoUrlTwo: String,

    /* ===============================
     8. Services Mapping
    =============================== */
    servicesProvided: {
        type: [String],
        index: true,
        default: []
    },

    /* ===============================
     9. Project Metrics
    =============================== */
    metrics: {
        durationInWeeks: Number,
        teamSize: Number,
        totalScreens: Number,
        totalUsers: Number
    },

    /* ===============================
     10. Client Testimonial
    =============================== */
    testimonial: {
        name: String,
        designation: String,
        company: String,
        message: String,
        avatar: String
    },

    /* ===============================
     11. SEO / META
    =============================== */
    seo: {
        metaTitle: {
            type: String,
            maxlength: 60
        },
        metaDescription: {
            type: String,
            maxlength: 160
        },
        metaKeywords: {
            type: [String],
            default: []
        },
        canonicalUrl: String,
        ogImage: String
    },

    /* ===============================
     12. Visibility & Control
    =============================== */
    visibility: {
        type: String,
        enum: ['Public', 'Private', 'Draft'],
        default: 'Public'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    sortOrder: {
        type: Number,
        default: 0
    },

    /* ===============================
     13. Analytics
    =============================== */
    views: {
        type: Number,
        default: 0
    },
    lastViewedAt: Date,

    /* ===============================
     14. CTA
    =============================== */
    cta: {
        showInquiryButton: {
            type: Boolean,
            default: true
        },
        inquiryLabel: {
            type: String,
            default: 'Start a Similar Project'
        }
    },

    /* ===============================
     15. System Fields
    =============================== */
    createdAt: {
        type: Date,
        default: Date.now
    }

});

/* ===============================
 Slug Auto Generate Middleware
=============================== */
ProjectSchema.pre('save', function (next) {
    if (!this.isModified('title')) {
        return next();
    }

    this.slug = slugify(this.title, {
        lower: true,
        strict: true
    });

    next();
});

const Project = mongoose.model('Project', ProjectSchema);
export default Project;
