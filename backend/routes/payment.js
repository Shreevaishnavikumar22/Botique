const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/orders', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/getkey', getKey);

module.exports = router;
