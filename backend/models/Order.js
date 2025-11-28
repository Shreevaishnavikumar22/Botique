const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    image: {
      type: String,
      required: true
    }
  }],
  shippingAddress: {
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    name: {
      type: String,
      required: [true, 'Please provide recipient name']
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number']
    },
    address: {
      type: String,
      required: [true, 'Please provide address']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    state: {
      type: String,
      required: [true, 'Please provide state']
    },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode']
    }
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['cod', 'online', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundId: String,
    refundedAt: Date
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  pricing: {
    itemsPrice: {
      type: Number,
      required: true,
      default: 0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    }
  },
  trackingInfo: {
    trackingNumber: String,
    courier: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date
  },
  notes: {
    customer: String,
    admin: String
  },
  cancellationReason: String,
  cancelledAt: Date,
  cancelledBy: {
    type: String,
    enum: ['customer', 'admin', 'system']
  }
}, {
  timestamps: true
});

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of orders today
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const orderCount = await this.constructor.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    const sequence = (orderCount + 1).toString().padStart(4, '0');
    this.orderNumber = `BAT${year}${month}${day}${sequence}`;
  }
  next();
});

// Virtual for order summary
orderSchema.virtual('summary').get(function() {
  return {
    orderNumber: this.orderNumber,
    totalItems: this.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: this.pricing.totalPrice,
    status: this.orderStatus,
    createdAt: this.createdAt
  };
});

// Method to update order status
orderSchema.methods.updateStatus = async function(status, notes = '') {
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['processing', 'cancelled'],
    'processing': ['shipped', 'cancelled'],
    'shipped': ['delivered'],
    'delivered': [],
    'cancelled': []
  };

  if (!validTransitions[this.orderStatus].includes(status)) {
    throw new Error(`Invalid status transition from ${this.orderStatus} to ${status}`);
  }

  this.orderStatus = status;
  
  if (notes) {
    this.notes.admin = notes;
  }

  // Set timestamps for specific statuses
  if (status === 'shipped') {
    this.trackingInfo.shippedAt = new Date();
  } else if (status === 'delivered') {
    this.trackingInfo.deliveredAt = new Date();
  } else if (status === 'cancelled') {
    this.cancelledAt = new Date();
  }

  return await this.save();
};

// Method to calculate pricing
orderSchema.methods.calculatePricing = function() {
  this.pricing.itemsPrice = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Shipping is free for orders above ₹999
  this.pricing.shippingPrice = this.pricing.itemsPrice >= 999 ? 0 : 50;
  
  // Tax calculation (18% GST)
  this.pricing.taxPrice = Math.round(this.pricing.itemsPrice * 0.18);
  
  this.pricing.totalPrice = this.pricing.itemsPrice + this.pricing.shippingPrice + this.pricing.taxPrice;
  
  return this.pricing;
};

// Index for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });

module.exports = mongoose.model('Order', orderSchema);
