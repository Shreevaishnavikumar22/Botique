const express = require('express');
const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUser,
  deleteUser,
  getSalesReport,
  getTopProducts,
  getLowStockProducts
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Reports
router.get('/sales-report', getSalesReport);
router.get('/top-products', getTopProducts);
router.get('/low-stock', getLowStockProducts);

module.exports = router;
