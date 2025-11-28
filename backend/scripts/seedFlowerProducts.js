const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config({ path: './config.env' });

// For demo purposes, we'll create a sample admin user ID
// In production, this should be a real admin user ID
const SAMPLE_ADMIN_ID = new mongoose.Types.ObjectId();

const sampleFlowerProducts = [
  {
    name: "Red Roses Bouquet",
    description: "Beautiful red roses arranged in an elegant bouquet. Perfect for romantic occasions, anniversaries, or expressing love. These premium quality roses are fresh and long-lasting.",
    price: 899,
    originalPrice: 1199,
    category: "Anniversary",
    brand: "Premium Flowers",
    model: "RRB-001",
    capacity: {
      value: 12,
      unit: "roses"
    },
    color: "Red",
    freshness: {
      period: 7,
      unit: "days"
    },
    stock: 25,
    features: [
      "12 fresh red roses",
      "Elegant ribbon wrapping",
      "Includes care instructions",
      "Same day delivery available",
      "Premium quality stems"
    ],
    images: [
      {
        public_id: "red_roses_1",
        url: "/uploads/products/red-roses.jpg"
      }
    ],
    ratings: {
      average: 4.8,
      count: 156
    },
    createdBy: SAMPLE_ADMIN_ID
  },
  {
    name: "Pink Tulips Arrangement",
    description: "Stunning pink tulips in a beautiful arrangement. These spring flowers bring joy and elegance to any space. Perfect for home decoration or gifting.",
    price: 649,
    originalPrice: 799,
    category: "Fresh Flowers", 
    brand: "Spring Blooms",
    model: "PTA-002",
    capacity: {
      value: 15,
      unit: "stems"
    },
    color: "Pink",
    freshness: {
      period: 5,
      unit: "days"
    },
    stock: 18,
    features: [
      "15 pink tulips",
      "Decorative vase included",
      "Fresh spring blooms",
      "Perfect for home decor",
      "Long-lasting freshness"
    ],
    images: [
      {
        public_id: "pink_tulips_1",
        url: "/uploads/products/pink-tulips.jpg"
      }
    ],
    ratings: {
      average: 4.6,
      count: 89
    },
    createdBy: SAMPLE_ADMIN_ID
  },
  {
    name: "White Lilies Bunch",
    description: "Pure white lilies symbolizing peace and tranquility. These elegant flowers are perfect for sympathy, weddings, or creating a serene atmosphere.",
    price: 749,
    originalPrice: 949,
    category: "Wedding",
    brand: "Elegant Blooms", 
    model: "WLB-003",
    capacity: {
      value: 8,
      unit: "lilies"
    },
    color: "White",
    freshness: {
      period: 10,
      unit: "days"
    },
    stock: 12,
    features: [
      "8 white lilies",
      "Symbol of purity",
      "Fresh and fragrant",
      "Perfect for events",
      "Premium quality"
    ],
    images: [
      {
        public_id: "white_lilies_1",
        url: "/uploads/products/white-lilies.jpg"
      }
    ],
    ratings: {
      average: 4.9,
      count: 67
    },
    createdBy: SAMPLE_ADMIN_ID
  },
  {
    name: "Sunflower Collection",
    description: "Bright and cheerful sunflowers that bring sunshine to any day. These vibrant flowers are perfect for lifting spirits and adding warmth to your space.",
    price: 599,
    originalPrice: 749,
    category: "Fresh Flowers",
    brand: "Sunny Flowers",
    model: "SFC-004",
    capacity: {
      value: 6,
      unit: "sunflowers"
    },
    color: "Yellow",
    freshness: {
      period: 7,
      unit: "days"
    },
    stock: 30,
    features: [
      "6 large sunflowers",
      "Bright yellow petals",
      "Mood-lifting flowers",
      "Perfect for kitchens",
      "Long stem variety"
    ],
    images: [
      {
        public_id: "sunflowers_1",
        url: "/uploads/products/sunflower-collection.jpg"
      }
    ],
    ratings: {
      average: 4.7,
      count: 124
    },
    createdBy: SAMPLE_ADMIN_ID
  },
  {
    name: "Mixed Flower Bouquet",
    description: "A delightful mix of seasonal flowers creating a colorful and vibrant bouquet. Perfect for celebrations, birthdays, or brightening someone's day.",
    price: 999,
    originalPrice: 1299,
    category: "Birthday",
    brand: "Rainbow Blooms",
    model: "MFB-005",
    capacity: {
      value: 1,
      unit: "bouquets"
    },
    color: "Mixed",
    freshness: {
      period: 6,
      unit: "days"
    },
    stock: 20,
    features: [
      "Assorted seasonal flowers",
      "Colorful arrangement",
      "Designer bouquet",
      "Perfect for celebrations",
      "Includes flower food"
    ],
    images: [
      {
        public_id: "mixed_bouquet_1",
        url: "/uploads/products/mixed-flower-bouquet.jpg"
      }
    ],
    ratings: {
      average: 4.8,
      count: 203
    },
    createdBy: SAMPLE_ADMIN_ID
  }
];

const seedFlowerProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample flower products
    const products = await Product.insertMany(sampleFlowerProducts);
    console.log(`${products.length} flower products added successfully`);

    // Display created products
    products.forEach(product => {
      console.log(`- ${product.name} (₹${product.price})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedFlowerProducts();
}

module.exports = { seedFlowerProducts, sampleFlowerProducts };