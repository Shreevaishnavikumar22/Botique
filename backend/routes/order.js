const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
  getOrderStats
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.post('/', createOrder);
router.get('/stats', getOrderStats);
router.get('/:id', getOrder);
router.get('/', getUserOrders);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
