const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../config.env' });

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Cart = require('../models/Cart');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/battery-ecommerce');
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Clearing database...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Cart.deleteMany({});
    
    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    mongoose.connection.close();
  }
};

const exportData = async () => {
  try {
    await connectDB();
    
    console.log('Exporting data...');
    
    const users = await User.find({}).lean();
    const products = await Product.find({}).lean();
    const orders = await Order.find({}).lean();
    const reviews = await Review.find({}).lean();
    const carts = await Cart.find({}).lean();
    
    const exportData = {
      users,
      products,
      orders,
      reviews,
      carts,
      exportedAt: new Date().toISOString()
    };
    
    const exportPath = path.join(__dirname, 'exports', `data-export-${Date.now()}.json`);
    
    // Create exports directory if it doesn't exist
    const exportsDir = path.dirname(exportPath);
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
    console.log(`Data exported to: ${exportPath}`);
    
  } catch (error) {
    console.error('Error exporting data:', error);
  } finally {
    mongoose.connection.close();
  }
};

const importData = async (filePath) => {
  try {
    await connectDB();
    
    console.log(`Importing data from: ${filePath}`);
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (data.users) {
      await User.insertMany(data.users);
      console.log(`${data.users.length} users imported`);
    }
    
    if (data.products) {
      await Product.insertMany(data.products);
      console.log(`${data.products.length} products imported`);
    }
    
    if (data.orders) {
      await Order.insertMany(data.orders);
      console.log(`${data.orders.length} orders imported`);
    }
    
    if (data.reviews) {
      await Review.insertMany(data.reviews);
      console.log(`${data.reviews.length} reviews imported`);
    }
    
    if (data.carts) {
      await Cart.insertMany(data.carts);
      console.log(`${data.carts.length} carts imported`);
    }
    
    console.log('Data import completed successfully!');
    
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    mongoose.connection.close();
  }
};

const getStats = async () => {
  try {
    await connectDB();
    
    console.log('Getting database statistics...');
    
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const reviewCount = await Review.countDocuments();
    const cartCount = await Cart.countDocuments();
    
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$pricing.totalPrice' } } }
    ]);
    
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    
    console.log('\n=== DATABASE STATISTICS ===');
    console.log(`Users: ${userCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Orders: ${orderCount}`);
    console.log(`Reviews: ${reviewCount}`);
    console.log(`Active Carts: ${cartCount}`);
    console.log(`Total Revenue: ₹${revenue.toLocaleString()}`);
    
    // Product statistics
    const productStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalSold: { $sum: '$sold' }
        }
      }
    ]);
    
    console.log('\n=== PRODUCT STATISTICS BY CATEGORY ===');
    productStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} products, Stock: ${stat.totalStock}, Sold: ${stat.totalSold}`);
    });
    
    // Order statistics
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\n=== ORDER STATISTICS BY STATUS ===');
    orderStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} orders`);
    });
    
  } catch (error) {
    console.error('Error getting statistics:', error);
  } finally {
    mongoose.connection.close();
  }
};

const backupDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Creating database backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(__dirname, 'backups', `backup-${timestamp}.json`);
    
    // Create backups directory if it doesn't exist
    const backupsDir = path.dirname(backupPath);
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    
    const users = await User.find({}).lean();
    const products = await Product.find({}).lean();
    const orders = await Order.find({}).lean();
    const reviews = await Review.find({}).lean();
    const carts = await Cart.find({}).lean();
    
    const backup = {
      metadata: {
        timestamp,
        version: '1.0.0',
        database: 'battery-ecommerce'
      },
      collections: {
        users,
        products,
        orders,
        reviews,
        carts
      }
    };
    
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    console.log(`Backup created: ${backupPath}`);
    
    // Keep only last 10 backups
    const backupFiles = fs.readdirSync(backupsDir)
      .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(backupsDir, file),
        time: fs.statSync(path.join(backupsDir, file)).mtime
      }))
      .sort((a, b) => b.time - a.time);
    
    if (backupFiles.length > 10) {
      const filesToDelete = backupFiles.slice(10);
      filesToDelete.forEach(file => {
        fs.unlinkSync(file.path);
        console.log(`Deleted old backup: ${file.name}`);
      });
    }
    
  } catch (error) {
    console.error('Error creating backup:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Command line interface
const command = process.argv[2];
const argument = process.argv[3];

switch (command) {
  case 'clear':
    clearDatabase();
    break;
  case 'export':
    exportData();
    break;
  case 'import':
    if (!argument) {
      console.error('Please provide a file path for import');
      process.exit(1);
    }
    importData(argument);
    break;
  case 'stats':
    getStats();
    break;
  case 'backup':
    backupDatabase();
    break;
  default:
    console.log('Available commands:');
    console.log('  clear   - Clear all data from database');
    console.log('  export  - Export all data to JSON file');
    console.log('  import <file> - Import data from JSON file');
    console.log('  stats   - Show database statistics');
    console.log('  backup  - Create database backup');
    break;
}

module.exports = {
  connectDB,
  clearDatabase,
  exportData,
  importData,
  getStats,
  backupDatabase
};
