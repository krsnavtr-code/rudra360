import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Corporate Events',
      'Weddings',
      'Birthday Parties',
      'Conferences',
      'Product Launches',
      'Award Ceremonies',
      'Cultural Events',
      'Virtual Events',
      'Technical Galas',
      'Charity Events',
      'Team Building',
      'Trade Shows'
    ]
  },
  clientName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  eventDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  budget: {
    type: Number,
    min: 0
  },
  attendees: {
    type: Number,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'ongoing', 'upcoming', 'cancelled'],
    default: 'completed'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  images: [{
    url: String,
    publicId: String,
    caption: String
  }],
  videos: [{
    url: String,
    publicId: String,
    caption: String,
    thumbnail: String
  }],
  highlights: {
    type: String,
    maxlength: 500
  },
  testimonial: {
    type: String,
    maxlength: 500
  },
  testimonialAuthor: {
    type: String,
    maxlength: 100
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
portfolioSchema.index({ category: 1 });
portfolioSchema.index({ status: 1 });
portfolioSchema.index({ featured: 1 });
portfolioSchema.index({ eventDate: -1 });
portfolioSchema.index({ createdBy: 1 });
portfolioSchema.index({ title: 'text', description: 'text', clientName: 'text' });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
