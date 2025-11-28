const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      max: [10, 'Maximum quantity per item is 10']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for total price
cartSchema.virtual('totalPrice').get(function() {
  return this.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
});

// Method to add item to cart
cartSchema.methods.addItem = async function(productId, quantity = 1) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    if (existingItem.quantity > 10) {
      existingItem.quantity = 10;
    }
  } else {
    this.items.push({ product: productId, quantity });
  }

  return await this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
  return await this.save();
};

// Method to update item quantity
cartSchema.methods.updateQuantity = async function(productId, quantity) {
  const item = this.items.find(item => 
    item.product.toString() === productId.toString()
  );

  if (item) {
    if (quantity <= 0) {
      return await this.removeItem(productId);
    } else if (quantity > 10) {
      item.quantity = 10;
    } else {
      item.quantity = quantity;
    }
  }

  return await this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = async function() {
  this.items = [];
  return await this.save();
};

// Method to clean up null products from cart
cartSchema.methods.cleanupCart = async function() {
  this.items = this.items.filter(item => item.product != null);
  return await this.save();
};

// Pre-save middleware to populate product details
cartSchema.pre('save', async function(next) {
  if (this.isModified('items')) {
    try {
      await this.populate('items.product', 'name price images stock');
      
      // Check stock availability
      for (let item of this.items) {
        if (item.product.stock < item.quantity) {
          return next(new Error(`Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`));
        }
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
