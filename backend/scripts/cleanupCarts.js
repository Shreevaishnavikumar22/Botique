const mongoose = require('mongoose');
const Cart = require('../models/Cart');
require('dotenv').config({ path: './config.env' });

const cleanupCarts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all carts
    const carts = await Cart.find({});
    console.log(`Found ${carts.length} carts to check`);

    let cleanedCount = 0;
    for (const cart of carts) {
      const originalLength = cart.items.length;
      await cart.cleanupCart();
      const newLength = cart.items.length;
      
      if (originalLength !== newLength) {
        console.log(`Cleaned cart for user ${cart.user}: ${originalLength} -> ${newLength} items`);
        cleanedCount++;
      }
    }

    console.log(`Cleanup complete! ${cleanedCount} carts were cleaned`);
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning up carts:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  cleanupCarts();
}

module.exports = { cleanupCarts };