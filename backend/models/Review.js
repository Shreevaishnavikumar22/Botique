const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  title: {
    type: String,
    required: [true, 'Please provide a review title'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  images: [{
    public_id: String,
    url: String,
    alt: String
  }],
  helpful: {
    count: {
      type: Number,
      default: 0,
      min: [0, 'Helpful count cannot be negative']
    },
    users: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }]
  },
  verified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  reported: {
    count: {
      type: Number,
      default: 0,
      min: [0, 'Reported count cannot be negative']
    },
    users: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }],
    reasons: [String]
  }
}, {
  timestamps: true
});

// Compound index to ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Index for better query performance
reviewSchema.index({ product: 1, rating: -1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

// Virtual for user info
reviewSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name avatar' }
});

// Method to mark as helpful
reviewSchema.methods.markHelpful = async function(userId) {
  if (!this.helpful.users.includes(userId)) {
    this.helpful.users.push(userId);
    this.helpful.count += 1;
    return await this.save();
  }
  return this;
};

// Method to unmark as helpful
reviewSchema.methods.unmarkHelpful = async function(userId) {
  if (this.helpful.users.includes(userId)) {
    this.helpful.users = this.helpful.users.filter(
      id => id.toString() !== userId.toString()
    );
    this.helpful.count = Math.max(0, this.helpful.count - 1);
    return await this.save();
  }
  return this;
};

// Method to report review
reviewSchema.methods.reportReview = async function(userId, reason) {
  if (!this.reported.users.includes(userId)) {
    this.reported.users.push(userId);
    if (reason && !this.reported.reasons.includes(reason)) {
      this.reported.reasons.push(reason);
    }
    this.reported.count += 1;
    return await this.save();
  }
  return this;
};

// Pre-save middleware to verify purchase
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Order = mongoose.model('Order');
    const order = await Order.findOne({
      user: this.user,
      _id: this.order,
      orderStatus: 'delivered',
      'items.product': this.product
    });

    if (!order) {
      return next(new Error('You can only review products you have purchased and received'));
    }

    this.verified = true;
  }
  next();
});

// Post-save middleware to update product ratings
reviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  if (product) {
    await product.updateRatings();
  }
});

// Post-remove middleware to update product ratings
reviewSchema.post('remove', async function() {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  if (product) {
    await product.updateRatings();
  }
});

module.exports = mongoose.model('Review', reviewSchema);
