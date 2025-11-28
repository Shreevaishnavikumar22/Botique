const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { productId, orderId, rating, title, comment, images } = req.body;

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Verify that the user has purchased this product
    const order = await Order.findOne({
      user: req.user.id,
      _id: orderId,
      orderStatus: 'delivered',
      'items.product': productId
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'You can only review products you have purchased and received'
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      product: productId,
      order: orderId,
      rating,
      title,
      comment,
      images: images || [],
      verified: true
    });

    // Populate review with user details
    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    // Build query
    let query = { product: productId, isActive: true };
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Review.countDocuments(query);

    // Get rating summary
    const ratingSummary = await Review.aggregate([
      { $match: { product: productId, isActive: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: '$count' },
          averageRating: { $avg: '$_id' },
          ratings: {
            $push: {
              rating: '$_id',
              count: '$count'
            }
          }
        }
      }
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? parseInt(page) + 1 : null,
        prevPage: hasPrevPage ? parseInt(page) - 1 : null
      },
      ratingSummary: ratingSummary.length > 0 ? ratingSummary[0] : {
        totalReviews: 0,
        averageRating: 0,
        ratings: []
      },
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    const { rating, title, comment, images } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Update review
    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.images = images || review.images;

    await review.save();

    // Populate review with user details
    await review.populate('user', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
exports.markReviewHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user has already marked this review as helpful
    const hasMarkedHelpful = review.helpful.users.includes(req.user.id);

    if (hasMarkedHelpful) {
      await review.unmarkHelpful(req.user.id);
      res.status(200).json({
        success: true,
        message: 'Review marked as not helpful',
        helpfulCount: review.helpful.count
      });
    } else {
      await review.markHelpful(req.user.id);
      res.status(200).json({
        success: true,
        message: 'Review marked as helpful',
        helpfulCount: review.helpful.count
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while marking review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Report review
// @route   POST /api/reviews/:id/report
// @access  Private
exports.reportReview = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user has already reported this review
    if (review.reported.users.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this review'
      });
    }

    await review.reportReview(req.user.id, reason);

    res.status(200).json({
      success: true,
      message: 'Review reported successfully',
      reportedCount: review.reported.count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while reporting review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
