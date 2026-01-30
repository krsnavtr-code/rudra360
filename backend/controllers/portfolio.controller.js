import Portfolio from '../models/Portfolio.model.js';

// Get all portfolio items with filtering and pagination
export const getAllPortfolioItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      featured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [portfolioItems, total] = await Promise.all([
      Portfolio.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email')
        .lean(),
      Portfolio.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: portfolioItems,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio items',
      error: error.message
    });
  }
};

// Get single portfolio item by ID
export const getPortfolioItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const portfolioItem = await Portfolio.findById(id)
      .populate('createdBy', 'name email')
      .lean();

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    res.json({
      success: true,
      data: portfolioItem
    });
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio item',
      error: error.message
    });
  }
};

// Create new portfolio item
export const createPortfolioItem = async (req, res) => {
  try {
    const portfolioData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Parse tags if sent as string
    if (typeof portfolioData.tags === 'string') {
      portfolioData.tags = portfolioData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    // Parse budget and attendees
    if (portfolioData.budget) {
      portfolioData.budget = parseFloat(portfolioData.budget);
    }
    if (portfolioData.attendees) {
      portfolioData.attendees = parseInt(portfolioData.attendees);
    }

    const portfolioItem = new Portfolio(portfolioData);
    await portfolioItem.save();

    const populatedItem = await Portfolio.findById(portfolioItem._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedItem,
      message: 'Portfolio item created successfully'
    });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create portfolio item',
      error: error.message
    });
  }
};

// Update portfolio item
export const updatePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parse tags if sent as string
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    // Parse budget and attendees
    if (updateData.budget) {
      updateData.budget = parseFloat(updateData.budget);
    }
    if (updateData.attendees) {
      updateData.attendees = parseInt(updateData.attendees);
    }

    const portfolioItem = await Portfolio.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    res.json({
      success: true,
      data: portfolioItem,
      message: 'Portfolio item updated successfully'
    });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update portfolio item',
      error: error.message
    });
  }
};

// Delete portfolio item
export const deletePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;

    const portfolioItem = await Portfolio.findById(id);
    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    await Portfolio.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Portfolio item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete portfolio item',
      error: error.message
    });
  }
};

// Toggle featured status
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const portfolioItem = await Portfolio.findById(id);
    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    portfolioItem.featured = !portfolioItem.featured;
    await portfolioItem.save();

    res.json({
      success: true,
      data: portfolioItem,
      message: `Portfolio item ${portfolioItem.featured ? 'featured' : 'unfeatured'} successfully`
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle featured status',
      error: error.message
    });
  }
};

// Get portfolio statistics
export const getPortfolioStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      Portfolio.countDocuments(),
      Portfolio.countDocuments({ featured: true }),
      Portfolio.countDocuments({ status: 'completed' }),
      Portfolio.countDocuments({ status: 'ongoing' }),
      Portfolio.countDocuments({ status: 'upcoming' }),
      Portfolio.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total: stats[0],
        featured: stats[1],
        completed: stats[2],
        ongoing: stats[3],
        upcoming: stats[4],
        categories: stats[5]
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio statistics',
      error: error.message
    });
  }
};
