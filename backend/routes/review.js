const express = require('express');
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  reportReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.use(protect);

router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markReviewHelpful);
router.post('/:id/report', reportReview);

module.exports = router;
