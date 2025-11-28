const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [200, 'Product name cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot be more than 100%']
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: [
      'Wedding',
      'Funeral',
      'Birthday',
      'Anniversary',
      'Valentine\'s Day',
      'Mother\'s Day',
      'Fresh Flowers',
      'Potted Plants',
      'Floral Accessories'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please provide product brand'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please provide product model'],
    trim: true
  },
  capacity: {
    value: {
      type: Number,
      required: [true, 'Please provide flower count or quantity']
    },
    unit: {
      type: String,
      required: [true, 'Please provide quantity unit'],
      enum: ['roses', 'stems', 'bouquets', 'arrangements', 'plants', 'pieces', 'lilies', 'sunflowers', 'orchids', 'wreaths', 'candles', 'candle', 'artwork']
    }
  },
  color: {
    type: String,
    required: [true, 'Please provide flower color']
  },
  freshness: {
    period: {
      type: Number,
      required: [true, 'Please provide freshness period']
    },
    unit: {
      type: String,
      required: [true, 'Please provide freshness unit'],
      enum: ['days', 'weeks'],
      default: 'days'
    }
  },
  features: [{
    type: String,
    trim: true
  }],
  specifications: {
    weight: String,
    dimensions: String,
    material: String,
    color: String,
    countryOfOrigin: String,
    barcode: String,
    isbn: String
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sold: {
    type: Number,
    default: 0,
    min: [0, 'Sold quantity cannot be negative']
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  reviews: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Review'
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, brand: 1, price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount percentage calculation
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Method to update ratings
productSchema.methods.updateRatings = async function() {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    {
      $match: { product: this._id }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    this.ratings.average = Math.round(stats[0].averageRating * 10) / 10;
    this.ratings.count = stats[0].totalReviews;
  } else {
    this.ratings.average = 0;
    this.ratings.count = 0;
  }
  
  await this.save();
};

// Pre-save middleware to update stock
productSchema.pre('save', function(next) {
  if (this.isModified('stock') && this.stock < 0) {
    return next(new Error('Stock cannot be negative'));
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
