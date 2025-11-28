const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../config.env' });

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@flowerboutique.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin',
    isEmailVerified: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '9876543211',
    isEmailVerified: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '9876543212',
    isEmailVerified: true
  },
  {
    name: 'Demo User',
    email: 'demo@flowerboutique.com',
    password: 'demo123',
    phone: '9876543213',
    isEmailVerified: true
  }
];

const sampleProducts = [
  {
    name: 'Premium Red Rose Bouquet',
    description: 'Beautiful arrangement of 12 premium red roses, perfect for expressing love and romance. Hand-picked and professionally arranged.',
    price: 2500,
    originalPrice: 3000,
    category: 'Valentine\'s Day',
    brand: 'Rose Garden',
    model: 'RG-12R',
    capacity: { value: 12, unit: 'roses' },
    color: 'Red',
    freshness: { period: 7, unit: 'days' },
    features: [
      'Premium quality roses',
      'Hand-picked selection',
      'Professional arrangement',
      'Long-lasting freshness',
      'Elegant presentation'
    ],
    specifications: {
      weight: '1.2 kg',
      dimensions: '40 x 30 x 25 cm',
      material: 'Fresh Roses',
      color: 'Red',
      countryOfOrigin: 'India'
    },
    stock: 25,
    isFeatured: true,
    tags: ['roses', 'romance', 'bouquet', 'red', 'premium']
  },
  {
    name: 'Mixed Spring Bouquet',
    description: 'Vibrant mixed bouquet featuring tulips, daisies, and baby\'s breath. Perfect for celebrating spring and bringing joy to any occasion.',
    price: 1800,
    originalPrice: 2200,
    category: 'Birthday',
    brand: 'Spring Bloom',
    model: 'SB-MIX',
    capacity: { value: 15, unit: 'stems' },
    color: 'Multi-color',
    freshness: { period: 5, unit: 'days' },
    features: [
      'Mixed seasonal flowers',
      'Vibrant colors',
      'Fresh and fragrant',
      'Perfect for gifting',
      'Spring theme'
    ],
    specifications: {
      weight: '0.8 kg',
      dimensions: '35 x 25 x 20 cm',
      material: 'Mixed Fresh Flowers',
      color: 'Multi-color',
      countryOfOrigin: 'India'
    },
    stock: 20,
    isFeatured: true,
    tags: ['mixed', 'spring', 'colorful', 'bouquet', 'gift']
  },
  {
    name: 'White Lily Arrangement',
    description: 'Elegant white lilies arranged in a beautiful vase. Perfect for sympathy, weddings, or any special occasion requiring pure beauty.',
    price: 3200,
    originalPrice: 3800,
    category: 'Funeral',
    brand: 'Lily Garden',
    model: 'LG-WHITE',
    capacity: { value: 8, unit: 'lilies' },
    color: 'White',
    freshness: { period: 7, unit: 'days' },
    features: [
      'Pure white lilies',
      'Elegant presentation',
      'Long-lasting blooms',
      'Fragrant flowers',
      'Professional arrangement'
    ],
    specifications: {
      weight: '1.5 kg',
      dimensions: '45 x 35 x 30 cm',
      material: 'White Lilies',
      color: 'White',
      countryOfOrigin: 'India'
    },
    stock: 18,
    isFeatured: false,
    tags: ['lilies', 'white', 'elegant', 'sympathy', 'wedding']
  },
  {
    name: 'Sunflower Sunshine Bouquet',
    description: 'Bright and cheerful sunflower bouquet that brings sunshine to any room. Perfect for birthdays, congratulations, or just because.',
    price: 1500,
    originalPrice: 1800,
    category: 'Birthday',
    brand: 'Sunny Blooms',
    model: 'SB-SUN',
    capacity: { value: 6, unit: 'sunflowers' },
    color: 'Yellow',
    freshness: { period: 5, unit: 'days' },
    features: [
      'Bright yellow sunflowers',
      'Cheerful appearance',
      'Large blooms',
      'Perfect for celebrations',
      'Long-lasting beauty'
    ],
    specifications: {
      weight: '1.0 kg',
      dimensions: '50 x 30 x 25 cm',
      material: 'Sunflowers',
      color: 'Yellow',
      countryOfOrigin: 'India'
    },
    stock: 30,
    isFeatured: true,
    tags: ['sunflowers', 'yellow', 'cheerful', 'birthday', 'celebration']
  },
  {
    name: 'Orchid Elegance Arrangement',
    description: 'Exotic purple orchids in a modern ceramic pot. Perfect for home decoration or as a sophisticated gift for special occasions.',
    price: 4500,
    originalPrice: 5200,
    category: 'Anniversary',
    brand: 'Orchid House',
    model: 'OH-PURPLE',
    capacity: { value: 3, unit: 'orchids' },
    color: 'Purple',
    freshness: { period: 30, unit: 'days' },
    features: [
      'Exotic purple orchids',
      'Modern ceramic pot',
      'Long-lasting blooms',
      'Easy maintenance',
      'Sophisticated design'
    ],
    specifications: {
      weight: '2.0 kg',
      dimensions: '25 x 25 x 40 cm',
      material: 'Live Orchids',
      color: 'Purple',
      countryOfOrigin: 'India'
    },
    stock: 15,
    isFeatured: false,
    tags: ['orchids', 'purple', 'potted', 'exotic', 'elegant']
  },
  {
    name: 'Succulent Garden Set',
    description: 'Beautiful collection of 6 different succulents in decorative pots. Perfect for office desks, windowsills, or as gifts for plant lovers.',
    price: 1200,
    originalPrice: 1500,
    category: 'Potted Plants',
    brand: 'Succulent Studio',
    model: 'SS-6PK',
    capacity: { value: 6, unit: 'plants' },
    color: 'Green/Multi',
    freshness: { period: 14, unit: 'days' },
    features: [
      '6 different succulents',
      'Decorative pots',
      'Low maintenance',
      'Perfect for beginners',
      'Modern aesthetic'
    ],
    specifications: {
      weight: '1.5 kg',
      dimensions: '30 x 20 x 15 cm',
      material: 'Live Succulents',
      color: 'Green/Multi',
      countryOfOrigin: 'India'
    },
    stock: 40,
    isFeatured: true,
    tags: ['succulents', 'potted', 'low-maintenance', 'office', 'gift']
  },
  {
    name: 'Lavender Scented Candle',
    description: 'Hand-poured lavender scented candle with dried flower petals. Creates a relaxing atmosphere and makes a perfect gift.',
    price: 800,
    originalPrice: 1000,
    category: 'Floral Accessories',
    brand: 'Aroma Garden',
    model: 'AG-LAV',
    capacity: { value: 1, unit: 'candle' },
    color: 'Purple',
    freshness: { period: 365, unit: 'days' },
    features: [
      'Lavender fragrance',
      'Dried flower petals',
      'Hand-poured quality',
      'Long burn time',
      'Elegant packaging'
    ],
    specifications: {
      weight: '0.3 kg',
      dimensions: '8 x 8 x 10 cm',
      material: 'Soy Wax',
      color: 'Purple',
      countryOfOrigin: 'India'
    },
    stock: 35,
    isFeatured: false,
    tags: ['candle', 'lavender', 'scented', 'relaxing', 'gift']
  },
  {
    name: 'Dried Flower Wall Art',
    description: 'Beautiful pressed flower wall art featuring various dried flowers in a rustic wooden frame. Perfect for home decoration.',
    price: 2800,
    originalPrice: 3500,
    category: 'Floral Accessories',
    brand: 'Botanical Art',
    model: 'BA-DRIED',
    capacity: { value: 1, unit: 'artwork' },
    color: 'Natural',
    freshness: { period: 365, unit: 'days' },
    features: [
      'Pressed dried flowers',
      'Rustic wooden frame',
      'Handcrafted design',
      'Unique artwork',
      'Ready to hang'
    ],
    specifications: {
      weight: '0.8 kg',
      dimensions: '30 x 40 x 3 cm',
      material: 'Dried Flowers, Wood',
      color: 'Natural',
      countryOfOrigin: 'India'
    },
    stock: 15,
    isFeatured: true,
    tags: ['dried-flowers', 'wall-art', 'handcrafted', 'decoration', 'unique']
  },
  {
    name: 'Bridal Wedding Bouquet',
    description: 'Elegant white and pink rose bridal bouquet with baby\'s breath and eucalyptus. Perfect for your special wedding day.',
    price: 4500,
    originalPrice: 5500,
    category: 'Wedding',
    brand: 'Wedding Blooms',
    model: 'WB-BRIDAL',
    capacity: { value: 1, unit: 'bouquets' },
    color: 'White & Pink',
    freshness: { period: 3, unit: 'days' },
    features: [
      'Premium white and pink roses',
      'Baby\'s breath accents',
      'Eucalyptus greenery',
      'Professional bridal arrangement',
      'Ribbon wrapped handle'
    ],
    specifications: {
      weight: '1.8 kg',
      dimensions: '35 x 25 x 20 cm',
      material: 'Fresh Roses, Baby\'s Breath, Eucalyptus',
      color: 'White & Pink',
      countryOfOrigin: 'India'
    },
    stock: 12,
    isFeatured: true,
    tags: ['wedding', 'bridal', 'roses', 'white', 'pink', 'elegant']
  },
  {
    name: 'Sympathy Funeral Wreath',
    description: 'Respectful white and green funeral wreath with lilies, chrysanthemums, and ferns. Express your condolences with dignity.',
    price: 3800,
    originalPrice: 4500,
    category: 'Funeral',
    brand: 'Memorial Gardens',
    model: 'MG-WREATH',
    capacity: { value: 1, unit: 'wreaths' },
    color: 'White & Green',
    freshness: { period: 5, unit: 'days' },
    features: [
      'White lilies and chrysanthemums',
      'Green fern accents',
      'Circular wreath design',
      'Respectful presentation',
      'Stand included'
    ],
    specifications: {
      weight: '2.5 kg',
      dimensions: '60 x 60 x 15 cm',
      material: 'Fresh Lilies, Chrysanthemums, Ferns',
      color: 'White & Green',
      countryOfOrigin: 'India'
    },
    stock: 8,
    isFeatured: false,
    tags: ['funeral', 'sympathy', 'wreath', 'white', 'memorial', 'respectful']
  },
  {
    name: 'Mother\'s Day Pink Rose Bouquet',
    description: 'Beautiful pink rose bouquet with carnations and baby\'s breath. Perfect for showing appreciation to the special women in your life.',
    price: 2200,
    originalPrice: 2800,
    category: 'Mother\'s Day',
    brand: 'Garden Love',
    model: 'GL-MOM',
    capacity: { value: 18, unit: 'roses' },
    color: 'Pink',
    freshness: { period: 7, unit: 'days' },
    features: [
      'Pink roses and carnations',
      'Baby\'s breath filler',
      'Elegant ribbon wrapping',
      'Perfect for Mother\'s Day',
      'Heartfelt message card'
    ],
    specifications: {
      weight: '1.3 kg',
      dimensions: '40 x 30 x 25 cm',
      material: 'Fresh Pink Roses, Carnations',
      color: 'Pink',
      countryOfOrigin: 'India'
    },
    stock: 22,
    isFeatured: true,
    tags: ['mothers-day', 'pink', 'roses', 'carnations', 'appreciation']
  },
  {
    name: 'Anniversary Red Rose Arrangement',
    description: 'Romantic red rose arrangement in a beautiful vase. Perfect for celebrating anniversaries and expressing your love.',
    price: 3200,
    originalPrice: 3800,
    category: 'Anniversary',
    brand: 'Romance Blooms',
    model: 'RB-ANNIV',
    capacity: { value: 24, unit: 'roses' },
    color: 'Red',
    freshness: { period: 7, unit: 'days' },
    features: [
      '24 premium red roses',
      'Elegant glass vase',
      'Romantic presentation',
      'Perfect for anniversaries',
      'Love message card included'
    ],
    specifications: {
      weight: '2.0 kg',
      dimensions: '45 x 35 x 30 cm',
      material: 'Fresh Red Roses, Glass Vase',
      color: 'Red',
      countryOfOrigin: 'India'
    },
    stock: 16,
    isFeatured: true,
    tags: ['anniversary', 'red-roses', 'romantic', 'love', 'vase']
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flower-ecommerce');
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    // Using User.create() will trigger the pre-save hook for password hashing on each user
    const users = await User.create(sampleUsers);
    
    console.log(`${users.length} users created`);
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

const seedProducts = async (adminUser) => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    
    // Add createdBy field to all products
    const productsWithAdmin = sampleProducts.map(product => ({
      ...product,
      createdBy: adminUser._id,
      images: [
        {
          public_id: `flower-${product.brand.toLowerCase()}-${product.model.toLowerCase()}-1`,
          url: `https://via.placeholder.com/400x400/EC4899/FFFFFF?text=${product.brand}+${product.model}`,
          alt: `${product.name} - Main Image`
        },
        {
          public_id: `flower-${product.brand.toLowerCase()}-${product.model.toLowerCase()}-2`,
          url: `https://via.placeholder.com/400x400/F472B6/FFFFFF?text=${product.brand}+Detail`,
          alt: `${product.name} - Detail View`
        }
      ]
    }));
    
    const products = await Product.insertMany(productsWithAdmin);
    console.log(`${products.length} products created`);
    return products;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    // Seed users
    const users = await seedUsers();
    const adminUser = users.find(user => user.role === 'admin');
    
    // Seed products
    await seedProducts(adminUser);
    
    // Clear existing carts
    await Cart.deleteMany({});
    
    console.log('Database seeding completed successfully!');
    
    // Display seeded data info
    console.log('\n=== SEEDED DATA ===');
    console.log('Admin User:');
    console.log(`Email: admin@flowerboutique.com`);
    console.log(`Password: admin123`);
    console.log('\nDemo User:');
    console.log(`Email: demo@flowerboutique.com`);
    console.log(`Password: demo123`);
    console.log('\nOther Users:');
    sampleUsers
      .filter(user => user.email !== 'admin@flowerboutique.com' && user.email !== 'demo@flowerboutique.com')
      .forEach(user => {
        console.log(`Email: ${user.email}, Password: ${user.password}`);
      });
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleUsers, sampleProducts };
