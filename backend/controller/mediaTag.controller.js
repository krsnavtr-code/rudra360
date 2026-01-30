import MediaTag from '../models/MediaTag.model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * @desc    Create a new media tag
 * @route   POST /api/media/tags
 * @access  Private/Admin
 */
export const createMediaTag = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  
  // Add validation for required fields
  if (!name) {
    return next(new AppError('Tag name is required', 400));
  }

  // Check if user is authenticated and has admin role
  if (!req.user || !req.user.id) {
    return next(new AppError('Not authorized to perform this action', 401));
  }

  // Verify user has admin role
  if (req.user.role !== 'admin') {
    return next(new AppError('Not authorized to create tags', 403));
  }

  try {
    console.log('Creating tag with data:', {
      name: name.trim(),
      description: description ? description.trim() : undefined,
      createdBy: req.user.id
    });

    const tag = await MediaTag.create({
      name: name.trim(),
      description: description ? description.trim() : undefined,
      createdBy: req.user.id
    });

    // Remove sensitive data from response
    const tagObj = tag.toObject();
    delete tagObj.__v;

    console.log('Successfully created tag:', tagObj);

    res.status(201).json({
      status: 'success',
      data: {
        tag: tagObj
      }
    });
  } catch (error) {
    console.error('Error creating media tag:', error);

    // Handle duplicate key error (unique constraint on name)
    if (error.code === 11000) {
      return next(new AppError('A tag with this name already exists', 400));
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message);
      return next(new AppError(`Invalid input: ${message.join(', ')}`, 400));
    }

    // Handle CastError (invalid ObjectId)
    if (error.name === 'CastError') {
      return next(new AppError(`Invalid ID format: ${error.value}`, 400));
    }

    // For other errors, include the error message in the response
    next(new AppError(error.message || 'An error occurred while creating the tag', 500));
  }
});

/**
 * @desc    Get all media tags
 * @route   GET /api/media/tags
 * @access  Public
 */
// Get all media tags with pagination and search
export const getAllMediaTags = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 25, search } = req.query;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  // Get total count
  const total = await MediaTag.countDocuments(query);

  // Get paginated results
  const tags = await MediaTag.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: tags.length,
    total,
    data: {
      tags
    }
  });
});

/**
 * @desc    Get a single media tag by ID
 * @route   GET /api/media/tags/:id
 * @access  Public
 */
export const getMediaTag = catchAsync(async (req, res, next) => {
  const tag = await MediaTag.findById(req.params.id);
  
  if (!tag) {
    return next(new AppError('No media tag found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      tag
    }
  });
});

/**
 * @desc    Update a media tag
 * @route   PATCH /api/media/tags/:id
 * @access  Private/Admin
 */
export const updateMediaTag = catchAsync(async (req, res, next) => {
  const { name, description, isActive } = req.body;
  
  const tag = await MediaTag.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      isActive,
      updatedBy: req.user.id
    },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!tag) {
    return next(new AppError('No media tag found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      tag
    }
  });
});

/**
 * @desc    Delete a media tag
 * @route   DELETE /api/media/tags/:id
 * @access  Private/Admin
 */
export const deleteMediaTag = catchAsync(async (req, res, next) => {
  // First check if the tag exists
  const tag = await MediaTag.findById(req.params.id);
  
  if (!tag) {
    return next(new AppError('No media tag found with that ID', 404));
  }
  
  // Check if tag is being used by any media items
  if (tag.mediaCount > 0) {
    return next(
      new AppError(
        'Cannot delete tag that is being used by media items. Remove tag from all media items first.',
        400
      )
    );
  }
  
  // If no media items are using the tag, proceed with deletion
  await MediaTag.findByIdAndDelete(req.params.id);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * @desc    Get media items by tag
 * @route   GET /api/media/tags/:id/media
 * @access  Public
 */
export const getMediaByTag = catchAsync(async (req, res, next) => {
  // This would require the Media model to be set up with tag references
  // Implementation depends on your Media model structure
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet implemented. Media model integration required.'
  });
});

export const updateMediaTags = catchAsync(async (req, res, next) => {
  const { mediaUrl, tagIds } = req.body;
  if (!mediaUrl || !tagIds || !Array.isArray(tagIds)) {
    return next(new AppError('Media URL and tag IDs array are required', 400));
  }
  // Remove mediaUrl from all tags not in tagIds
  await MediaTag.updateMany(
    { mediaFiles: mediaUrl, _id: { $nin: tagIds } },
    { $pull: { mediaFiles: mediaUrl } }
  );
  // Add mediaUrl to all tags in tagIds
  await MediaTag.updateMany(
    { _id: { $in: tagIds } },
    { $addToSet: { mediaFiles: mediaUrl } }
  );
  // Get updated tags
  const updatedTags = await MediaTag.find({
    $or: [
      { _id: { $in: tagIds } },
      { mediaFiles: mediaUrl }
    ]
  });
  res.status(200).json({
    status: 'success',
    data: {
      tags: updatedTags
    }
  });
});